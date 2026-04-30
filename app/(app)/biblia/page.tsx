'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, X, Layers } from 'lucide-react'
import { BIBLE_BOOKS, AT_BOOKS, NT_BOOKS, BibleBook } from '@/data/bibleBooks'

export default function BibliaPage() {
  const [tab, setTab] = useState<'AT' | 'NT'>('AT')
  const [search, setSearch] = useState('')

  const books = tab === 'AT' ? AT_BOOKS : NT_BOOKS
  const isSearching = search.trim().length > 0
  const filtered = isSearching
    ? BIBLE_BOOKS.filter(b =>
        b.pt.toLowerCase().includes(search.toLowerCase()) ||
        b.abbr.toLowerCase().includes(search.toLowerCase())
      )
    : books

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-6 pt-6 pb-6 text-white"
        style={{ background: 'linear-gradient(135deg, #3730A3, #4F46E5, #7C3AED)' }}>
        <h1 className="text-2xl font-extrabold mb-0.5">Biblia Sagrada</h1>
        <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>Almeida Revisada - 66 livros</p>

        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
          <Search size={16} color="rgba(255,255,255,0.7)" />
          <input
            type="text"
            placeholder="Buscar livro..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X size={16} color="rgba(255,255,255,0.7)" />
            </button>
          )}
        </div>
      </div>

      {!isSearching && (
        <div className="flex border-b border-gray-200 bg-white">
          {(['AT', 'NT'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-3 text-sm font-semibold transition-colors"
              style={{
                color: tab === t ? '#4F46E5' : '#6B7280',
                borderBottom: tab === t ? '3px solid #4F46E5' : '3px solid transparent',
              }}>
              {t === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'}
              <br />
              <span className="text-xs font-normal">{t === 'AT' ? '39 livros' : '27 livros'}</span>
            </button>
          ))}
        </div>
      )}

      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}

function BookCard({ book }: { book: BibleBook }) {
  const isAT = book.testament === 'AT'
  const accentColor = isAT ? '#7C3AED' : '#1D4ED8'
  const badgeBg = isAT ? '#EDE9FE' : '#DBEAFE'

  return (
    <Link href={`/biblia/${book.en}/1`}
      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 flex flex-col"
      style={{ borderLeftColor: accentColor }}>
      <span className="self-start text-xs font-extrabold px-2 py-1 rounded-md mb-2"
        style={{ backgroundColor: badgeBg, color: accentColor }}>
        {book.abbr}
      </span>
      <p className="text-sm font-bold text-gray-800 leading-tight mb-2">{book.pt}</p>
      <div className="flex items-center gap-1 mt-auto">
        <Layers size={11} color="#9CA3AF" />
        <span className="text-xs text-gray-400">{book.chapters} cap.</span>
      </div>
    </Link>
  )
}
