'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

export interface BlocoLeitura {
  /** Identificador do trecho — usado para destacar o que está sendo lido na tela. */
  id: string
  texto: string
  /** Rótulo falado antes do texto (ex.: "Versículo 3"). Opcional. */
  prefixo?: string
}

/** Pedaço realmente enviado ao sintetizador. */
interface Fatia {
  blocoId: string
  texto: string
}

export type EstadoLeitor = 'parado' | 'lendo' | 'pausado'

/**
 * O Chrome corta falas longas (bug conhecido de ~15s por locução).
 * Quebrar em frases curtas resolve e ainda dá granularidade para destacar o texto.
 */
const MAX_CARACTERES = 200

function fatiar(blocos: BlocoLeitura[]): Fatia[] {
  const fatias: Fatia[] = []

  for (const bloco of blocos) {
    const conteudo = `${bloco.prefixo ? `${bloco.prefixo}. ` : ''}${bloco.texto}`
      .replace(/\s+/g, ' ')
      .trim()
    if (!conteudo) continue

    // Quebra em frases; frases muito longas são divididas nas vírgulas.
    const frases = conteudo.match(/[^.!?;:]+[.!?;:]*\s*/g) ?? [conteudo]
    let atual = ''

    const empurrar = () => {
      const t = atual.trim()
      if (t) fatias.push({ blocoId: bloco.id, texto: t })
      atual = ''
    }

    for (const frase of frases) {
      if ((atual + frase).length <= MAX_CARACTERES) {
        atual += frase
        continue
      }
      empurrar()
      if (frase.length <= MAX_CARACTERES) {
        atual = frase
        continue
      }
      // Frase gigante sem pontuação: corta por vírgula, depois por tamanho.
      for (const parte of frase.split(/(?<=,)\s*/)) {
        if ((atual + parte).length <= MAX_CARACTERES) atual += parte
        else {
          empurrar()
          if (parte.length <= MAX_CARACTERES) atual = parte
          else {
            for (let i = 0; i < parte.length; i += MAX_CARACTERES) {
              fatias.push({ blocoId: bloco.id, texto: parte.slice(i, i + MAX_CARACTERES).trim() })
            }
          }
        }
      }
    }
    empurrar()
  }

  return fatias
}

function ehPortugues(v: SpeechSynthesisVoice) {
  return v.lang?.toLowerCase().startsWith('pt')
}

export function useLeitor(blocos: BlocoLeitura[]) {
  const [suportado, setSuportado] = useState(false)
  const [estado, setEstado] = useState<EstadoLeitor>('parado')
  const [blocoAtual, setBlocoAtual] = useState<string | null>(null)
  const [vozes, setVozes] = useState<SpeechSynthesisVoice[]>([])
  const [vozURI, setVozURI] = useState<string | null>(null)
  const [velocidade, setVelocidadeState] = useState(1)
  const [progresso, setProgresso] = useState(0)

  const fatiasRef = useRef<Fatia[]>([])
  const indiceRef = useRef(0)
  // Distingue um "parou porque terminou" de um "parou porque cancelamos".
  const cancelandoRef = useRef(false)
  const vozURIRef = useRef<string | null>(null)
  const velocidadeRef = useRef(1)

  useEffect(() => {
    setSuportado(typeof window !== 'undefined' && 'speechSynthesis' in window)
  }, [])

  // Preferências salvas localmente (sincronizadas com o Supabase pela tela de perfil).
  useEffect(() => {
    try {
      const bruto = localStorage.getItem('preferencias_app')
      if (!bruto) return
      const p = JSON.parse(bruto)
      if (p.tts_voz) { setVozURI(p.tts_voz); vozURIRef.current = p.tts_voz }
      if (p.tts_velocidade) { setVelocidadeState(p.tts_velocidade); velocidadeRef.current = p.tts_velocidade }
    } catch {}
  }, [])

  // getVoices() costuma vir vazio na primeira chamada; 'voiceschanged' completa a lista.
  useEffect(() => {
    if (!suportado) return

    const carregar = () => {
      const todas = window.speechSynthesis.getVoices()
      if (!todas.length) return
      const pt = todas.filter(ehPortugues)
      setVozes(pt.length ? pt : todas)
      if (!vozURIRef.current && pt.length) {
        const preferida = pt.find(v => v.lang?.toLowerCase() === 'pt-br') ?? pt[0]
        vozURIRef.current = preferida.voiceURI
        setVozURI(preferida.voiceURI)
      }
    }

    carregar()
    window.speechSynthesis.addEventListener('voiceschanged', carregar)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', carregar)
  }, [suportado])

  const pararTudo = useCallback(() => {
    if (!suportado) return
    cancelandoRef.current = true
    window.speechSynthesis.cancel()
    indiceRef.current = 0
    setEstado('parado')
    setBlocoAtual(null)
    setProgresso(0)
    // Solta a trava depois que os eventos de cancelamento já passaram.
    setTimeout(() => { cancelandoRef.current = false }, 60)
  }, [suportado])

  // Ao sair da página, silencia — senão a voz continua falando na tela seguinte.
  useEffect(() => () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  const falarIndice = useCallback(
    (indice: number) => {
      const fatias = fatiasRef.current
      if (indice < 0 || indice >= fatias.length) {
        setEstado('parado')
        setBlocoAtual(null)
        setProgresso(0)
        indiceRef.current = 0
        return
      }

      indiceRef.current = indice
      const fatia = fatias[indice]
      const u = new SpeechSynthesisUtterance(fatia.texto)

      const voz = window.speechSynthesis.getVoices().find(v => v.voiceURI === vozURIRef.current)
      if (voz) u.voice = voz
      u.lang = voz?.lang ?? 'pt-BR'
      u.rate = velocidadeRef.current
      u.pitch = 1

      u.onstart = () => {
        setBlocoAtual(fatia.blocoId)
        setEstado('lendo')
        setProgresso(Math.round(((indice + 1) / fatias.length) * 100))
      }
      u.onend = () => {
        if (cancelandoRef.current) return
        falarIndice(indice + 1)
      }
      u.onerror = e => {
        if (cancelandoRef.current || e.error === 'interrupted' || e.error === 'canceled') return
        // Um erro isolado não deve travar a leitura inteira — pula a fatia.
        falarIndice(indice + 1)
      }

      window.speechSynthesis.speak(u)
    },
    []
  )

  const ler = useCallback(
    (blocoIdInicial?: string) => {
      if (!suportado) return

      const fatias = fatiar(blocos)
      if (!fatias.length) return
      fatiasRef.current = fatias

      cancelandoRef.current = true
      window.speechSynthesis.cancel()

      const inicio = blocoIdInicial ? Math.max(0, fatias.findIndex(f => f.blocoId === blocoIdInicial)) : 0

      // Pequeno atraso: cancel() é assíncrono no Chrome e engole o speak() imediato.
      setTimeout(() => {
        cancelandoRef.current = false
        falarIndice(inicio)
      }, 80)
    },
    [suportado, blocos, falarIndice]
  )

  const pausar = useCallback(() => {
    if (!suportado) return
    window.speechSynthesis.pause()
    setEstado('pausado')
  }, [suportado])

  const retomar = useCallback(() => {
    if (!suportado) return
    window.speechSynthesis.resume()
    setEstado('lendo')
  }, [suportado])

  const pular = useCallback(
    (direcao: 1 | -1) => {
      if (!suportado || !fatiasRef.current.length) return
      const fatias = fatiasRef.current
      const atual = fatias[indiceRef.current]

      // Pula para o próximo bloco (versículo/parágrafo), não para a próxima frase.
      let destino = indiceRef.current
      if (direcao === 1) {
        while (destino < fatias.length && fatias[destino].blocoId === atual.blocoId) destino++
      } else {
        while (destino > 0 && fatias[destino].blocoId === atual.blocoId) destino--
        const anteriorId = fatias[destino]?.blocoId
        while (destino > 0 && fatias[destino - 1].blocoId === anteriorId) destino--
      }

      if (destino >= fatias.length) { pararTudo(); return }

      cancelandoRef.current = true
      window.speechSynthesis.cancel()
      setTimeout(() => {
        cancelandoRef.current = false
        falarIndice(Math.max(0, destino))
      }, 80)
    },
    [suportado, falarIndice, pararTudo]
  )

  const setVoz = useCallback((uri: string) => {
    vozURIRef.current = uri
    setVozURI(uri)
  }, [])

  const setVelocidade = useCallback((v: number) => {
    velocidadeRef.current = v
    setVelocidadeState(v)
    // A velocidade só vale para a próxima locução; refaz a fatia atual para o efeito ser imediato.
    if (window.speechSynthesis.speaking) {
      const indice = indiceRef.current
      cancelandoRef.current = true
      window.speechSynthesis.cancel()
      setTimeout(() => {
        cancelandoRef.current = false
        falarIndice(indice)
      }, 80)
    }
  }, [falarIndice])

  return {
    suportado,
    estado,
    blocoAtual,
    progresso,
    vozes,
    vozURI,
    velocidade,
    ler,
    pausar,
    retomar,
    parar: pararTudo,
    proximo: () => pular(1),
    anterior: () => pular(-1),
    setVoz,
    setVelocidade,
  }
}
