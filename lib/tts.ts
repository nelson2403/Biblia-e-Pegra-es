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
function chaveDoAudio(texto: string, voz: string, formato: Formato): string {
  const sufixo = formato === 'opus' ? '|opus' : ''
  return createHash('sha256').update(`${voz}|${texto}${sufixo}`).digest('hex').slice(0, 40)
}

/**
 * Opus ocupa cerca de metade do MP3 para a mesma voz — o que importa muito
 * quando o usuário baixa capítulos para ouvir sem internet. Nem todo aparelho
 * toca Ogg/Opus (Safari antigo, principalmente), então o cliente informa o que
 * consegue e guardamos os dois formatos em cache separado.
 */
export type Formato = 'mp3' | 'opus'

export function formatoValido(f: unknown): Formato {
  return f === 'opus' ? 'opus' : 'mp3'
}

let baldeVerificado = false

const TIPOS_ACEITOS = ['audio/mpeg', 'audio/ogg', 'audio/opus', 'audio/webm']

/**
 * Garante que o balde existe E aceita os formatos que usamos hoje.
 *
 * A correção do balde existente não é zelo excessivo: o balde foi criado
 * aceitando só MP3, e quando o app passou a gerar Opus todos os uploads
 * começaram a ser recusados em silêncio — o áudio parou de tocar no app
 * inteiro. Conferir a configuração, e não só a existência, evita repetir isso
 * a cada formato novo.
 */
async function garantirBalde() {
  if (baldeVerificado) return
  const admin = getSupabaseAdmin()

  const { data } = await admin.storage.getBucket(BALDE)

  if (!data) {
    await admin.storage.createBucket(BALDE, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
      allowedMimeTypes: TIPOS_ACEITOS,
    })
  } else {
    // O SDK devolve o campo em snake_case, diferente do que aceita ao criar.
    const aceitos: string[] = (data as { allowed_mime_types?: string[] | null }).allowed_mime_types ?? []
    const faltando = aceitos.length > 0 && TIPOS_ACEITOS.some(t => !aceitos.includes(t))
    if (faltando) {
      console.warn('[tts] balde desatualizado; corrigindo os formatos aceitos')
      await admin.storage.updateBucket(BALDE, {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024,
        allowedMimeTypes: TIPOS_ACEITOS,
      })
    }
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
export async function sintetizar(
  texto: string,
  voz: string,
  formato: Formato = 'mp3'
): Promise<AudioGerado> {
  const chave = process.env.GOOGLE_TTS_API_KEY
  if (!chave) throw new Error('GOOGLE_TTS_API_KEY não configurada.')

  const limpo = texto.replace(/\s+/g, ' ').trim()
  if (!limpo) throw new Error('Texto vazio.')
  // Limite da API é 5000 bytes; os blocos do leitor são bem menores.
  if (limpo.length > 4500) throw new Error('Trecho longo demais para sintetizar.')

  await garantirBalde()
  const admin = getSupabaseAdmin()
  const extensao = formato === 'opus' ? 'ogg' : 'mp3'
  const tipoMime = formato === 'opus' ? 'audio/ogg' : 'audio/mpeg'
  const caminho = `${chaveDoAudio(limpo, voz, formato)}.${extensao}`

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
        audioEncoding: formato === 'opus' ? 'OGG_OPUS' : 'MP3',
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
    contentType: tipoMime,
    cacheControl: '31536000',
    upsert: true,
  })

  if (error) {
    // O cache é otimização, não requisito. Falhar aqui derrubava a leitura em
    // voz alta do app inteiro; agora devolvemos o áudio pronto e apenas
    // registramos o problema — o usuário ouve, e o próximo acesso tenta de novo.
    console.error('[tts] nao consegui guardar em cache:', error.message)
    return {
      url: `data:${tipoMime};base64,${base64}`,
      reaproveitado: false,
    }
  }

  return { url: publico.publicUrl, reaproveitado: false }
}
