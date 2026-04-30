'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { BookOpen, CheckCircle2, Target } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { BIBLE_BOOKS } from '@/data/bibleBooks'
import { HistoricoLeitura } from '@/types'
import { LoadingSpinner } from '@/components/LoadingSpinner'

const TOTAL_CHAPTERS = BIBLE_BOOKS.reduce((sum, b) => sum + b.chapters, 0)

function calcStreak(dates: string[]): number {
  if (!dates.length) return 0
  const unique = Array.from(new Set(dates)).sort().reverse()
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  if (unique[0] !== today && unique[0] !== yesterday) return 0
  let streak = 1
  for (let i = 1; i < unique.length; i++) {
    const a = new Date(unique[i - 1]).getTime()
    const b = new Date(unique[i]).getTime()
    if ((a - b) / 86400000 === 1) streak++
    else break
  }
  return streak
}

export default function PlanoPage() {
  const { user } = useAuth()
  const [historico, setHistorico] = useState<HistoricoLeitura[]>([])
  const [loading, setLoading] = useState(true)
  const [testament, setTestament] = useState<'todos' | 'AT' | 'NT'>('todos')

  const fetchHistorico = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('historico_leitura')
      .select('*')
      .eq('user_id', user.id)
      .order('lido_em', { ascending: false })
    setHistorico(data ?? [])
  }, [user])

  useEffect(() => {
    setLoading(true)
    fetchHistorico().finally(() => setLoading(false))
  }, [fetchHistorico])

  const readSet = new Set(historico.map(h => `${h.livro_en}-${h.capitulo}`))
  const streak = calcStreak(historico.map(h => h.lido_em))

  const booksFiltered = testament === 'todos' ? BIBLE_BOOKS : BIBLE_BOOKS.filter(b => b.testament === testament)
  const totalFiltered = booksFiltered.reduce((sum, b) => sum + b.chapters, 0)
  const readFiltered = booksFiltered.reduce((sum, b) => {
    const chaptersRead = Array.from({ length: b.chapters }, (_, i) => i + 1)
      .filter(ch => readSet.has(`${b.en}-${ch}`)).length
    return sum + chaptersRead
  }, 0)
  const pct = totalFiltered > 0 ? (readFiltered / totalFiltered) * 100 : 0

  const nextUnread = (() => {
    for (const book of BIBLE_BOOKS) {
      for (let ch = 1; ch <= book.chapters; ch++) {
        if (!readSet.has(`${book.en}-${ch}`)) return { book, ch }
      }
    }
    return null
  })()

  const recentBooks = (() => {
    const seen = new Set<string>()
    const result: { book: typeof BIBLE_BOOKS[0]; ch: number; lido_em: string }[] = []
    for (const h of historico.slice(0, 30)) {
      const book = BIBLE_BOOKS.find(b => b.en === h.livro_en)
      if (book && !seen.has(`${h.livro_en}-${h.capitulo}`)) {
        seen.add(`${h.livro_en}-${h.capitulo}`)
        result.push({ book, ch: h.capitulo, lido_em: h.lido_em })
        if (result.length >= 5) break
      }
    }
    return result
  })()

  if (loading) return <LoadingSpinner fullScreen={false} />

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-extrabold text-gray-800">Plano de Leitura</h1>
        <p className="text-sm text-gray-400 mt-0.5">Leia a Biblia completa</p>
      </div>

      {/* Streak + overall stats */}
      <div className="px-6 mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: '#FFF7ED' }}>
          <p className="text-2xl font-extrabold text-orange-500">🔥{streak}</p>
          <p className="text-xs font-semibold text-gray-500">Dias seguidos</p>
        </div>
        <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: '#EEF2FF' }}>
          <p className="text-2xl font-extrabold text-primary">{readSet.size}</p>
          <p className="text-xs font-semibold text-gray-500">Caps lidos</p>
        </div>
        <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: '#ECFDF5' }}>
          <p className="text-2xl font-extrabold text-green-600">{pct.toFixed(0)}%</p>
          <p className="text-xs font-semibold text-gray-500">Concluido</p>
        </div>
      </div>

      <div className="px-6 flex flex-col gap-4 pb-6">
        {/* Testament filter */}
        <div className="flex gap-2">
          {(['todos', 'AT', 'NT'] as const).map(t => (
            <button key={t} onClick={() => setTestament(t)}
              className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
              style={{
                backgroundColor: testament === t ? '#4F46E5' : '#F3F4F6',
                color: testament === t ? '#fff' : '#6B7280',
              }}>
              {t === 'todos' ? 'Toda a Biblia' : t === 'AT' ? 'A. Testamento' : 'N. Testamento'}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-700">Progresso</span>
            <span className="text-sm font-bold text-primary">{readFiltered}/{totalFiltered} capitulos</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-1">
            <div className="h-3 rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #4F46E5, #7C3AED)' }} />
          </div>
          <p className="text-xs text-gray-400 text-right">{(totalFiltered - readFiltered)} capitulos restantes</p>
        </div>

        {/* Next reading suggestion */}
        {nextUnread && (
          <div className="rounded-2xl p-4 text-white" style={{ background: 'linear-gradient(135deg, #1E1B4B, #4F46E5)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} color="#F59E0B" />
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Proxima leitura sugerida</span>
            </div>
            <p className="text-lg font-extrabold">{nextUnread.book.pt} {nextUnread.ch}</p>
            <p className="text-xs text-white/60 mb-3">{nextUnread.book.testament === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'}</p>
            <Link href={`/biblia/${nextUnread.book.en}/${nextUnread.ch}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 text-sm font-bold text-white hover:bg-white/30 transition-colors">
              <BookOpen size={16} /> Ler agora
            </Link>
          </div>
        )}

        {nextUnread === null && (
          <div className="rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg, #059669, #10B981)' }}>
            <p className="text-3xl mb-2">🎉</p>
            <p className="text-white font-extrabold text-lg">Biblia completa!</p>
            <p className="text-white/80 text-sm mt-1">Parabens! Voce leu toda a Biblia!</p>
          </div>
        )}

        {/* Book-by-book progress */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-bold text-gray-700 mb-3">Por livro</p>
          <div className="flex flex-col gap-2.5" style={{ maxHeight: 400, overflowY: 'auto' }}>
            {booksFiltered.map(book => {
              const read = Array.from({ length: book.chapters }, (_, i) => i + 1)
                .filter(ch => readSet.has(`${book.en}-${ch}`)).length
              const bookPct = (read / book.chapters) * 100
              const done = read === book.chapters
              return (
                <Link key={book.id} href={`/biblia/${book.en}/1`} className="block">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {done ? <CheckCircle2 size={14} color="#059669" /> : <BookOpen size={14} color="#9CA3AF" />}
                      <span className="text-xs font-semibold" style={{ color: done ? '#059669' : '#374151' }}>{book.pt}</span>
                    </div>
                    <span className="text-xs text-gray-400">{read}/{book.chapters}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-1.5 rounded-full transition-all"
                      style={{ width: `${bookPct}%`, backgroundColor: done ? '#059669' : '#4F46E5' }} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent readings */}
        {recentBooks.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-bold text-gray-700 mb-3">Lidos recentemente</p>
            <div className="flex flex-col gap-2">
              {recentBooks.map(({ book, ch, lido_em }) => (
                <Link key={`${book.en}-${ch}`} href={`/biblia/${book.en}/${ch}`}
                  className="flex items-center gap-3 py-1">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#EEF2FF' }}>
                    <BookOpen size={16} color="#4F46E5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{book.pt} {ch}</p>
                    <p className="text-xs text-gray-400">{new Date(lido_em + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
