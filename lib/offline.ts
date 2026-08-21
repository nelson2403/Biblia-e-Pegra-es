/**
 * Conteúdo guardado no aparelho para funcionar sem internet.
 *
 * Usa a Cache Storage do navegador (a mesma que o service worker usa), e não
 * localStorage: são megabytes de JSON, e o localStorage tem limite de ~5 MB
 * e é síncrono, o que travaria a tela durante a gravação.
 */

const CACHE = 'biblia-offline-v1'

export interface RecursoOffline {
  id: string
  nome: string
  descricao: string
  url: string
  /** Tamanho aproximado em MB, para avisar antes de baixar. */
  mb: number
}

/** Traduções da Bíblia. Os códigos batem com os da tela de leitura. */
export const TRADUCOES_OFFLINE: RecursoOffline[] = [
  {
    id: 'aa',
    nome: 'Almeida Atualizada',
    descricao: 'A tradução padrão do app',
    url: 'https://cdn.jsdelivr.net/gh/thiagobodruk/biblia@master/json/aa.json',
    mb: 3.8,
  },
  {
    id: 'nvi',
    nome: 'Nova Versão Internacional',
    descricao: 'Linguagem mais atual',
    url: 'https://cdn.jsdelivr.net/gh/thiagobodruk/biblia@master/json/nvi.json',
    mb: 3.8,
  },
  {
    id: 'arc',
    nome: 'Almeida Revista e Corrigida',
    descricao: 'A mais tradicional',
    url: 'https://cdn.jsdelivr.net/gh/thiagobodruk/biblia@master/json/acf.json',
    mb: 3.8,
  },
]

export function suportaOffline(): boolean {
  return typeof window !== 'undefined' && 'caches' in window
}

/** Quais recursos já estão guardados. */
export async function jaBaixados(): Promise<Set<string>> {
  if (!suportaOffline()) return new Set()
  try {
    const cache = await caches.open(CACHE)
    const presentes = new Set<string>()
    for (const r of TRADUCOES_OFFLINE) {
      if (await cache.match(r.url)) presentes.add(r.id)
    }
    return presentes
  } catch {
    return new Set()
  }
}

/** Serve um recurso do aparelho, quando existir. */
export async function doCache(url: string): Promise<Response | undefined> {
  if (!suportaOffline()) return undefined
  try {
    const cache = await caches.open(CACHE)
    return await cache.match(url)
  } catch {
    return undefined
  }
}

export interface Progresso {
  /** Recurso sendo baixado agora. */
  atual: string
  concluidos: number
  total: number
}

/**
 * Baixa o que ainda falta. Pula o que já existe, então pode ser chamado a
 * cada abertura do app sem gastar dados à toa.
 */
export async function baixarPendentes(
  ids: string[],
  aoProgredir?: (p: Progresso) => void
): Promise<{ baixados: number; falhas: string[] }> {
  if (!suportaOffline()) return { baixados: 0, falhas: [] }

  const cache = await caches.open(CACHE)
  const alvo = TRADUCOES_OFFLINE.filter(r => ids.includes(r.id))
  const falhas: string[] = []
  let baixados = 0

  for (let i = 0; i < alvo.length; i++) {
    const r = alvo[i]
    aoProgredir?.({ atual: r.nome, concluidos: i, total: alvo.length })

    if (await cache.match(r.url)) continue

    try {
      // `cache.add` refaz a requisição e não deixa o corpo disponível para
      // acompanhar o progresso; buscamos e gravamos manualmente para poder
      // reportar o andamento e detectar erro de rede de verdade.
      const res = await fetch(r.url, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await cache.put(r.url, res)
      baixados++
    } catch {
      falhas.push(r.nome)
    }
  }

  aoProgredir?.({ atual: '', concluidos: alvo.length, total: alvo.length })
  return { baixados, falhas }
}

/** Guarda os áudios do devocional de hoje, para ouvir sem internet. */
export async function guardarAudios(urls: string[]): Promise<number> {
  if (!suportaOffline() || urls.length === 0) return 0
  const cache = await caches.open(CACHE)
  let n = 0
  for (const url of urls) {
    try {
      if (await cache.match(url)) continue
      const res = await fetch(url)
      if (res.ok) { await cache.put(url, res); n++ }
    } catch {
      // Um áudio que falha não deve interromper os demais.
    }
  }
  return n
}

export async function limpar(): Promise<void> {
  if (!suportaOffline()) return
  await caches.delete(CACHE)
}

/** Espaço ocupado pelo app no aparelho, em MB. */
export async function espacoUsado(): Promise<number | null> {
  if (typeof navigator === 'undefined' || !navigator.storage?.estimate) return null
  try {
    const { usage } = await navigator.storage.estimate()
    return usage ? Math.round((usage / 1048576) * 10) / 10 : null
  } catch {
    return null
  }
}
