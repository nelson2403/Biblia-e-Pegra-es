'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, Heart, X, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/LoadingSpinner'

interface PedidoOracao {
  id: string
  user_id: string
  autor_nome: string
  texto: string
  anonimo: boolean
  created_at: string
  oradores_count: number
  eu_orei: boolean
}

export default function OracaoPage() {
  const { user } = useAuth()
  const [pedidos, setPedidos] = useState<PedidoOracao[]>([])
  const [minhasOracoes, setMinhasOracoes] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [texto, setTexto] = useState('')
  const [anonimo, setAnonimo] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [praying, setPraying] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    const [{ data: pedidosData }, { data: oracoesData }] = await Promise.all([
      supabase.from('pedidos_oracao').select('*').order('created_at', { ascending: false }),
      supabase.from('oracoes').select('*'),
    ])

    const countMap = new Map<string, number>()
    const minhasSet = new Set<string>()

    oracoesData?.forEach(o => {
      countMap.set(o.pedido_id, (countMap.get(o.pedido_id) ?? 0) + 1)
      if (o.user_id === user?.id) minhasSet.add(o.pedido_id)
    })

    setPedidos(
      (pedidosData ?? []).map(p => ({
        ...p,
        oradores_count: countMap.get(p.id) ?? 0,
        eu_orei: minhasSet.has(p.id),
      }))
    )
    setMinhasOracoes(minhasSet)
  }, [user?.id])

  useEffect(() => {
    setLoading(true)
    loadData().finally(() => setLoading(false))
  }, [loadData])

  const handleOrar = async (pedidoId: string) => {
    if (!user || praying) return
    setPraying(pedidoId)
    const jaorei = minhasOracoes.has(pedidoId)

    if (jaorei) {
      await supabase.from('oracoes').delete().eq('pedido_id', pedidoId).eq('user_id', user.id)
    } else {
      await supabase.from('oracoes').insert({ pedido_id: pedidoId, user_id: user.id })
    }

    const newSet = new Set(minhasOracoes)
    if (jaorei) newSet.delete(pedidoId)
    else newSet.add(pedidoId)
    setMinhasOracoes(newSet)

    setPedidos(prev =>
      prev.map(p =>
        p.id === pedidoId
          ? { ...p, eu_orei: !jaorei, oradores_count: p.oradores_count + (jaorei ? -1 : 1) }
          : p
      )
    )
    setPraying(null)
  }

  const handleSubmit = async () => {
    if (!texto.trim() || !user || submitting) return
    setSubmitting(true)
    const autorNome = anonimo
      ? 'Anônimo'
      : (user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Servo')

    await supabase.from('pedidos_oracao').insert({
      user_id: user.id,
      autor_nome: autorNome,
      texto: texto.trim(),
      anonimo,
    })

    setTexto('')
    setAnonimo(false)
    setShowForm(false)
    setSubmitting(false)
    loadData()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('pedidos_oracao').delete().eq('id', id)
    setPedidos(prev => prev.filter(p => p.id !== id))
  }

  if (loading) return <LoadingSpinner fullScreen={false} />

  return (
    <div className="flex flex-col min-h-full bg-bg">
      {/* Header */}
      <div
        className="px-5 pt-6 pb-5"
        style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #1E1B4B 100%)' }}
      >
        <h1 className="text-2xl font-extrabold text-white">Mural de Oração</h1>
        <p className="text-white/70 text-sm mt-0.5">
          {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'} · ore pela comunidade
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white"
          style={{
            backgroundColor: 'rgba(255,255,255,0.18)',
            border: '1.5px solid rgba(255,255,255,0.3)',
          }}
        >
          <Plus size={18} /> Compartilhar pedido de oração
        </button>
      </div>

      {/* List */}
      <div className="px-4 py-4 flex flex-col gap-3 pb-10">
        {pedidos.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <span className="text-5xl">🙏</span>
            <p className="text-lg font-bold text-conteudo-faint">Nenhum pedido ainda</p>
            <p className="text-sm text-conteudo-faint text-center">
              Seja o primeiro a compartilhar um pedido de oração com a comunidade
            </p>
          </div>
        ) : (
          pedidos.map(p => (
            <div key={p.id} className="bg-surface rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    {p.anonimo ? '?' : p.autor_nome.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-conteudo">
                      {p.anonimo ? 'Anônimo' : p.autor_nome}
                    </p>
                    <p className="text-[10px] text-conteudo-faint">
                      {new Date(p.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                {p.user_id === user?.id && (
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-conteudo-faint hover:text-red-400 transition-colors p-1"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <p className="text-sm text-conteudo leading-relaxed mb-3">{p.texto}</p>

              <button
                onClick={() => handleOrar(p.id)}
                disabled={!!praying}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={{
                  backgroundColor: p.eu_orei ? 'var(--accent-soft)' : 'var(--surface-2)',
                  color: p.eu_orei ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                {praying === p.id ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Heart size={13} fill={p.eu_orei ? 'var(--accent)' : 'none'} />
                )}
                {p.eu_orei ? 'Orei por isso' : 'Orar por isso'} · {p.oradores_count}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Form Bottom Sheet */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}
        >
          <div className="w-full max-w-lg rounded-t-3xl bg-surface px-5 pt-4 pb-8 flex flex-col gap-4">
            <div className="flex justify-center mb-1">
              <div className="w-10 h-1 rounded-full bg-surface-3" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-conteudo text-lg">Compartilhar pedido</h3>
              <button onClick={() => setShowForm(false)} className="p-1 text-conteudo-faint">
                <X size={20} />
              </button>
            </div>
            <textarea
              value={texto}
              onChange={e => setTexto(e.target.value)}
              placeholder="Compartilhe seu pedido de oração com a comunidade cristã..."
              className="w-full border border-borda rounded-xl px-4 py-3 text-sm text-conteudo outline-none resize-none min-h-[120px]"
              style={{ borderColor: texto ? 'var(--accent)' : 'var(--border)' }}
              autoFocus
            />
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setAnonimo(v => !v)}
            >
              <div
                className="w-10 h-6 rounded-full relative flex-shrink-0 transition-all"
                style={{ backgroundColor: anonimo ? 'var(--accent)' : 'var(--border-strong)' }}
              >
                <div
                  className="w-4 h-4 bg-surface rounded-full absolute top-1 transition-all shadow"
                  style={{ left: anonimo ? '22px' : '4px' }}
                />
              </div>
              <span className="text-sm text-conteudo-muted font-medium select-none">
                Publicar como anônimo
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!texto.trim() || submitting}
              className="w-full py-3 rounded-xl font-bold text-white text-sm disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {submitting ? 'Publicando...' : '🙏 Publicar pedido'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
