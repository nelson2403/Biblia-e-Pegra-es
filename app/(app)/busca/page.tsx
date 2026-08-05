'use client'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Search, X, BookOpen, FileText, Mic, Layers } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

type ResultType = 'estudo' | 'anotacao' | 'pregacao'

interface Result {
  id: string
  type: ResultType
  title: string
  subtitle: string
  href: string
}

export default function BuscaPage() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q)
    if (!q.trim() || !user) { setResults([]); setSearched(false); return }
    if (q.trim().length < 2) return
    setLoading(true)
    setSearched(true)

    const [estudos, anotacoes, pregacoes] = await Promise.all([
      supabase.from('estudos_biblicos').select('id,livro,capitulo,versiculo,texto_biblico,interpretacao')
        .eq('user_id', user.id)
        .or(`livro.ilike.%${q}%,texto_biblico.ilike.%${q}%,interpretacao.ilike.%${q}%`),
      supabase.from('anotacoes').select('id,titulo,conteudo')
        .eq('user_id', user.id)
        .or(`titulo.ilike.%${q}%,conteudo.ilike.%${q}%`),
      supabase.from('pregacoes').select('id,tema,texto_base,mensagem_central')
        .eq('user_id', user.id)
        .or(`tema.ilike.%${q}%,texto_base.ilike.%${q}%,mensagem_central.ilike.%${q}%`),
    ])

    const all: Result[] = [
      ...(estudos.data ?? []).map(e => ({
        id: e.id, type: 'estudo' as ResultType,
        title: `${e.livro} ${e.capitulo}:${e.versiculo}`,
        subtitle: e.texto_biblico?.slice(0, 80) + '...',
        href: `/estudos/${e.id}`,
      })),
      ...(anotacoes.data ?? []).map(a => ({
        id: a.id, type: 'anotacao' as ResultType,
        title: a.titulo,
        subtitle: a.conteudo?.slice(0, 80) + '...',
        href: `/anotacoes/${a.id}`,
      })),
      ...(pregacoes.data ?? []).map(p => ({
        id: p.id, type: 'pregacao' as ResultType,
        title: p.tema,
        subtitle: p.mensagem_central?.slice(0, 80) + '...',
        href: `/pregacoes/${p.id}`,
      })),
    ]
    setResults(all)
    setLoading(false)
  }, [user])

  const TYPE_META: Record<ResultType, { label: string; Icon: typeof BookOpen; color: string; bg: string }> = {
    estudo: { label: 'Estudo', Icon: Layers, color: 'var(--accent)', bg: 'var(--accent-soft)' },
    anotacao: { label: 'Anotacao', Icon: FileText, color: 'var(--gold)', bg: 'var(--gold-soft)' },
    pregacao: { label: 'Pregacao', Icon: Mic, color: 'var(--success)', bg: 'var(--success-soft)' },
  }

  const grouped = results.reduce<Record<ResultType, Result[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = []
    acc[r.type].push(r)
    return acc
  }, {} as Record<ResultType, Result[]>)

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-6 pt-6 pb-3">
        <h1 className="text-2xl font-extrabold text-conteudo mb-4">Busca Global</h1>
        <div className="flex items-center gap-2 border-2 border-indigo-200 bg-surface rounded-2xl px-4 py-3">
          <Search size={20} color="var(--accent)" />
          <input
            autoFocus
            type="text"
            placeholder="Buscar em estudos, anotacoes e pregacoes..."
            value={query}
            onChange={e => handleSearch(e.target.value)}
            className="flex-1 text-sm text-conteudo outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]); setSearched(false) }}>
              <X size={18} color="var(--text-faint)" />
            </button>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 flex flex-col gap-4">
        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 rounded-full border-2 border-indigo-300 border-t-indigo-600 animate-spin" />
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-3">
            <Search size={48} color="var(--border-strong)" />
            <p className="text-lg font-bold text-conteudo-faint">Nenhum resultado</p>
            <p className="text-sm text-conteudo-faint text-center">Tente outras palavras-chave</p>
          </div>
        )}

        {!loading && !searched && (
          <div className="flex flex-col items-center py-16 gap-3 text-center">
            <span className="text-5xl">🔍</span>
            <p className="text-base font-bold text-conteudo-muted">Digite para buscar</p>
            <p className="text-sm text-conteudo-faint">Pesquisa em estudos, anotacoes e pregacoes</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="text-sm text-conteudo-muted font-semibold">{results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}</p>
            {(Object.entries(grouped) as [ResultType, Result[]][]).map(([type, items]) => {
              const meta = TYPE_META[type]
              return (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: meta.bg }}>
                      <meta.Icon size={14} color={meta.color} />
                    </div>
                    <span className="text-xs font-bold text-conteudo-muted uppercase tracking-wider">{meta.label}s ({items.length})</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {items.map(r => (
                      <Link key={r.id} href={r.href}
                        className="bg-surface rounded-2xl p-4 shadow-sm flex items-start gap-3 hover:shadow-md transition-shadow">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: meta.bg }}>
                          <meta.Icon size={16} color={meta.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-conteudo text-sm truncate">{r.title}</p>
                          <p className="text-xs text-conteudo-muted mt-0.5 line-clamp-2">{r.subtitle}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
