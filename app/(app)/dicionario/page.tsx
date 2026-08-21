'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Search, X, BookOpen, ChevronRight } from 'lucide-react'
import { DICTIONARY, DictEntry } from '@/data/dictionary'
import { BIBLE_BOOKS } from '@/data/bibleBooks'

type LangFilter = 'todos' | 'H' | 'G'

function parseVerseLink(verse: string): string | null {
  const lastSpace = verse.lastIndexOf(' ')
  if (lastSpace === -1) return null
  let abbr = verse.substring(0, lastSpace)
  const chVerse = verse.substring(lastSpace + 1)
  const colon = chVerse.indexOf(':')
  if (colon === -1) return null
  const chapter = parseInt(chVerse.substring(0, colon))
  const verseNum = parseInt(chVerse.substring(colon + 1))
  if (isNaN(chapter) || isNaN(verseNum)) return null
  // Normaliza abreviaturas com acento (ex: Êx → Ex)
  abbr = abbr.replace(/Ê/g, 'E').replace(/Á/g, 'A')
  const book = BIBLE_BOOKS.find(b => b.abbr === abbr)
  if (!book) return null
  return `/biblia/${book.id}/${chapter}?v=${verseNum}`
}

function Badge({ lang }: { lang: 'H' | 'G' }) {
  const isH = lang === 'H'
  return (
    <span
      className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-extrabold flex-shrink-0"
      style={{
        backgroundColor: isH ? 'var(--accent-soft)' : 'var(--gold-soft)',
        color: isH ? 'var(--accent)' : 'var(--gold)',
      }}
    >
      {lang}
    </span>
  )
}

function EntryCard({ entry, onClick }: { entry: DictEntry; onClick: () => void }) {
  const isH = entry.lang === 'H'
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface rounded-2xl p-4 shadow-cartao flex items-center gap-3 active:scale-[0.98] transition-transform"
    >
      <Badge lang={entry.lang} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-lg font-bold leading-tight"
            style={{ color: 'var(--text)', fontFamily: 'serif', direction: isH ? 'rtl' : 'ltr' }}
          >
            {entry.word}
          </span>
          <span className="text-xs font-semibold text-conteudo-faint italic">{entry.translit}</span>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-muted)' }}
          >
            {entry.id}
          </span>
        </div>
        <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--accent)' }}>
          {entry.ptGloss}
        </p>
        <p className="text-xs text-conteudo-muted mt-0.5 line-clamp-2">{entry.definition}</p>
      </div>
      <ChevronRight size={16} color="var(--border-strong)" className="flex-shrink-0" />
    </button>
  )
}

function ModalBottomSheet({
  entry,
  onClose,
}: {
  entry: DictEntry
  onClose: () => void
}) {
  const isH = entry.lang === 'H'
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div
        className="w-full max-w-lg rounded-t-[28px] overflow-hidden flex flex-col"
        style={{ backgroundColor: '#fff', maxHeight: '90vh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'var(--border-strong)' }} />
        </div>

        {/* Header */}
        <div
          className="px-5 py-4 flex items-start gap-3 flex-shrink-0"
          style={{
            background: isH
              ? 'linear-gradient(135deg, #4F46E5 0%, #1E1B4B 100%)'
              : 'linear-gradient(135deg, #F59E0B 0%, #92400E 100%)',
          }}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-3xl font-bold text-white"
                style={{ fontFamily: 'serif', direction: isH ? 'rtl' : 'ltr' }}
              >
                {entry.word}
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' }}
              >
                {entry.id}
              </span>
            </div>
            <p className="text-white/80 text-sm italic mt-0.5">{entry.translit}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <X size={18} color="#fff" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4 pb-8">
          {/* Lang badge + gloss */}
          <div className="flex items-center gap-3">
            <Badge lang={entry.lang} />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-conteudo-faint">
                {isH ? 'Hebraico' : 'Grego'}
              </p>
              <p className="text-base font-extrabold" style={{ color: 'var(--text)' }}>
                {entry.ptGloss}
              </p>
            </div>
          </div>

          {/* Definition */}
          <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--accent-soft)' }}>
            <p
              className="text-[11px] font-bold uppercase tracking-wider mb-2"
              style={{ color: 'var(--accent)' }}
            >
              Definição
            </p>
            <p className="text-sm text-conteudo leading-relaxed">{entry.definition}</p>
          </div>

          {/* Verses */}
          {entry.verses.length > 0 && (
            <div>
              <p
                className="text-[11px] font-bold uppercase tracking-wider mb-2"
                style={{ color: 'var(--accent)' }}
              >
                Versículos de Referência
              </p>
              <div className="flex flex-col gap-2">
                {entry.verses.map((v, i) => {
                  const link = parseVerseLink(v)
                  return link ? (
                    <Link
                      key={i}
                      href={link}
                      onClick={onClose}
                      className="flex items-center gap-2 rounded-2xl px-3 py-2 active:opacity-60 transition-opacity"
                      style={{ backgroundColor: 'var(--accent-soft)', borderLeft: '3px solid #4F46E5' }}
                    >
                      <BookOpen size={14} color="var(--accent)" className="flex-shrink-0" />
                      <p className="text-sm font-bold flex-1" style={{ color: 'var(--accent)' }}>{v}</p>
                      <ChevronRight size={14} color="var(--accent)" className="flex-shrink-0" />
                    </Link>
                  ) : (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-2xl px-3 py-2"
                      style={{ backgroundColor: 'var(--surface-2)', borderLeft: '3px solid #4F46E5' }}
                    >
                      <BookOpen size={14} color="var(--accent)" className="flex-shrink-0" />
                      <p className="text-sm font-semibold text-conteudo">{v}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Word original in large */}
          <div
            className="rounded-2xl p-4 flex items-center justify-center"
            style={{ backgroundColor: '#1E1B4B' }}
          >
            <p
              className="text-4xl font-bold text-white text-center"
              style={{ fontFamily: 'serif', direction: isH ? 'rtl' : 'ltr', lineHeight: 1.4 }}
            >
              {entry.word}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const TABS: { label: string; value: LangFilter }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Hebraico', value: 'H' },
  { label: 'Grego', value: 'G' },
]

export default function DicionarioPage() {
  const [langFilter, setLangFilter] = useState<LangFilter>('todos')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<DictEntry | null>(null)

  const results = useMemo(() => {
    let list = DICTIONARY
    if (langFilter !== 'todos') {
      list = list.filter((e) => e.lang === langFilter)
    }
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (e) =>
          e.word.toLowerCase().includes(q) ||
          e.translit.toLowerCase().includes(q) ||
          e.ptGloss.toLowerCase().includes(q) ||
          e.definition.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q)
      )
    }
    return [...list].sort((a, b) => a.id.localeCompare(b.id))
  }, [langFilter, search])

  const hebrewCount = DICTIONARY.filter((e) => e.lang === 'H').length
  const greekCount = DICTIONARY.filter((e) => e.lang === 'G').length

  return (
    <div className="flex flex-col min-h-full bg-bg">
      {/* Header */}
      <div
        className="px-5 pt-6 pb-5"
        style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #1E1B4B 100%)' }}
      >
        <h1 className="text-2xl font-extrabold text-white">Dicionário Bíblico</h1>
        <p className="text-white/70 text-sm mt-0.5">
          {hebrewCount} palavras hebraicas · {greekCount} palavras gregas
        </p>

        {/* Search */}
        <div className="mt-4 flex items-center gap-2 bg-white/15 rounded-2xl px-3 py-2.5 border border-white/20">
          <Search size={17} color="rgba(255,255,255,0.7)" />
          <input
            type="text"
            placeholder="Buscar palavra, transliteração ou definição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent text-white placeholder-white/60 outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X size={16} color="rgba(255,255,255,0.7)" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 py-3 flex gap-2 bg-surface shadow-cartao">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setLangFilter(tab.value)}
            className="flex-1 py-2 rounded-2xl text-sm font-bold transition-all"
            style={{
              backgroundColor: langFilter === tab.value ? 'var(--accent)' : 'var(--surface-2)',
              color: langFilter === tab.value ? '#fff' : 'var(--text-muted)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="px-5 py-2">
        <p className="text-xs text-conteudo-faint font-semibold">
          {results.length} {results.length === 1 ? 'palavra encontrada' : 'palavras encontradas'}
          {search ? ` para "${search}"` : ''}
        </p>
      </div>

      {/* List */}
      <div className="px-4 pb-10 flex flex-col gap-2">
        {results.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <BookOpen size={48} color="var(--border-strong)" />
            <p className="text-lg font-bold text-conteudo-faint">Nenhum resultado encontrado</p>
            <p className="text-sm text-conteudo-faint text-center">
              Tente buscar por palavra, transliteração ou código Strong's (ex: H7965)
            </p>
            <button
              onClick={() => {
                setSearch('')
                setLangFilter('todos')
              }}
              className="mt-2 px-4 py-2 rounded-2xl text-sm font-bold text-white"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          results.map((entry) => (
            <EntryCard key={entry.id} entry={entry} onClick={() => setSelected(entry)} />
          ))
        )}
      </div>

      {/* Modal */}
      {selected && (
        <ModalBottomSheet entry={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
