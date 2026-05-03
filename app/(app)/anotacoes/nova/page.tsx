'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function NovaAnotacaoPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const ref = searchParams.get('ref')
    const texto = searchParams.get('texto')
    if (ref) setTitulo(ref)
    if (texto) setConteudo(`"${texto}"\n\n`)
  }, [searchParams])

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/[^a-z0-9À-ɏ ]/g, '')
    if (tag && !tags.includes(tag)) setTags(prev => [...prev, tag])
    setTagInput('')
  }

  const handleTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput) }
    if (e.key === 'Backspace' && !tagInput && tags.length) setTags(prev => prev.slice(0, -1))
  }

  const handleSave = async () => {
    if (!titulo.trim()) { alert('Digite um titulo para a anotacao.'); return }
    if (!conteudo.trim()) { alert('Digite o conteudo da anotacao.'); return }
    setSaving(true)
    const now = new Date().toISOString()
    const { error } = await supabase.from('anotacoes').insert({
      titulo: titulo.trim(),
      conteudo: conteudo.trim(),
      tags: tags.join(',') || null,
      user_id: user!.id,
      created_at: now,
      updated_at: now,
    })
    setSaving(false)
    if (error) {
      alert(`Erro ao salvar: ${error.message}`)
      return
    }
    router.push('/anotacoes')
  }

  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100">
          <ArrowLeft size={22} color="#1F2937" />
        </button>
        <h1 className="flex-1 text-center text-base font-bold text-gray-800">Nova Anotacao</h1>
        <button onClick={handleSave} disabled={saving}
          className="px-4 py-1.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
          style={{ backgroundColor: '#4F46E5' }}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <div className="flex-1 p-5 flex flex-col gap-0">
        <input
          type="text"
          placeholder="Titulo da anotacao..."
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          className="w-full text-2xl font-bold text-gray-800 outline-none placeholder:text-gray-300 mb-3"
        />
        <div className="h-px bg-gray-100 mb-3" />

        {/* Tags input */}
        <div className="flex flex-wrap gap-1.5 mb-3 min-h-[28px]">
          {tags.map(t => (
            <span key={t} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
              #{t}
              <button onClick={() => setTags(prev => prev.filter(x => x !== t))}>
                <X size={10} />
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder={tags.length === 0 ? 'Adicionar tag (Enter)...' : '+ tag'}
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleTagKey}
            onBlur={() => { if (tagInput.trim()) addTag(tagInput) }}
            className="text-xs text-gray-600 outline-none placeholder:text-gray-300 min-w-[120px] flex-1"
          />
        </div>
        <div className="h-px bg-gray-100 mb-4" />

        <textarea
          placeholder="Escreva sua anotacao aqui..."
          value={conteudo}
          onChange={e => setConteudo(e.target.value)}
          className="flex-1 w-full text-base text-gray-700 outline-none resize-none leading-relaxed placeholder:text-gray-300 min-h-[60vh]"
          autoFocus={!conteudo}
        />
      </div>
    </div>
  )
}
