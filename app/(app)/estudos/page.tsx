'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, X, BookOpen, Pencil, Trash2, ChevronDown, Sparkles, SlidersHorizontal } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { EstudoBiblico } from '@/types'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ESTUDOS_PRONTOS } from '@/data/estudosProntos'

type SortKey = 'recente' | 'antigo' | 'livro'
type Tab = 'meus' | 'prontos'

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  'Salvacao':       { bg: 'var(--success-soft)', color: 'var(--success)' },
  'Espirito Santo': { bg: 'var(--accent-soft)', color: 'var(--accent)' },
  'Fe':             { bg: 'var(--gold-soft)', color: 'var(--gold)' },
  'Amor':           { bg: 'var(--surface-2)', color: 'var(--text-muted)' },
  'Arrependimento': { bg: 'var(--danger-soft)', color: 'var(--danger)' },
  'Oracao':         { bg: 'var(--accent-soft)', color: 'var(--accent)' },
  'Palavra':        { bg: 'var(--gold-soft)', color: 'var(--gold)' },
  'Alianca':        { bg: 'var(--success-soft)', color: 'var(--success)' },
  'Igreja':         { bg: 'var(--accent-soft)', color: 'var(--accent-hover)' },
  'Profecia':       { bg: 'var(--gold-soft)', color: 'var(--gold)' },
}

function completeness(e: EstudoBiblico) {
  return [e.contexto_historico, e.interpretacao, e.aplicacao, e.insights].filter(v => v?.trim()).length
}

export default function EstudosPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('meus')
  const [estudos, setEstudos] = useState<EstudoBiblico[]>([])
  const [filtered, setFiltered] = useState<EstudoBiblico[]>([])
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('recente')
  const [showSort, setShowSort] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchProntos, setSearchProntos] = useState('')

  const fetchEstudos = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('estudos_biblicos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setEstudos(data ?? [])
    setFiltered(data ?? [])
  }, [user])

  useEffect(() => {
    setLoading(true)
    fetchEstudos().finally(() => setLoading(false))
  }, [fetchEstudos])

  const applyFilter = useCallback((text: string, sortKey: SortKey, tag: string | null, base: EstudoBiblico[]) => {
    let list = [...base]
    if (tag) list = list.filter(e => (e.tags ?? '').split(',').map(t => t.trim()).includes(tag))
    if (text.trim()) {
      const q = text.toLowerCase()
      list = list.filter(e =>
        e.livro.toLowerCase().includes(q) ||
        e.texto_biblico.toLowerCase().includes(q) ||
        e.interpretacao?.toLowerCase().includes(q) ||
        e.aplicacao?.toLowerCase().includes(q)
      )
    }
    if (sortKey === 'antigo') list.sort((a, b) => a.created_at.localeCompare(b.created_at))
    else if (sortKey === 'livro') list.sort((a, b) => a.livro.localeCompare(b.livro))
    setFiltered(list)
  }, [])

  const onSearch = (text: string) => { setSearch(text); applyFilter(text, sort, activeTag, estudos) }
  const onSort = (key: SortKey) => { setSort(key); setShowSort(false); applyFilter(search, key, activeTag, estudos) }
  const onTag = (tag: string | null) => { setActiveTag(tag); applyFilter(search, sort, tag, estudos) }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este estudo?')) return
    await supabase.from('estudos_biblicos').delete().eq('id', id)
    fetchEstudos()
  }

  const completeCount = estudos.filter(e => completeness(e) === 4).length

  if (loading) return <LoadingSpinner fullScreen={false} />

  const SORT_LABELS: Record<SortKey, string> = { recente: 'Mais recentes', antigo: 'Mais antigos', livro: 'Por livro' }

  const prontosFiltrados = ESTUDOS_PRONTOS.filter(e => {
    if (!searchProntos.trim()) return true
    const q = searchProntos.toLowerCase()
    return e.titulo.toLowerCase().includes(q) || e.categoria.toLowerCase().includes(q) || e.tags.some(t => t.toLowerCase().includes(q))
  })

  return (
    <div className="flex flex-col min-h-full overflow-x-hidden">
      <div className="flex items-center justify-between px-4 pt-6 pb-3">
        <div>
          <h1 className="text-2xl font-extrabold text-conteudo">Estudos</h1>
          <Link href="/anotacoes" className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>Ver Anotacoes &rarr;</Link>
        </div>
        {tab === 'meus' && (
          <Link href="/estudos/novo"
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: 'var(--accent)' }}>
            <Plus size={22} />
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex px-4 mb-4">
        {([['meus', 'Meus Estudos'], ['prontos', 'Estudos Prontos']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex-1 py-2.5 text-sm font-bold transition-colors"
            style={{
              color: tab === key ? 'var(--accent)' : 'var(--text-faint)',
              borderBottom: tab === key ? '3px solid #4F46E5' : '3px solid transparent',
            }}>
            {label}
          </button>
        ))}
      </div>


      {/* ── Estudos Prontos Tab ── */}
      {tab === 'prontos' && (
        <div className="px-4 pb-6 flex flex-col gap-3">
          <div className="flex items-center gap-2 bg-surface rounded-2xl px-3 py-2.5 mb-1">
            <Search size={17} color="var(--text-faint)" />
            <input type="text" placeholder="Buscar tema ou categoria..." value={searchProntos}
              onChange={e => setSearchProntos(e.target.value)}
              className="flex-1 text-sm text-conteudo outline-none" />
            {searchProntos && <button onClick={() => setSearchProntos('')}><X size={16} color="var(--text-faint)" /></button>}
          </div>
          {prontosFiltrados.map(estudo => {
            const cat = Object.entries(CATEGORY_COLORS).find(([k]) =>
              estudo.categoria.toLowerCase().includes(k.toLowerCase())
            )
            const catStyle = cat ? cat[1] : { bg: 'var(--accent-soft)', color: 'var(--accent)' }
            return (
              <Link key={estudo.id} href={`/estudos/prontos/${estudo.id}`}
                className="bg-surface rounded-2xl p-4 shadow-cartao flex items-start gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: catStyle.bg }}>
                  <Sparkles size={20} color={catStyle.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: catStyle.bg, color: catStyle.color }}>
                      {estudo.categoria}
                    </span>
                  </div>
                  <p className="font-bold text-conteudo text-sm">{estudo.titulo}</p>
                  <p className="text-xs text-conteudo-muted mt-0.5">{estudo.textoBase}</p>
                  <p className="text-xs text-conteudo-faint mt-1 line-clamp-2">{estudo.subtitulo}</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* ── Meus Estudos Tab ── */}
      {tab === 'meus' && estudos.length > 0 && (
        <div className="px-4 mb-3 grid grid-cols-3 gap-2">
          {[
            { label: 'Total', value: estudos.length, color: 'var(--accent)', bg: 'var(--accent-soft)' },
            { label: 'Completos', value: completeCount, color: 'var(--success)', bg: 'var(--success-soft)' },
            { label: 'Em andamento', value: estudos.length - completeCount, color: 'var(--gold)', bg: 'var(--gold-soft)' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: s.bg }}>
              <p className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] font-semibold text-conteudo-muted leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tag filter — só na aba meus */}
      {tab === 'meus' && estudos.length > 0 && (() => {
        const allTags = [...new Set(estudos.flatMap(e => (e.tags ?? '').split(',').map(t => t.trim()).filter(Boolean)))]
        if (!allTags.length) return null
        return (
          <div className="px-4 mb-2 flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => onTag(null)}
              className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all"
              style={{ backgroundColor: !activeTag ? 'var(--accent)' : 'var(--surface-2)', color: !activeTag ? '#fff' : 'var(--text-muted)' }}>
              Todos
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
        )
      })()}

      {tab === 'meus' && <div className="px-4 mb-2 flex gap-2">
        <div className="flex-1 min-w-0 flex items-center gap-2 bg-surface rounded-2xl px-3 py-2.5">
          <Search size={17} color="var(--text-faint)" className="flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar por livro ou texto..."
            value={search}
            onChange={e => onSearch(e.target.value)}
            className="flex-1 min-w-0 text-sm text-conteudo outline-none"
          />
          {search && <button onClick={() => onSearch('')}><X size={16} color="var(--text-faint)" /></button>}
        </div>
        <div className="relative flex-shrink-0">
          <button onClick={() => setShowSort(v => !v)}
            className="flex items-center gap-1.5 bg-surface rounded-2xl px-3 py-2.5 text-conteudo-muted font-semibold"
            style={{ color: sort !== 'recente' ? 'var(--accent)' : undefined }}>
            <SlidersHorizontal size={16} />
            <ChevronDown size={14} />
          </button>
          {showSort && (
            <div className="absolute right-0 top-full mt-1 bg-surface rounded-2xl shadow-alto z-20 overflow-hidden w-44">
              {(Object.keys(SORT_LABELS) as SortKey[]).map(k => (
                <button key={k} onClick={() => onSort(k)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-bg font-medium"
                  style={{ color: sort === k ? 'var(--accent)' : 'var(--text)' }}>
                  {SORT_LABELS[k]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>}

      {tab === 'meus' && <div className="px-4 pb-6 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <BookOpen size={48} color="var(--border-strong)" />
            <p className="text-lg font-bold text-conteudo-faint">
              {search ? 'Nenhum resultado encontrado' : 'Nenhum estudo ainda'}
            </p>
            <p className="text-sm text-conteudo-faint text-center">
              {search ? 'Tente outros termos de busca' : 'Clique no + para criar seu primeiro estudo biblico'}
            </p>
          </div>
        ) : filtered.map(item => {
          const done = completeness(item)
          const pct = (done / 4) * 100
          return (
            <div key={item.id} className="bg-surface rounded-2xl p-4 shadow-cartao">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'var(--accent-soft)' }}>
                  <BookOpen size={20} color="var(--accent)" />
                </div>
                <Link href={`/estudos/${item.id}`} className="flex-1 min-w-0">
                  <p className="font-bold text-conteudo text-sm">{item.livro} {item.capitulo}:{item.versiculo}</p>
                  <p className="text-xs text-conteudo-muted line-clamp-2 mt-0.5">{item.texto_biblico}</p>
                  {item.tags && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {item.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                        <span key={t} className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>#{t}</span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-conteudo-faint mt-1">{new Date(item.created_at).toLocaleDateString('pt-BR')}</p>
                </Link>
                <div className="flex gap-1 flex-shrink-0">
                  <Link href={`/estudos/novo?id=${item.id}`} className="p-2 rounded-2xl hover:bg-surface-2 text-primary">
                    <Pencil size={17} />
                  </Link>
                  <button onClick={() => handleDelete(item.id)} className="p-2 rounded-2xl hover:bg-perigo-soft text-perigo">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
              <div className="mt-3 pt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-conteudo-faint">{done === 4 ? '✅ Completo' : `${done}/4 secoes preenchidas`}</span>
                  <span className="text-xs font-bold" style={{ color: done === 4 ? 'var(--success)' : 'var(--accent)' }}>{pct.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                  <div className="h-1.5 rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: done === 4 ? 'var(--success)' : 'var(--accent)' }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>}
    </div>
  )
}
