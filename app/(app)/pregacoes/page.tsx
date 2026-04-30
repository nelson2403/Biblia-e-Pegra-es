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
        <h1 className="text-2xl font-extrabold text-gray-800">Pregacoes</h1>
        <Link href="/pregacoes/nova"
          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: '#059669' }}>
          <Plus size={22} />
        </Link>
      </div>

      <div className="px-6 mb-3">
        <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-xl px-3 py-2.5">
          <Search size={17} color="#9CA3AF" />
          <input type="text" placeholder="Buscar pregacoes..." value={search} onChange={e => onSearch(e.target.value)}
            className="flex-1 text-sm text-gray-700 outline-none" />
          {search && <button onClick={() => onSearch('')}><X size={16} color="#9CA3AF" /></button>}
        </div>
      </div>

      <div className="px-6 pb-6 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <Mic size={48} color="#D1D5DB" />
            <p className="text-lg font-bold text-gray-400">Nenhuma pregacao ainda</p>
            <p className="text-sm text-gray-400 text-center">Clique no + para criar sua primeira pregacao guiada</p>
          </div>
        ) : filtered.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#3730A3' }}>
                <Mic size={20} color="#fff" />
              </div>
              <Link href={`/pregacoes/${item.id}`} className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm truncate">{item.tema}</p>
                <p className="text-xs font-semibold truncate" style={{ color: '#4F46E5' }}>{item.texto_base}</p>
              </Link>
              <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl hover:bg-red-50 text-red-500">
                <Trash2 size={17} />
              </button>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Users size={12} />
                <span className="truncate max-w-[120px]">{item.publico}</span>
              </div>
              <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
