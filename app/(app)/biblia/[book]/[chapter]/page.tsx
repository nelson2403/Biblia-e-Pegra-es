'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronLeft, ChevronRight, Share2, Heart, Copy, BookmarkPlus } from 'lucide-react'
import { BIBLE_BOOKS } from '@/data/bibleBooks'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface Verse { verse: number; text: string }

const cache: Record<string, Verse[]> = {}

export default function CapituloPage({ params }: { params: { book: string; chapter: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const bookData = BIBLE_BOOKS.find(b => b.id === parseInt(params.book) || b.en === params.book)
  const [currentChapter, setCurrentChapter] = useState(parseInt(params.chapter) || 1)
  const [verses, setVerses] = useState<Verse[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Verse | null>(null)
  const [fontSize, setFontSize] = useState(16)
  const [showPicker, setShowPicker] = useState(false)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [copied, setCopied] = useState(false)

  const totalChapters = bookData?.chapters ?? 1
  const isAT = bookData?.testament === 'AT'
  const gradientColors = isAT ? 'from-indigo-900 to-purple-700' : 'from-blue-900 to-blue-600'

  const loadChapter = useCallback(async () => {
    if (!bookData) return
    const key = `${bookData.en}-${currentChapter}`
    if (cache[key]) {
      setVerses(cache[key])
      setLoading(false)
    } else {
      setLoading(true)
      try {
        const bookName = bookData.en.replace(/\+/g, '%20')
        const res = await fetch(`https://bible-api.com/${bookName}%20${currentChapter}?translation=almeida`)
        const data = await res.json()
        if (data.verses && data.verses.length > 0) {
          const parsed: Verse[] = data.verses.map((v: any) => ({ verse: v.verse, text: v.text.trim() }))
          cache[key] = parsed
          setVerses(parsed)
        } else {
          setVerses([])
        }
      } catch { setVerses([]) }
      setLoading(false)
    }

    if (user) {
      // Load favorites for this chapter
      supabase.from('favoritos')
        .select('versiculo')
        .eq('user_id', user.id)
        .eq('livro_en', bookData.en)
        .eq('capitulo', currentChapter)
        .then(({ data }) => setFavorites(new Set((data ?? []).map((f: any) => f.versiculo))))

      // Record chapter read in history
      supabase.from('historico_leitura').upsert({
        user_id: user.id,
        livro_en: bookData.en,
        livro_pt: bookData.pt,
        capitulo: currentChapter,
        lido_em: new Date().toISOString().split('T')[0],
      }, { onConflict: 'user_id,livro_en,capitulo' }).then(() => {})
    }
  }, [bookData, currentChapter, user])

  useEffect(() => { loadChapter() }, [loadChapter])
  useEffect(() => { setSelected(null) }, [currentChapter])

  const goChapter = (dir: 1 | -1) => {
    const next = currentChapter + dir
    if (next < 1 || next > totalChapters) return
    setCurrentChapter(next)
    router.replace(`/biblia/${params.book}/${next}`, { scroll: false })
  }

  const toggleFavorite = async (v: Verse) => {
    if (!user || !bookData) return
    const isFav = favorites.has(v.verse)
    if (isFav) {
      await supabase.from('favoritos').delete()
        .eq('user_id', user.id).eq('livro_en', bookData.en)
        .eq('capitulo', currentChapter).eq('versiculo', v.verse)
      setFavorites(prev => { const s = new Set(prev); s.delete(v.verse); return s })
    } else {
      await supabase.from('favoritos').insert({
        user_id: user.id, livro_pt: bookData.pt, livro_en: bookData.en,
        capitulo: currentChapter, versiculo: v.verse, texto: v.text,
      })
      setFavorites(prev => new Set(Array.from(prev).concat([v.verse])))
    }
  }

  const copyVerse = async (v: Verse) => {
    if (!bookData) return
    await navigator.clipboard.writeText(`"${v.text}" — ${bookData.pt} ${currentChapter}:${v.verse}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (!selected || !bookData) return
    const text = `"${selected.text}"\n\n— ${bookData.pt} ${currentChapter}:${selected.verse} (Almeida)`
    if (navigator.share) await navigator.share({ text })
    else { await navigator.clipboard.writeText(text); alert('Copiado!') }
  }

  const handleNoteVerse = () => {
    if (!selected || !bookData) return
    const ref = encodeURIComponent(`${bookData.pt} ${currentChapter}:${selected.verse}`)
    const texto = encodeURIComponent(selected.text)
    router.push(`/anotacoes/nova?ref=${ref}&texto=${texto}`)
  }

  if (!bookData) return <div className="p-6 text-gray-500">Livro nao encontrado.</div>

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className={`bg-gradient-to-br ${gradientColors} px-4 pt-4 pb-4 text-white`}>
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-white/10">
            <ArrowLeft size={22} />
          </button>
          <button onClick={() => setShowPicker(true)} className="flex-1 text-center">
            <p className="text-lg font-extrabold">{bookData.pt}</p>
            <span className="inline-flex items-center gap-1 text-xs bg-white/20 px-3 py-0.5 rounded-full font-semibold">
              Cap. {currentChapter} ▾
            </span>
          </button>
          <div className="flex gap-1">
            <button onClick={() => setFontSize(s => Math.min(s + 2, 24))}
              className="p-1 text-sm font-bold bg-white/15 rounded-lg w-8 h-8 flex items-center justify-center">A+</button>
            <button onClick={() => setFontSize(s => Math.max(s - 2, 12))}
              className="p-1 text-xs font-bold bg-white/15 rounded-lg w-8 h-8 flex items-center justify-center">A-</button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button onClick={() => goChapter(-1)} disabled={currentChapter <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold bg-white/15 disabled:opacity-30">
            <ChevronLeft size={16} /> Anterior
          </button>
          <span className="text-xs text-white/60">{currentChapter} / {totalChapters}</span>
          <button onClick={() => goChapter(1)} disabled={currentChapter >= totalChapters}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold bg-white/15 disabled:opacity-30">
            Proximo <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Verses */}
      {loading ? <LoadingSpinner fullScreen={false} /> : (
        <div className="flex-1 px-4 py-4 pb-36 space-y-0.5">
          {verses.length === 0 && (
            <div className="flex flex-col items-center py-20 gap-3">
              <p className="text-gray-400 text-sm text-center">Versículos não disponíveis para este capítulo.</p>
            </div>
          )}
          {verses.map(v => {
            const isSelected = selected?.verse === v.verse
            const isFav = favorites.has(v.verse)
            return (
              <button key={v.verse}
                onClick={() => setSelected(prev => prev?.verse === v.verse ? null : v)}
                className="flex gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-colors"
                style={{ backgroundColor: isSelected ? '#EEF2FF' : 'transparent' }}>
                <span className="text-xs font-bold w-5 pt-1 flex-shrink-0"
                  style={{ color: isFav ? '#EF4444' : isSelected ? '#4F46E5' : '#9CA3AF' }}>
                  {isFav ? '♥' : v.verse}
                </span>
                <span className="leading-relaxed flex-1"
                  style={{ fontSize, color: isSelected ? '#3730A3' : '#1F2937', fontWeight: isSelected ? 500 : 400 }}>
                  {v.text}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Selected verse action bar */}
      {selected && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-60 bg-white border-t border-gray-200 shadow-xl z-40">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-500 text-center">
              {bookData.pt} {currentChapter}:{selected.verse}
            </p>
          </div>
          <div className="px-4 py-3 grid grid-cols-4 gap-2">
            <button onClick={() => copyVerse(selected)}
              className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-gray-50">
              <Copy size={18} color={copied ? '#059669' : '#4F46E5'} />
              <span className="text-[11px] font-semibold" style={{ color: copied ? '#059669' : '#4F46E5' }}>
                {copied ? 'Copiado!' : 'Copiar'}
              </span>
            </button>
            <button onClick={() => toggleFavorite(selected)}
              className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-gray-50">
              <Heart size={18}
                fill={favorites.has(selected.verse) ? '#EF4444' : 'none'}
                color={favorites.has(selected.verse) ? '#EF4444' : '#6B7280'} />
              <span className="text-[11px] font-semibold"
                style={{ color: favorites.has(selected.verse) ? '#EF4444' : '#6B7280' }}>
                {favorites.has(selected.verse) ? 'Salvo' : 'Favoritar'}
              </span>
            </button>
            <button onClick={handleNoteVerse}
              className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-gray-50">
              <BookmarkPlus size={18} color="#D97706" />
              <span className="text-[11px] font-semibold text-amber-600">Anotar</span>
            </button>
            <button onClick={handleShare}
              className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-gray-50">
              <Share2 size={18} color="#059669" />
              <span className="text-[11px] font-semibold text-green-600">Partilhar</span>
            </button>
          </div>
        </div>
      )}

      {/* Chapter Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
          onClick={() => setShowPicker(false)}>
          <div className="bg-white w-full max-w-lg rounded-t-3xl p-5 max-h-[70vh] flex flex-col"
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded self-center mb-4" />
            <h3 className="text-lg font-bold text-gray-800 text-center mb-4">Escolher Capitulo</h3>
            <div className="overflow-y-auto flex flex-wrap gap-2 justify-center pb-4">
              {Array.from({ length: totalChapters }, (_, i) => i + 1).map(ch => (
                <button key={ch}
                  onClick={() => { setCurrentChapter(ch); setShowPicker(false); router.replace(`/biblia/${params.book}/${ch}`, { scroll: false }) }}
                  className="w-12 h-12 rounded-xl text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: ch === currentChapter ? '#4F46E5' : '#F3F4F6',
                    color: ch === currentChapter ? '#fff' : '#1F2937',
                  }}>
                  {ch}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
