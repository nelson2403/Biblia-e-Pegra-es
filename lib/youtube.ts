export interface VideoSugerido {
  id: string
  titulo: string
  canal: string
  canalId: string
}

const BUSCA = 'https://www.googleapis.com/youtube/v3/search'

/**
 * Canais em que você confia, separados por vírgula, no formato UC...
 * Ex.: YOUTUBE_CANAIS=UCxxxx,UCyyyy
 *
 * Com a lista preenchida, a busca acontece SÓ dentro desses canais.
 * Vazia, o app procura no YouTube inteiro — o que traz conteúdo de qualquer
 * origem para dentro do seu app, com a sua marca em volta. Recomendo preencher.
 */
function canaisConfiaveis(): string[] {
  return (process.env.YOUTUBE_CANAIS ?? '')
    .split(',')
    .map(c => c.trim())
    .filter(c => /^UC[\w-]{20,}$/.test(c))
}

interface ItemBusca {
  id?: { videoId?: string }
  snippet?: { title?: string; channelTitle?: string; channelId?: string }
}

async function procurar(termo: string, canalId?: string): Promise<VideoSugerido | null> {
  const chave = process.env.YOUTUBE_API_KEY
  if (!chave) return null

  const params = new URLSearchParams({
    key: chave,
    part: 'snippet',
    q: termo,
    type: 'video',
    maxResults: '3',
    // Só vídeos que podem ser tocados dentro do app.
    videoEmbeddable: 'true',
    videoSyndicated: 'true',
    safeSearch: 'strict',
    relevanceLanguage: 'pt',
    regionCode: 'BR',
    order: 'relevance',
    // Vídeos muito longos não servem para um devocional diário.
    videoDuration: 'medium',
  })
  if (canalId) params.set('channelId', canalId)

  try {
    const res = await fetch(`${BUSCA}?${params}`, { next: { revalidate: 0 } })
    if (!res.ok) {
      const corpo = await res.text().catch(() => '')
      console.error('[youtube] HTTP', res.status, corpo.slice(0, 200))
      return null
    }

    const dados = await res.json()
    const item: ItemBusca | undefined = (dados.items ?? []).find((i: ItemBusca) => i?.id?.videoId)
    if (!item?.id?.videoId) return null

    return {
      id: item.id.videoId,
      titulo: item.snippet?.title ?? 'Vídeo do estudo',
      canal: item.snippet?.channelTitle ?? '',
      canalId: item.snippet?.channelId ?? '',
    }
  } catch (e: any) {
    console.error('[youtube] erro:', e?.message)
    return null
  }
}

/**
 * Procura um vídeo que combine com o estudo do dia.
 * Nunca lança: sem chave, sem cota ou sem resultado, o app simplesmente
 * não mostra vídeo naquele dia.
 */
export async function buscarVideoDoEstudo(
  tema: string,
  referencia: string
): Promise<VideoSugerido | null> {
  const termo = `${tema} ${referencia} estudo bíblico pregação`
  const canais = canaisConfiaveis()

  if (canais.length === 0) {
    return procurar(termo)
  }

  // Uma busca por canal (100 unidades de cota cada). Fica no primeiro que responder.
  for (const canalId of canais.slice(0, 5)) {
    const achado = await procurar(termo, canalId)
    if (achado) return achado
  }

  return null
}
