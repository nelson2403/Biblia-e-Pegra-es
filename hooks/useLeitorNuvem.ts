'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import type { BlocoLeitura, EstadoLeitor } from '@/hooks/useLeitor'
import { doCache } from '@/lib/offline'

/** Opus ocupa metade do MP3; nem todo aparelho toca Ogg/Opus. */
function tocaOpus(): boolean {
  if (typeof document === 'undefined') return false
  try {
    return !!document.createElement('audio').canPlayType('audio/ogg; codecs=opus')
  } catch {
    return false
  }
}

/** Quantos trechos adiante buscar enquanto o atual toca. */
const ANTECIPAR = 2

interface Trecho {
  blocoId: string
  texto: string
}

/** Divide os blocos em trechos que cabem num pedido de síntese. */
function preparar(blocos: BlocoLeitura[]): Trecho[] {
  const trechos: Trecho[] = []

  for (const bloco of blocos) {
    const conteudo = `${bloco.prefixo ? `${bloco.prefixo}. ` : ''}${bloco.texto}`
      .replace(/\s+/g, ' ')
      .trim()
    if (!conteudo) continue

    // Blocos curtos viram um trecho só — menos requisições e leitura mais fluida.
    if (conteudo.length <= 1200) {
      trechos.push({ blocoId: bloco.id, texto: conteudo })
      continue
    }

    // Textos longos quebram em frases, sem cortar no meio de uma ideia.
    const frases = conteudo.match(/[^.!?]+[.!?]*\s*/g) ?? [conteudo]
    let atual = ''
    for (const frase of frases) {
      if ((atual + frase).length > 1200 && atual) {
        trechos.push({ blocoId: bloco.id, texto: atual.trim() })
        atual = ''
      }
      atual += frase
    }
    if (atual.trim()) trechos.push({ blocoId: bloco.id, texto: atual.trim() })
  }

  return trechos
}

/**
 * Leitor com voz neural da Google. O áudio é gerado uma vez e guardado no
 * Supabase, então a partir da segunda vez toca instantaneamente.
 * Devolve `indisponivel` quando não há chave configurada — aí a tela usa a
 * voz do próprio aparelho.
 */
export function useLeitorNuvem(blocos: BlocoLeitura[]) {
  const { session } = useAuth()
  const [disponivel, setDisponivel] = useState<boolean | null>(null)
  const [estado, setEstado] = useState<EstadoLeitor>('parado')
  const [blocoAtual, setBlocoAtual] = useState<string | null>(null)
  const [progresso, setProgresso] = useState(0)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [voz, setVozState] = useState('pt-BR-Neural2-B')
  const [velocidade, setVelocidadeState] = useState(1)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const trechosRef = useRef<Trecho[]>([])
  const indiceRef = useRef(0)
  const cacheRef = useRef<Map<string, string>>(new Map())
  const cancelandoRef = useRef(false)
  const vozRef = useRef(voz)
  const velocidadeRef = useRef(1)
  // Object URLs precisam ser revogados, senao o blob fica na memoria do navegador.
  const objetoUrlRef = useRef<string | null>(null)

  const token = session?.access_token

  // Descobre se a voz de nuvem está ligada no servidor.
  useEffect(() => {
    let vivo = true
    fetch('/api/falar')
      .then(r => r.json())
      .then(d => { if (vivo) setDisponivel(!!d.disponivel) })
      .catch(() => { if (vivo) setDisponivel(false) })
    return () => { vivo = false }
  }, [])

  // Preferências salvas.
  useEffect(() => {
    try {
      const bruto = localStorage.getItem('preferencias_app')
      if (!bruto) return
      const p = JSON.parse(bruto)
      if (p.tts_voz_nuvem) { setVozState(p.tts_voz_nuvem); vozRef.current = p.tts_voz_nuvem }
      if (p.tts_velocidade) { setVelocidadeState(p.tts_velocidade); velocidadeRef.current = p.tts_velocidade }
    } catch {}
  }, [])

  useEffect(() => {
    const a = new Audio()
    a.preload = 'auto'
    audioRef.current = a
    return () => { a.pause(); a.src = '' }
  }, [])

  /** Busca (ou reaproveita) a URL do áudio de um trecho. */
  const urlDoTrecho = useCallback(
    async (indice: number): Promise<string | null> => {
      const trecho = trechosRef.current[indice]
      if (!trecho || !token) return null

      const chave = `${vozRef.current}|${trecho.texto}`
      const guardado = cacheRef.current.get(chave)
      if (guardado) return guardado

      const res = await fetch('/api/falar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          texto: trecho.texto,
          voz: vozRef.current,
          formato: tocaOpus() ? 'opus' : 'mp3',
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => null)
        throw new Error(d?.error ?? 'Falha ao gerar a voz.')
      }
      const { url } = await res.json()
      cacheRef.current.set(chave, url)
      return url
    },
    [token]
  )

  /** Vai buscando os próximos em segundo plano para não haver silêncio. */
  const anteciparProximos = useCallback(
    (apartirDe: number) => {
      for (let i = apartirDe; i < Math.min(apartirDe + ANTECIPAR, trechosRef.current.length); i++) {
        urlDoTrecho(i).catch(() => {})
      }
    },
    [urlDoTrecho]
  )

  const tocarIndice = useCallback(
    async (indice: number) => {
      const audio = audioRef.current
      const trechos = trechosRef.current
      if (!audio) return

      if (indice < 0 || indice >= trechos.length) {
        setEstado('parado')
        setBlocoAtual(null)
        setProgresso(0)
        indiceRef.current = 0
        return
      }

      indiceRef.current = indice
      setBlocoAtual(trechos[indice].blocoId)
      setProgresso(Math.round(((indice + 1) / trechos.length) * 100))

      try {
        setCarregando(true)
        const url = await urlDoTrecho(indice)
        setCarregando(false)
        if (!url || cancelandoRef.current) return

        // Se o áudio foi baixado para uso offline, toca do aparelho.
        // Sem isto o download seria inútil: a Cache Storage não é consultada
        // sozinha por um elemento <audio>, só pelo service worker.
        const guardado = await doCache(url)
        if (guardado) {
          const anterior = objetoUrlRef.current
          objetoUrlRef.current = URL.createObjectURL(await guardado.blob())
          if (anterior) URL.revokeObjectURL(anterior)
          audio.src = objetoUrlRef.current
        } else {
          audio.src = url
        }

        audio.playbackRate = velocidadeRef.current
        await audio.play()
        setEstado('lendo')
        anteciparProximos(indice + 1)
      } catch (e: any) {
        setCarregando(false)
        if (cancelandoRef.current) return
        setErro(e?.message ?? 'Erro ao tocar o áudio.')
        setEstado('parado')
      }
    },
    [urlDoTrecho, anteciparProximos]
  )

  // Encadeia os trechos: ao terminar um, começa o seguinte.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const aoTerminar = () => {
      if (cancelandoRef.current) return
      tocarIndice(indiceRef.current + 1)
    }
    const aoErrar = () => {
      if (cancelandoRef.current) return
      // Um trecho com problema não deve travar a leitura inteira.
      tocarIndice(indiceRef.current + 1)
    }

    audio.addEventListener('ended', aoTerminar)
    audio.addEventListener('error', aoErrar)
    return () => {
      audio.removeEventListener('ended', aoTerminar)
      audio.removeEventListener('error', aoErrar)
    }
  }, [tocarIndice])

  const parar = useCallback(() => {
    cancelandoRef.current = true
    const audio = audioRef.current
    if (audio) { audio.pause(); audio.currentTime = 0 }
    indiceRef.current = 0
    setEstado('parado')
    setBlocoAtual(null)
    setProgresso(0)
    setCarregando(false)
    setTimeout(() => { cancelandoRef.current = false }, 50)
  }, [])

  // Ao trocar de tela, silencia.
  useEffect(
    () => () => {
      audioRef.current?.pause()
      if (objetoUrlRef.current) URL.revokeObjectURL(objetoUrlRef.current)
    },
    []
  )

  const ler = useCallback(
    (blocoIdInicial?: string) => {
      setErro(null)
      const trechos = preparar(blocos)
      if (!trechos.length) return
      trechosRef.current = trechos

      const inicio = blocoIdInicial
        ? Math.max(0, trechos.findIndex(t => t.blocoId === blocoIdInicial))
        : 0

      cancelandoRef.current = false
      tocarIndice(inicio)
    },
    [blocos, tocarIndice]
  )

  const pausar = useCallback(() => {
    audioRef.current?.pause()
    setEstado('pausado')
  }, [])

  const retomar = useCallback(() => {
    audioRef.current?.play().catch(() => {})
    setEstado('lendo')
  }, [])

  const pular = useCallback(
    (direcao: 1 | -1) => {
      const trechos = trechosRef.current
      if (!trechos.length) return
      const atual = trechos[indiceRef.current]

      let destino = indiceRef.current
      if (direcao === 1) {
        while (destino < trechos.length && trechos[destino].blocoId === atual.blocoId) destino++
      } else {
        while (destino > 0 && trechos[destino].blocoId === atual.blocoId) destino--
        const anteriorId = trechos[destino]?.blocoId
        while (destino > 0 && trechos[destino - 1].blocoId === anteriorId) destino--
      }

      if (destino >= trechos.length) { parar(); return }
      tocarIndice(Math.max(0, destino))
    },
    [tocarIndice, parar]
  )

  /** Muda o ritmo sem gerar áudio novo — a aceleração é do próprio player. */
  const setVelocidade = useCallback((v: number) => {
    velocidadeRef.current = v
    setVelocidadeState(v)
    if (audioRef.current) audioRef.current.playbackRate = v
  }, [])

  const setVoz = useCallback(
    (nova: string) => {
      vozRef.current = nova
      setVozState(nova)
      cacheRef.current.clear()
      // Voz nova exige áudio novo: recomeça o trecho atual já com ela.
      if (estado !== 'parado') tocarIndice(indiceRef.current)
    },
    [estado, tocarIndice]
  )

  return {
    disponivel,
    estado,
    blocoAtual,
    progresso,
    carregando,
    erro,
    voz,
    velocidade,
    ler,
    pausar,
    retomar,
    parar,
    proximo: () => pular(1),
    anterior: () => pular(-1),
    setVoz,
    setVelocidade,
  }
}
