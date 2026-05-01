'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Heart, Search, X, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Favorito } from '@/types'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { BIBLE_BOOKS } from '@/data/bibleBooks'

export default function FavoritosPage() {
  const { user } = useAuth()
  const [favoritos, setFavoritos] = useState<Favorito[]>([])
  const [filtered, setFiltered] = useState<Favorito[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchFavoritos = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('favoritos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setFavoritos(data ?? [])
    setFiltered(data ?? [])
  }, [user])

  useEffect(() => {
    setLoading(true)
    fetchFavoritos().finally(() => setLoading(false))
  }, [fetchFavoritos])

  const onSearch = (text: string) => {
    setSearch(text)
    if (!text.trim()) { setFiltered(favoritos); return }
    const q = text.toLowerCase()
    setFiltered(favoritos.filter(f =>
      f.livro_pt.toLowerCase().includes(q) || f.texto.toLowerCase().includes(q)
    ))
  }

  const handleDelete = async (f: Favorito) => {
    await supabase.from('favoritos').delete().eq('id', f.id)
    fetchFavoritos()
  }

  // Group by book
  const grouped = filtered.reduce<Record<string, Favorito[]>>((acc, f) => {
    const key = f.livro_pt
    if (!acc[key]) acc[key] = []
    acc[key].push(f)
    return acc
  }, {})

  if (loading) return <LoadingSpinner fullScreen={false} />

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex items-center justify-between px-6 pt-6 pb-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Favoritos</h1>
          <p className="text-xs text-gray-400">{favoritos.length} versiculos salvos</p>
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
          <Heart size={20} color="#EF4444" fill="#EF4444" />
        </div>
      </div>

      <div className="px-6 mb-3">
        <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-xl px-3 py-2.5">
          <Search size={17} color="#9CA3AF" />
          <input type="text" placeholder="Buscar versiculos..." value={search}
            onChange={e => onSearch(e.target.value)}
            className="flex-1 text-sm text-gray-700 outline-none" />
          {search && <button onClick={() => onSearch('')}><X size={16} color="#9CA3AF" /></button>}
        </div>
      </div>

      <div className="px-6 pb-6 flex flex-col gap-4">
        {Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <Heart size={48} color="#D1D5DB" />
            <p className="text-lg font-bold text-gray-400">Nenhum favorito ainda</p>
            <p className="text-sm text-gray-400 text-center">
              {search ? 'Nenhum resultado encontrado' : 'Toque em um versiculo na Biblia e clique em Favoritar'}
            </p>
            {!search && (
              <Link href="/biblia"
                className="mt-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm"
                style={{ backgroundColor: '#4F46E5' }}>
                Ler a Biblia
              </Link>
            )}
          </div>
        ) : Object.entries(grouped).map(([livro, verses]) => (
          <div key={livro}>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">{livro}</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="flex flex-col gap-2">
              {verses.map(f => (
                <div key={f.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Link href={`/biblia/${BIBLE_BOOKS.find(b => b.en === f.livro_en)?.id ?? f.livro_en}/${f.capitulo}?v=${f.versiculo}`} className="flex-1 min-w-0">
                      <p className="text-xs font-bold mb-1.5" style={{ color: '#4F46E5' }}>
                        {f.livro_pt} {f.capitulo}:{f.versiculo}
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed italic">"{f.texto}"</p>
                    </Link>
                    <button onClick={() => handleDelete(f)} className="p-2 rounded-xl hover:bg-red-50 flex-shrink-0">
                      <Trash2 size={16} color="#EF4444" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
