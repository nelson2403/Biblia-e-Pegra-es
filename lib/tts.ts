import { createHash } from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

const SINTETIZAR = 'https://texttospeech.googleapis.com/v1/text:synthesize'
const BALDE = 'audio-tts'

/** Vozes neurais em português do Brasil oferecidas no app. */
export const VOZES = [
  { id: 'pt-BR-Neural2-B', rotulo: 'Daniel', descricao: 'Masculina, serena' },
  { id: 'pt-BR-Neural2-C', rotulo: 'Ester', descricao: 'Feminina, clara' },
  { id: 'pt-BR-Neural2-A', rotulo: 'Ana', descricao: 'Feminina, suave' },
  { id: 'pt-BR-Wavenet-B', rotulo: 'Tiago', descricao: 'Masculina, firme' },
] as const

export const VOZ_PADRAO = 'pt-BR-Neural2-B'

export function vozValida(v: string | undefined | null): string {
  return VOZES.some(x => x.id === v) ? (v as string) : VOZ_PADRAO
}

export function temChaveTTS(): boolean {
  return !!process.env.GOOGLE_TTS_API_KEY
}

/**
 * Mesma frase e mesma voz geram sempre o mesmo arquivo.
 * A velocidade fica FORA da chave de propósito: o áudio é gerado sempre em
 * ritmo natural e a aceleração acontece no aparelho (playbackRate). Assim um
 * mesmo versículo serve para quem ouve em 0,7× e para quem ouve em 1,5×,
 * em vez de gerar — e cobrar — um arquivo por velocidade.
 */
function chaveDoAudio(texto: string, voz: string): string {
  return createHash('sha256').update(`${voz}|${texto}`).digest('hex').slice(0, 40)
}

let baldeVerificado = false

/** Cria o balde público na primeira execução. Ignora "já existe". */
async function garantirBalde() {
  if (baldeVerificado) return
  const admin = getSupabaseAdmin()
  const { data } = await admin.storage.getBucket(BALDE)
  if (!data) {
    await admin.storage.createBucket(BALDE, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
      allowedMimeTypes: ['audio/mpeg'],
    })
  }
  baldeVerificado = true
}

/**
 * Envolve o texto em SSML para a leitura soar humana em vez de corrida:
 * pausa depois da pontuação e ênfase leve nas referências bíblicas.
 */
function comoSSML(texto: string): string {
  const escapado = texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

  const comPausas = escapado
    .replace(/([.!?])\s+/g, '$1<break time="450ms"/> ')
    .replace(/([,;:])\s+/g, '$1<break time="220ms"/> ')
    // "João 3:16" lido como "João três, dezesseis" soa melhor com uma pausa curta.
    .replace(/(\d+):(\d+)/g, '$1<break time="120ms"/>:$2')

  return `<speak>${comPausas}</speak>`
}

export interface AudioGerado {
  url: string
  /** true quando veio do cache — útil para saber se gastou cota. */
  reaproveitado: boolean
}

/**
 * Devolve a URL pública do áudio da frase, gerando na Google apenas se ainda
 * não existir. O cache é o que segura o custo: cada trecho da Bíblia é
 * sintetizado uma única vez e depois serve para todos os usuários.
 */
export async function sintetizar(texto: string, voz: string): Promise<AudioGerado> {
  const chave = process.env.GOOGLE_TTS_API_KEY
  if (!chave) throw new Error('GOOGLE_TTS_API_KEY não configurada.')

  const limpo = texto.replace(/\s+/g, ' ').trim()
  if (!limpo) throw new Error('Texto vazio.')
  // Limite da API é 5000 bytes; os blocos do leitor são bem menores.
  if (limpo.length > 4500) throw new Error('Trecho longo demais para sintetizar.')

  await garantirBalde()
  const admin = getSupabaseAdmin()
  const caminho = `${chaveDoAudio(limpo, voz)}.mp3`

  const { data: publico } = admin.storage.from(BALDE).getPublicUrl(caminho)

  // Já existe? Evita gastar cota e responde na hora.
  const { data: achados } = await admin.storage
    .from(BALDE)
    .list('', { search: caminho, limit: 1 })

  if (achados?.some(a => a.name === caminho)) {
    return { url: publico.publicUrl, reaproveitado: true }
  }

  const res = await fetch(`${SINTETIZAR}?key=${chave}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { ssml: comoSSML(limpo) },
      voice: { languageCode: 'pt-BR', name: voz },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1,
        pitch: 0,
        // Perfil de fone/celular: deixa a voz mais presente no aparelho.
        effectsProfileId: ['handset-class-device'],
      },
    }),
  })

  const dados = await res.json().catch(() => null)

  if (!res.ok) {
    const msg = dados?.error?.message ?? `HTTP ${res.status}`
    console.error('[tts] Google:', msg)
    throw new Error(`Erro ao gerar a voz: ${msg}`)
  }

  const base64: string | undefined = dados?.audioContent
  if (!base64) throw new Error('A Google não devolveu áudio.')

  const bytes = Buffer.from(base64, 'base64')
  const { error } = await admin.storage.from(BALDE).upload(caminho, bytes, {
    contentType: 'audio/mpeg',
    cacheControl: '31536000',
    upsert: true,
  })

  if (error) {
    console.error('[tts] erro ao guardar:', error.message)
    throw new Error('Não foi possível guardar o áudio gerado.')
  }

  return { url: publico.publicUrl, reaproveitado: false }
}
