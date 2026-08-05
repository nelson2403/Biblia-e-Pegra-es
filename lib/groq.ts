const GROQ_BASE = 'https://api.groq.com/openai/v1'

/** Modelos usados no app. Centralizados para trocar em um lugar só. */
export const GROQ_MODELS = {
  /** Conversa e geração de conteúdo longo (conselheiro, pregações, estudo do dia). */
  texto: 'llama-3.3-70b-versatile',
  /** Tarefas rápidas e baratas (títulos, resumos, tags). */
  rapido: 'llama-3.1-8b-instant',
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
  /** Força a resposta a ser um JSON válido (json_object mode da Groq). */
  json?: boolean
}

/** Chamada de chat completion. Lança GroqError com mensagem legível em caso de falha. */
export async function groqChat({
  messages,
  model = GROQ_MODELS.texto,
  temperature = 0.7,
  maxTokens = 1024,
  json = false,
}: ChatOptions): Promise<string> {
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
      max_tokens: maxTokens,
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new GroqError(data?.error?.message ?? `Erro HTTP ${res.status} da IA.`)
  }

  const texto: string | undefined = data?.choices?.[0]?.message?.content
  if (!texto) throw new GroqError('A IA não retornou resposta. Tente novamente.')

  return texto
}

/** Igual ao groqChat, mas já devolve o objeto parseado. */
export async function groqJson<T>(opts: ChatOptions): Promise<T> {
  const texto = await groqChat({ ...opts, json: true })
  const limpo = texto.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  try {
    return JSON.parse(limpo) as T
  } catch {
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
