'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, X, Mic, Trash2, Users } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Pregacao } from '@/types'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export default function PregacoesPage() {
  const { user } = useAuth()
  const [pregacoes, setPregacoes] = useState<Pregacao[]>([])
  const [filtered, setFiltered] = useState<Pregacao[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchPregacoes = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('pregacoes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setPregacoes(data ?? [])
    setFiltered(data ?? [])
  }, [user])

  useEffect(() => {
    setLoading(true)
    fetchPregacoes().finally(() => setLoading(false))
  }, [fetchPregacoes])

  const onSearch = (text: string) => {
    setSearch(text)
    if (!text.trim()) { setFiltered(pregacoes); return }
    const q = text.toLowerCase()
    setFiltered(pregacoes.filter(p =>
      p.tema.toLowerCase().includes(q) ||
      p.texto_base.toLowerCase().includes(q) ||
      p.mensagem_central?.toLowerCase().includes(q)
    ))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pregacao?')) return
    await supabase.from('pregacoes').delete().eq('id', id)
    fetchPregacoes()
  }

  if (loading) return <LoadingSpinner fullScreen={false} />

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex items-center justify-between px-6 pt-6 pb-3">
        <h1 className="text-2xl font-extrabold text-conteudo">Pregacoes</h1>
        <Link href="/pregacoes/nova"
          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: 'var(--success)' }}>
          <Plus size={22} />
        </Link>
      </div>

      <div className="px-6 mb-3">
        <div className="flex items-center gap-2 bg-surface rounded-2xl px-3 py-2.5">
          <Search size={17} color="var(--text-faint)" />
          <input type="text" placeholder="Buscar pregacoes..." value={search} onChange={e => onSearch(e.target.value)}
            className="flex-1 text-sm text-conteudo outline-none" />
          {search && <button onClick={() => onSearch('')}><X size={16} color="var(--text-faint)" /></button>}
        </div>
      </div>

      <div className="px-6 pb-6 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <Mic size={48} color="var(--border-strong)" />
            <p className="text-lg font-bold text-conteudo-faint">Nenhuma pregacao ainda</p>
            <p className="text-sm text-conteudo-faint text-center">Clique no + para criar sua primeira pregacao guiada</p>
          </div>
        ) : filtered.map(item => (
          <div key={item.id} className="bg-surface rounded-2xl p-4 shadow-cartao">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--accent-hover)' }}>
                <Mic size={20} color="#fff" />
              </div>
              <Link href={`/pregacoes/${item.id}`} className="flex-1 min-w-0">
                <p className="font-bold text-conteudo text-sm truncate">{item.tema}</p>
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--accent)' }}>{item.texto_base}</p>
              </Link>
              <button onClick={() => handleDelete(item.id)} className="p-2 rounded-2xl hover:bg-perigo-soft text-perigo">
                <Trash2 size={17} />
              </button>
            </div>
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center gap-1.5 text-xs text-conteudo-muted">
                <Users size={12} />
                <span className="truncate max-w-[120px]">{item.publico}</span>
              </div>
              <span className="text-xs text-conteudo-faint">{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
