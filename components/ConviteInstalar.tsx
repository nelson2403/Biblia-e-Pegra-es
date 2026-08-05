'use client'
import { useState, useEffect } from 'react'
import { Download, X, Share } from 'lucide-react'

interface EventoInstalacao extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const CHAVE_DISPENSADO = 'convite_instalar_dispensado'

/**
 * Convida a instalar o app na tela inicial.
 * No Android/Chrome usa o prompt nativo; no iOS explica o caminho manual,
 * que é o único jeito por lá.
 */
export function ConviteInstalar() {
  const [evento, setEvento] = useState<EventoInstalacao | null>(null)
  const [visivel, setVisivel] = useState(false)
  const [ehIOS, setEhIOS] = useState(false)

  useEffect(() => {
    // Já instalado (aberto em modo standalone): não incomoda.
    const instalado =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    if (instalado) return

    // Respeita quem já dispensou nos últimos 30 dias.
    const dispensadoEm = Number(localStorage.getItem(CHAVE_DISPENSADO) ?? 0)
    if (dispensadoEm && Date.now() - dispensadoEm < 30 * 86400000) return

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setEhIOS(ios)

    if (ios) {
      // O iOS não dispara beforeinstallprompt — mostramos as instruções.
      const t = setTimeout(() => setVisivel(true), 4000)
      return () => clearTimeout(t)
    }

    const aoPoderInstalar = (e: Event) => {
      e.preventDefault()
      setEvento(e as EventoInstalacao)
      setVisivel(true)
    }

    window.addEventListener('beforeinstallprompt', aoPoderInstalar)
    return () => window.removeEventListener('beforeinstallprompt', aoPoderInstalar)
  }, [])

  const dispensar = () => {
    localStorage.setItem(CHAVE_DISPENSADO, String(Date.now()))
    setVisivel(false)
  }

  const instalar = async () => {
    if (!evento) return
    await evento.prompt()
    const { outcome } = await evento.userChoice
    if (outcome === 'accepted') setVisivel(false)
    else dispensar()
    setEvento(null)
  }

  if (!visivel) return null

  return (
    <div
      role="dialog"
      aria-label="Instalar o aplicativo"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 rounded-2xl p-4 shadow-2xl text-white"
      style={{ background: 'linear-gradient(135deg, #1E1B4B, #4F46E5)' }}
    >
      <div className="flex items-start gap-3">
        <img src="/icons/icon-96.png" alt="" className="w-12 h-12 rounded-xl flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-sm">Instale o app</p>
          <p className="text-xs mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {ehIOS
              ? 'Toque em Compartilhar e depois em "Adicionar à Tela de Início".'
              : 'Acesso rápido, funciona offline e recebe a Palavra do dia.'}
          </p>
        </div>
        <button onClick={dispensar} aria-label="Agora não" className="p-1 -mt-1 -mr-1 opacity-70">
          <X size={18} />
        </button>
      </div>

      {ehIOS ? (
        <div className="flex items-center justify-center gap-2 mt-3 py-2 rounded-xl text-sm font-bold"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
          <Share size={16} aria-hidden="true" /> Compartilhar → Adicionar à Tela de Início
        </div>
      ) : (
        <button
          onClick={instalar}
          className="w-full flex items-center justify-center gap-2 mt-3 py-2.5 rounded-xl bg-white text-sm font-bold"
          style={{ color: '#4F46E5' }}
        >
          <Download size={16} aria-hidden="true" /> Instalar agora
        </button>
      )}
    </div>
  )
}
