'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { doCache, guardarAudios, suportaOffline } from '@/lib/offline'
import type { BlocoLeitura } from '@/hooks/useLeitor'

/**
 * Opus ocupa cerca de metade do MP3. Nem todo aparelho toca Ogg/Opus —
 * Safari só passou a suportar em versões recentes — então perguntamos ao
 * próprio navegador antes de pedir esse formato.
 */
function formatoSuportado(): 'opus' | 'mp3' {
  if (typeof window === 'undefined') return 'mp3'
  try {
    const a = document.createElement('audio')
    return a.canPlayType('audio/ogg; codecs=opus') ? 'opus' : 'mp3'
  } catch {
    return 'mp3'
  }
}

/** Divide como o leitor divide, para o áudio baixado servir à reprodução. */
function fatiar(blocos: BlocoLeitura[]): string[] {
  const partes: string[] = []
  for (const b of blocos) {
    const t = `${b.prefixo ? `${b.prefixo}. ` : ''}${b.texto}`.replace(/\s+/g, ' ').trim()
    if (!t) continue
    if (t.length <= 1200) { partes.push(t); continue }
    const frases = t.match(/[^.!?]+[.!?]*\s*/g) ?? [t]
    let atual = ''
    for (const f of frases) {
      if ((atual + f).length > 1200 && atual) { partes.push(atual.trim()); atual = '' }
      atual += f
    }
    if (atual.trim()) partes.push(atual.trim())
  }
  return partes
}

export type EstadoAudio = 'indisponivel' | 'ausente' | 'baixando' | 'guardado'

/**
 * Guarda o áudio de um trecho (capítulo, estudo, devocional) no aparelho.
 * Um capítulo da Bíblia fica em torno de 1 MB em Opus — barato o bastante
 * para a pessoa baixar o que vai ouvir na viagem.
 */
export function useAudioOffline(blocos: BlocoLeitura[], voz: string) {
  const { session } = useAuth()
  const [estado, setEstado] = useState<EstadoAudio>('indisponivel')
  const [progresso, setProgresso] = useState(0)
  const [mb, setMb] = useState<number | null>(null)
  const token = session?.access_token

  const partes = fatiar(blocos)

  // Não dá para saber o tamanho sem gerar; estimamos pelo texto para poder
  // avisar antes de o usuário aceitar o download.
  const mbEstimados = (() => {
    const chars = partes.reduce((s, p) => s + p.length, 0)
    const bytesPorChar = formatoSuportado() === 'opus' ? 316 : 614
    return (chars * bytesPorChar) / 1048576
  })()

  const conferir = useCallback(async () => {
    if (!suportaOffline() || partes.length === 0) { setEstado('indisponivel'); return }
    setEstado('ausente')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partes.length])

  useEffect(() => { conferir() }, [conferir])

  const baixar = useCallback(async () => {
    if (!token || partes.length === 0) return
    setEstado('baixando')
    setProgresso(0)

    const formato = formatoSuportado()
    const urls: string[] = []

    for (let i = 0; i < partes.length; i++) {
      try {
        const res = await fetch('/api/falar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ texto: partes[i], voz, formato }),
        })
        if (res.ok) {
          const { url } = await res.json()
          urls.push(url)
        }
      } catch {
        // Um trecho que falha não interrompe os demais.
      }
      setProgresso(Math.round(((i + 1) / partes.length) * 100))
    }

    const guardados = await guardarAudios(urls)

    // Mede o que realmente ocupou, em vez de repetir a estimativa.
    let total = 0
    for (const u of urls) {
      const r = await doCache(u)
      if (r) total += (await r.clone().arrayBuffer()).byteLength
    }
    setMb(Math.round((total / 1048576) * 10) / 10)

    setEstado(guardados > 0 || urls.length > 0 ? 'guardado' : 'ausente')
  }, [token, partes, voz])

  return { estado, progresso, mb, mbEstimados, baixar, formato: formatoSuportado() }
}
