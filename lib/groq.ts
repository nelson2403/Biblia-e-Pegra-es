const GROQ_BASE = 'https://api.groq.com/openai/v1'

/**
 * Modelos usados no app. Centralizados para trocar em um lugar só.
 *
 * A Groq desativa modelos antigos sem aviso — o llama-3.3-70b-versatile, usado
 * até aqui, foi descontinuado e derrubou o devocional, o conselheiro e as
 * pregações de uma vez. Se voltar a acontecer, rode `npm run modelos` para ver
 * o que a conta tem disponível hoje e ajuste aqui.
 */
export const GROQ_MODELS = {
  /** Conversa e geração de conteúdo longo (conselheiro, pregações, estudo do dia). */
  texto: 'openai/gpt-oss-120b',
  /** Tarefas rápidas e baratas (títulos, resumos, tags). */
  rapido: 'openai/gpt-oss-20b',
  /** Transcrição de áudio multilíngue (português incluído). */
  audio: 'whisper-large-v3',
} as const

export class GroqError extends Error {
  status: number
  constructor(message: string, status = 502) {
    super(message)
    this.name = 'GroqError'
    this.status = status
  }
}

export function getGroqKey(): string {
  const key = process.env.GROQ_API_KEY
  if (!key || key === 'sua_chave_aqui') {
    throw new GroqError('Chave GROQ_API_KEY não configurada no servidor.', 500)
  }
  return key
}

interface ChatOptions {
  messages: { role: string; content: string }[]
  model?: string
  temperature?: number
  maxTokens?: number
  /**
   * Pede JSON de volta. Os modelos atuais raciocinam antes de responder e o
   * modo `json_object` da Groq falha com eles ("Failed to validate JSON"),
   * então instruímos pelo prompt e validamos no parse.
   */
  json?: boolean
  /**
   * Esforço de raciocínio: 'low' é bem mais rápido e basta para tarefas
   * objetivas; deixe vazio quando a qualidade do texto importa mais.
   */
  esforco?: 'low' | 'medium' | 'high'
}

/** Chamada de chat completion. Lança GroqError com mensagem legível em caso de falha. */
export async function groqChat({
  messages,
  model = GROQ_MODELS.texto,
  temperature = 0.7,
  maxTokens = 1024,
  json = false,
  esforco,
}: ChatOptions): Promise<string> {
  // Modelos de raciocínio gastam tokens pensando antes de escrever; com o teto
  // apertado a resposta vem truncada no meio.
  const teto = esforco === 'low' ? maxTokens : Math.round(maxTokens * 1.6)

  async function tentar(limite: number, esforcoUsado?: 'low' | 'medium' | 'high') {
    const res = await fetch(`${GROQ_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getGroqKey()}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: limite,
        ...(esforcoUsado ? { reasoning_effort: esforcoUsado } : {}),
      }),
    })

    const dados = await res.json().catch(() => null)

    if (!res.ok) {
      // 429 = cota por minuto estourada. O cabeçalho diz quanto esperar;
      // uma pausa curta resolve, em vez de perder o devocional do dia.
      if (res.status === 429) {
        const espera = Math.min(20, Math.ceil(Number(res.headers.get('retry-after') ?? 8)))
        throw new GroqError(
          `LIMITE:${espera}:${dados?.error?.message ?? 'Cota por minuto excedida.'}`,
          429
        )
      }
      throw new GroqError(dados?.error?.message ?? `Erro HTTP ${res.status} da IA.`)
    }

    return {
      texto: dados?.choices?.[0]?.message?.content as string | undefined,
      motivo: dados?.choices?.[0]?.finish_reason as string | undefined,
    }
  }

  async function tentarComEspera(limite: number, esforcoUsado?: 'low' | 'medium' | 'high') {
    try {
      return await tentar(limite, esforcoUsado)
    } catch (e) {
      if (e instanceof GroqError && e.status === 429) {
        const segundos = Number(e.message.split(':')[1]) || 8
        console.warn(`[groq] cota por minuto atingida; aguardando ${segundos}s`)
        await new Promise(r => setTimeout(r, segundos * 1000))
        return tentar(limite, esforcoUsado)
      }
      throw e
    }
  }

  let { texto, motivo } = await tentarComEspera(teto, esforco)

  // Os modelos de raciocínio às vezes gastam todo o orçamento pensando e
  // devolvem conteúdo vazio. Não é erro permanente: uma segunda tentativa
  // com raciocínio baixo resolve. O teto não cresce, para não estourar a cota.
  if (!texto) {
    console.warn(`[groq] resposta vazia (finish_reason=${motivo}); tentando de novo`)
    ;({ texto } = await tentarComEspera(teto, 'low'))
  }

  if (!texto) throw new GroqError('A IA não retornou resposta. Tente novamente.')

  return texto
}

/**
 * Igual ao groqChat, mas devolve o objeto já parseado.
 * Tolera cerca de markdown e texto solto em volta do JSON, que os modelos de
 * raciocínio às vezes acrescentam apesar da instrução.
 */
export async function groqJson<T>(opts: ChatOptions): Promise<T> {
  const texto = await groqChat({ ...opts, json: true })

  let limpo = texto.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  // Sobrou texto antes ou depois? Recorta do primeiro { até o último }.
  if (!limpo.startsWith('{')) {
    const inicio = limpo.indexOf('{')
    const fim = limpo.lastIndexOf('}')
    if (inicio >= 0 && fim > inicio) limpo = limpo.slice(inicio, fim + 1)
  }

  try {
    return JSON.parse(limpo) as T
  } catch {
    console.error('[groq] resposta não-JSON:', limpo.slice(0, 300))
    throw new GroqError('A IA devolveu um formato inesperado. Tente novamente.')
  }
}

/** Transcrição de áudio via Whisper. Recebe o arquivo já pronto do FormData. */
export async function groqTranscrever(
  arquivo: Blob,
  nomeArquivo: string,
  prompt?: string
): Promise<string> {
  const form = new FormData()
  form.append('file', arquivo, nomeArquivo)
  form.append('model', GROQ_MODELS.audio)
  form.append('language', 'pt')
  form.append('response_format', 'json')
  form.append('temperature', '0')
  if (prompt) form.append('prompt', prompt)

  const res = await fetch(`${GROQ_BASE}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getGroqKey()}` },
    body: form,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new GroqError(data?.error?.message ?? `Erro HTTP ${res.status} ao transcrever.`)
  }

  const texto: string | undefined = data?.text
  if (typeof texto !== 'string') throw new GroqError('Não foi possível transcrever o áudio.')

  return texto.trim()
}
