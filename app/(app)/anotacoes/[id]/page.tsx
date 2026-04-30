'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export default function AnotacaoDetalhePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('anotacoes').select('*').eq('id', params.id).single().then(({ data }) => {
      if (data) { setTitulo(data.titulo); setConteudo(data.conteudo) }
      setLoading(false)
    })
  }, [params.id])

  const handleSave = async () => {
    if (!titulo.trim() || !conteudo.trim()) { alert('Preencha título e conteúdo.'); return }
    setSaving(true)
    await supabase.from('anotacoes').update({ titulo, conteudo, updated_at: new Date().toISOString() }).eq('id', params.id)
    setSaving(false)
    setEditing(false)
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta anotação?')) return
    await supabase.from('anotacoes').delete().eq('id', params.id)
    router.push('/anotacoes')
  }

  if (loading) return <LoadingSpinner fullScreen={false} />

  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100">
          <ArrowLeft size={22} color="#1F2937" />
        </button>
        <h1 className="flex-1 text-center text-base font-bold text-gray-800">
          {editing ? 'Editando' : 'Anotação'}
        </h1>
        <div className="flex items-center gap-1">
          {!editing ? (
            <>
              <button onClick={() => setEditing(true)} className="p-2 rounded-xl hover:bg-gray-100 text-primary">
                <Pencil size={19} />
              </button>
              <button onClick={handleDelete} className="p-2 rounded-xl hover:bg-red-50 text-red-500">
                <Trash2 size={19} />
              </button>
            </>
          ) : (
            <button onClick={handleSave} disabled={saving}
              className="px-4 py-1.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: '#4F46E5' }}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col gap-0">
        {editing ? (
          <>
            <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)}
              className="w-full text-2xl font-bold text-gray-800 outline-none mb-3" />
            <div className="h-px bg-gray-100 mb-4" />
            <textarea value={conteudo} onChange={e => setConteudo(e.target.value)}
              className="flex-1 w-full text-base text-gray-700 outline-none resize-none leading-relaxed min-h-[60vh]" />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">{titulo}</h2>
            <div className="h-px bg-gray-100 mb-4" />
            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{conteudo}</p>
          </>
        )}
      </div>
    </div>
  )
}
