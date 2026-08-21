import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { groqJson, GROQ_MODELS } from '@/lib/groq'
import { versiculoDoDia } from '@/data/versiculosDiarios'
import { buscarVideoDoEstudo } from '@/lib/youtube'
import type { ConteudoDiario, PontoEstudo } from '@/types'

/** Data de hoje no fuso de São Paulo, no formato YYYY-MM-DD. */
export function hojeISO(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
}

const PAPEL =
  'Você é um pastor e professor de Bíblia evangélico, fiel às Escrituras e cuidadoso com o texto sagrado. ' +
  'Escreve em português brasileiro, com linguagem pastoral e acessível. Responde sempre em JSON válido.'

const REGRAS = `REGRAS OBRIGATÓRIAS:
- NUNCA invente nem altere o texto de um versículo. Cite apenas referências que você tem certeza absoluta.
- Nada de markdown, asteriscos ou títulos com #. Texto corrido puro.
- O texto será lido em voz alta por um leitor de tela: frases claras e bem pontuadas.
- Escreva com profundidade. Respostas curtas e genéricas são INACEITÁVEIS — desenvolva cada ideia
  com explicação, contexto e exemplo concreto do cotidiano.`

function contar(texto: string): number {
  return texto.trim().split(/\s+/).filter(Boolean).length
}

function dataPorExtenso(data: string): string {
  return new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

// ── Devocional ────────────────────────────────────────────────────────────

interface Devocional {
  reflexao: string
  oracao: string
}

async function gerarDevocional(
  versiculo: string,
  ref: string,
  tema: string,
  data: string,
  insistir = false
): Promise<Devocional> {
  return groqJson<Devocional>({
    model: GROQ_MODELS.texto,
    temperature: 0.8,
    // Cabe no limite de 8000 tokens por minuto do plano gratuito da Groq.
    maxTokens: 1500,
    esforco: 'low',
    messages: [
      { role: 'system', content: PAPEL },
      {
        role: 'user',
        content: `Hoje é ${dataPorExtenso(data)}. O versículo do dia é:

"${versiculo}" — ${ref}
Tema central: ${tema}

Escreva o devocional de hoje sobre esse versículo.

${REGRAS}

A reflexão deve ter NO MÍNIMO 8 frases completas (entre 140 e 190 palavras). Estruture assim:
abra situando o versículo, explique o que ele significa, traga uma situação concreta do dia a dia
onde isso se aplica, e feche com um convite prático.${insistir ? '\n\nATENÇÃO: sua resposta anterior ficou curta demais. Escreva o texto completo desta vez.' : ''}

Responda apenas com JSON:
{
  "reflexao": "A reflexão completa, mínimo 140 palavras.",
  "oracao": "Uma oração em primeira pessoa, de 40 a 60 palavras, ligada ao versículo."
}`,
      },
    ],
  })
}

// ── Estudo ────────────────────────────────────────────────────────────────

interface Estudo {
  titulo: string
  subtitulo: string
  texto_base: string
  introducao: string
  pontos: PontoEstudo[]
  aplicacao: string
  conclusao: string
}

async function gerarEstudo(
  versiculo: string,
  ref: string,
  tema: string,
  data: string,
  insistir = false
): Promise<Estudo> {
  return groqJson<Estudo>({
    model: GROQ_MODELS.texto,
    temperature: 0.75,
    maxTokens: 3600,
    esforco: 'low',
    messages: [
      { role: 'system', content: PAPEL },
      {
        role: 'user',
        content: `Prepare o estudo bíblico do dia ${dataPorExtenso(data)}, a partir deste texto:

"${versiculo}" — ${ref}
Tema central: ${tema}

${REGRAS}

TAMANHOS MÍNIMOS (respeite rigorosamente):
- introducao: no mínimo 6 frases (120 a 160 palavras), situando o texto e seu contexto bíblico.
- cada ponto: no mínimo 7 frases (130 a 170 palavras). Explique a ideia, mostre como ela aparece
  na Escritura e aterrisse na vida real. Um ponto raso não serve.
- aplicacao: no mínimo 5 frases (110 a 150 palavras), com atitudes concretas para hoje.
- conclusao: no mínimo 4 frases (90 a 130 palavras).

São exatamente 3 pontos.${insistir ? '\n\nATENÇÃO: sua resposta anterior ficou curta demais. Desenvolva cada seção por completo desta vez.' : ''}

Responda apenas com JSON:
{
  "titulo": "Título curto e marcante",
  "subtitulo": "Uma linha que resume a ideia central",
  "texto_base": "${ref}",
  "introducao": "...",
  "pontos": [
    { "titulo": "...", "referencia": "Livro 0:0", "conteudo": "..." },
    { "titulo": "...", "referencia": "Livro 0:0", "conteudo": "..." },
    { "titulo": "...", "referencia": "Livro 0:0", "conteudo": "..." }
  ],
  "aplicacao": "...",
  "conclusao": "..."
}`,
      },
    ],
  })
}

// ── Montagem ──────────────────────────────────────────────────────────────

function normalizarPontos(pontos: unknown): PontoEstudo[] {
  if (!Array.isArray(pontos)) return []
  return pontos
    .filter((p): p is Record<string, unknown> => !!p && typeof p === 'object')
    .map(p => ({
      titulo: String(p.titulo ?? '').trim(),
      referencia: String(p.referencia ?? '').trim(),
      conteudo: String(p.conteudo ?? '').trim(),
    }))
    .filter(p => p.titulo && p.conteudo)
}

/** O modelo às vezes encurta demais; nesse caso vale uma segunda tentativa. */
function devocionalRaso(d: Devocional): boolean {
  return contar(d?.reflexao ?? '') < 110
}

function estudoRaso(e: Estudo): boolean {
  const pontos = normalizarPontos(e?.pontos)
  if (pontos.length < 3) return true
  const mediaPontos = pontos.reduce((s, p) => s + contar(p.conteudo), 0) / pontos.length
  return contar(e?.introducao ?? '') < 95 || mediaPontos < 100
}

/**
 * Devolve o conteúdo do dia, gerando-o com a IA apenas na primeira vez.
 * A linha é partilhada por todos os usuários — no máximo duas chamadas à Groq por dia.
 */
export async function obterConteudoDiario(data = hojeISO()): Promise<ConteudoDiario> {
  const admin = getSupabaseAdmin()

  const { data: existente } = await admin
    .from('conteudo_diario')
    .select('*')
    .eq('data', data)
    .maybeSingle()

  if (existente) return existente as ConteudoDiario

  const v = versiculoDoDia(data)

  // Duas chamadas focadas rendem muito mais profundidade que uma só pedindo tudo.
  //
  // Elas rodam EM SEQUÊNCIA, não em paralelo: o plano gratuito da Groq limita
  // 8000 tokens por minuto, e disparar as duas juntas soma os orçamentos e
  // estoura o teto. O vídeo pode ir junto porque não consome cota da Groq.
  const [devocionalInicial, video] = await Promise.all([
    gerarDevocional(v.texto, v.ref, v.tema, data),
    buscarVideoDoEstudo(v.tema, v.ref),
  ])
  let devocional = devocionalInicial
  let estudo = await gerarEstudo(v.texto, v.ref, v.tema, data)

  if (devocionalRaso(devocional)) {
    devocional = await gerarDevocional(v.texto, v.ref, v.tema, data, true).catch(() => devocional)
  }
  if (estudoRaso(estudo)) {
    estudo = await gerarEstudo(v.texto, v.ref, v.tema, data, true).catch(() => estudo)
  }

  const pontos = normalizarPontos(estudo?.pontos)

  const linha = {
    data,
    versiculo_texto: v.texto,
    versiculo_ref: v.ref,
    reflexao: (devocional.reflexao ?? '').trim(),
    oracao: (devocional.oracao ?? '').trim() || null,
    estudo_titulo: (estudo?.titulo ?? '').trim() || `Meditando em ${v.ref}`,
    estudo_subtitulo: (estudo?.subtitulo ?? '').trim() || v.tema,
    estudo_texto_base: (estudo?.texto_base ?? '').trim() || v.ref,
    estudo_introducao: (estudo?.introducao ?? '').trim() || null,
    estudo_pontos: pontos,
    estudo_aplicacao: (estudo?.aplicacao ?? '').trim() || null,
    estudo_conclusao: (estudo?.conclusao ?? '').trim() || null,
    video_id: video?.id ?? null,
    video_titulo: video?.titulo ?? null,
    video_canal: video?.canal ?? null,
    video_canal_id: video?.canalId ?? null,
    gerado_por: 'ia',
  }

  if (!linha.reflexao) {
    throw new Error('A IA não devolveu a reflexão do dia.')
  }

  // upsert e não insert: se dois pedidos chegarem juntos, o segundo apenas reaproveita.
  const { data: salvo, error } = await admin
    .from('conteudo_diario')
    .upsert(linha, { onConflict: 'data', ignoreDuplicates: false })
    .select()
    .single()

  if (error) throw new Error(`Erro ao salvar o conteúdo do dia: ${error.message}`)

  return salvo as ConteudoDiario
}
