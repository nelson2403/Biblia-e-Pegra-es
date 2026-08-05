'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, X, FileText, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Anotacao } from '@/types'
import { LoadingSpinner } from '@/components/LoadingSpinner'

const COLORS = ['var(--accent-soft)', 'var(--gold-soft)', 'var(--success-soft)', 'var(--danger-soft)', 'var(--accent-soft)']
const ICON_COLORS = ['var(--accent)', 'var(--gold)', 'var(--success)', 'var(--danger)', '#3B82F6']

export default function AnotacoesPage() {
  const { user } = useAuth()
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([])
  const [filtered, setFiltered] = useState<Anotacao[]>([])
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAnotacoes = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('anotacoes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    setAnotacoes(data ?? [])
    setFiltered(data ?? [])
  }, [user])

  useEffect(() => {
    setLoading(true)
    fetchAnotacoes().finally(() => setLoading(false))
  }, [fetchAnotacoes])

  const applyFilters = useCallback((text: string, tag: string | null, base: Anotacao[]) => {
    let list = [...base]
    if (tag) list = list.filter(a => a.tags?.split(',').map(t => t.trim()).includes(tag))
    if (text.trim()) {
      const q = text.toLowerCase()
      list = list.filter(a => a.titulo.toLowerCase().includes(q) || a.conteudo.toLowerCase().includes(q))
    }
    setFiltered(list)
  }, [])

  const onSearch = (text: string) => { setSearch(text); applyFilters(text, activeTag, anotacoes) }
  const onTag = (tag: string | null) => { setActiveTag(tag); applyFilters(search, tag, anotacoes) }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta anotacao?')) return
    await supabase.from('anotacoes').delete().eq('id', id)
    fetchAnotacoes()
  }

  // Collect all unique tags
  const allTags = Array.from(new Set(
    anotacoes.flatMap(a => (a.tags ?? '').split(',').map(t => t.trim()).filter(Boolean))
  ))

  if (loading) return <LoadingSpinner fullScreen={false} />

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex items-center justify-between px-6 pt-6 pb-3">
        <h1 className="text-2xl font-extrabold text-conteudo">Anotacoes</h1>
        <Link href="/anotacoes/nova"
          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: 'var(--gold)' }}>
          <Plus size={22} />
        </Link>
      </div>

      <div className="px-6 mb-2">
        <div className="flex items-center gap-2 border border-borda bg-surface rounded-xl px-3 py-2.5">
          <Search size={17} color="var(--text-faint)" />
          <input type="text" placeholder="Buscar anotacoes..." value={search}
            onChange={e => onSearch(e.target.value)}
            className="flex-1 text-sm text-conteudo outline-none" />
          {search && <button onClick={() => onSearch('')}><X size={16} color="var(--text-faint)" /></button>}
        </div>
      </div>

      {/* Tag filter chips */}
      {allTags.length > 0 && (
        <div className="px-6 mb-3 flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => onTag(null)}
            className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all"
            style={{ backgroundColor: !activeTag ? 'var(--accent)' : 'var(--surface-2)', color: !activeTag ? '#fff' : 'var(--text-muted)' }}>
            Todas
          </button>
          {allTags.map(tag => (
            <button key={tag} onClick={() => onTag(activeTag === tag ? null : tag)}
              className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all"
              style={{
                backgroundColor: activeTag === tag ? 'var(--accent)' : 'var(--accent-soft)',
                color: activeTag === tag ? '#fff' : 'var(--accent)',
              }}>
              #{tag}
            </button>
          ))}
        </div>
      )}

      <div className="px-6 pb-6 flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <FileText size={48} color="var(--border-strong)" />
            <p className="text-lg font-bold text-conteudo-faint">
              {search || activeTag ? 'Nenhum resultado' : 'Nenhuma anotacao ainda'}
            </p>
            <p className="text-sm text-conteudo-faint">
              {search || activeTag ? 'Tente outros filtros' : 'Clique no + para criar sua primeira anotacao'}
            </p>
          </div>
        ) : filtered.map((item, idx) => {
          const ci = idx % COLORS.length
          const itemTags = (item.tags ?? '').split(',').map(t => t.trim()).filter(Boolean)
          return (
            <div key={item.id} className="bg-surface rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: COLORS[ci] }}>
                <FileText size={20} color={ICON_COLORS[ci]} />
              </div>
              <Link href={`/anotacoes/${item.id}`} className="flex-1 min-w-0">
                <p className="font-bold text-conteudo text-sm truncate">{item.titulo}</p>
                <p className="text-xs text-conteudo-muted line-clamp-2 mt-0.5">{item.conteudo}</p>
                {itemTags.length > 0 && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {itemTags.map(t => (
                      <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>#{t}</span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-conteudo-faint mt-1">
                  {new Date(item.updated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </Link>
              <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl hover:bg-perigo-soft text-perigo flex-shrink-0">
                <Trash2 size={17} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
