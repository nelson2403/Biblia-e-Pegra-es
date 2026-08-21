'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Bot, User } from 'lucide-react'

interface Mensagem {
  role: 'user' | 'model'
  text: string
}

const GREETING = `Olá! 🙏 Sou Elias, seu conselheiro bíblico. Estou aqui para oferecer orientação espiritual embasada na Palavra de Deus.

Compartilhe o que está em seu coração — seja uma dificuldade, uma dúvida, um conflito ou algo que precisa de discernimento. Vou buscar nas Escrituras a orientação que você precisa.`

export default function ConselheiroPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { role: 'model', text: GREETING },
  ])
  const [historico, setHistorico] = useState<Mensagem[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens, loading])

  const handleSend = async () => {
    const texto = input.trim()
    if (!texto || loading) return
    setInput('')

    const novaMensagem: Mensagem = { role: 'user', text: texto }
    setMensagens(prev => [...prev, novaMensagem])
    setLoading(true)

    try {
      const res = await fetch('/api/conselheiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: texto, historico }),
      })
      const data = await res.json()

      if (data.error || !data.resposta) {
        const msg = data.error ?? 'Não foi possível obter resposta. Tente novamente.'
        setMensagens(prev => [...prev, { role: 'model', text: `⚠️ ${msg}` }])
      } else {
        setMensagens(prev => [...prev, { role: 'model', text: data.resposta }])
        setHistorico(prev => [...prev, { role: 'user', text: texto }, { role: 'model', text: data.resposta }])
      }
    } catch (e: any) {
      setMensagens(prev => [
        ...prev,
        { role: 'model', text: '⚠️ Erro de conexão. Verifique sua internet e tente novamente.' },
      ])
    } finally {
      setLoading(false)
      textareaRef.current?.focus()
    }
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col" style={{ minHeight: '100%' }}>
      {/* Header */}
      <div
        className="px-4 py-4 flex items-center gap-3 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #1E1B4B 100%)' }}
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <Bot size={24} color="#fff" />
        </div>
        <div>
          <h1 className="text-white font-extrabold text-base leading-tight">Conselheiro Bíblico</h1>
          <p className="text-white/60 text-xs">Orientação embasada nas Escrituras · IA</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mx-4 mt-3 px-3 py-2 rounded-2xl bg-amber-50 border border-amber-200">
        <p className="text-[11px] text-amber-700 text-center font-medium">
          ⚠️ Este conselheiro complementa — não substitui — pastores e profissionais de saúde.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-3 pb-2">
        {mensagens.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
              style={{ backgroundColor: m.role === 'user' ? 'var(--accent)' : 'var(--accent)' }}
            >
              {m.role === 'user' ? <User size={13} color="#fff" /> : <Bot size={13} color="#fff" />}
            </div>
            <div
              className="max-w-[82%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
              style={{
                backgroundColor: m.role === 'user' ? 'var(--accent)' : '#fff',
                color: m.role === 'user' ? '#fff' : 'var(--text)',
                borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <Bot size={13} color="#fff" />
            </div>
            <div className="bg-surface px-4 py-3 rounded-2xl shadow-cartao flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" style={{ color: 'var(--accent)' }} />
              <span className="text-xs text-conteudo-faint">Consultando as Escrituras...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Input */}
      <div
        className="sticky bottom-16 md:bottom-0 bg-surface px-4 py-3 flex items-end gap-2"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Compartilhe o que está em seu coração..."
          rows={1}
          className="flex-1 rounded-2xl px-4 py-2.5 text-sm text-conteudo outline-none resize-none max-h-28"
          style={{ borderColor: input ? 'var(--accent)' : 'var(--border)' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Send size={16} color="#fff" />
        </button>
      </div>
    </div>
  )
}
