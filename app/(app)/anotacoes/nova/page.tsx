'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, X, Wand2, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { GravadorAudio } from '@/components/GravadorAudio'

export default function NovaAnotacaoPage() {
  const { user, session } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [organizando, setOrganizando] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)
  const [ditado, setDitado] = useState(false)

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

  /** O texto ditado entra na posição do cursor, sem apagar o que já foi escrito. */
  const inserirTranscricao = (texto: string) => {
    setDitado(true)
    setConteudo(atual => {
      const pos = textareaRef.current?.selectionStart ?? atual.length
      const antes = atual.slice(0, pos)
      const depois = atual.slice(pos)
      const separador = antes && !antes.endsWith('\n') && !antes.endsWith(' ') ? ' ' : ''
      return `${antes}${separador}${texto}${depois}`
    })
    setAviso('Áudio transcrito. Revise o texto antes de salvar.')
  }

  const organizarComIA = async () => {
    const token = session?.access_token
    if (!token) { setAviso('Sessão expirada. Entre novamente.'); return }
    if (conteudo.trim().length < 20) { setAviso('Escreva ou dite um pouco mais primeiro.'); return }

    setOrganizando(true)
    setAviso(null)
    try {
      const res = await fetch('/api/organizar-anotacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ texto: conteudo }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Erro ao organizar.')

      setConteudo(data.conteudo)
      if (!titulo.trim() && data.titulo) setTitulo(data.titulo)
      if (data.tags?.length) {
        setTags(prev => Array.from(new Set([...prev, ...data.tags])).slice(0, 6))
      }
      setAviso('Texto organizado pela IA. Confira antes de salvar.')
    } catch (e: any) {
      setAviso(e?.message ?? 'Não foi possível organizar o texto.')
    } finally {
      setOrganizando(false)
    }
  }

  const handleSave = async () => {
    if (!titulo.trim()) { setAviso('Digite um titulo para a anotacao.'); return }
    if (!conteudo.trim()) { setAviso('Digite o conteudo da anotacao.'); return }
    setSaving(true)
    const now = new Date().toISOString()
    const { error } = await supabase.from('anotacoes').insert({
      titulo: titulo.trim(),
      conteudo: conteudo.trim(),
      tags: tags.join(',') || null,
      origem: ditado ? 'voz' : 'texto',
      user_id: user!.id,
      created_at: now,
      updated_at: now,
    })
    setSaving(false)
    if (error) {
      setAviso(`Erro ao salvar: ${error.message}`)
      return
    }
    router.push('/anotacoes')
  }

  return (
    <div className="flex flex-col min-h-full bg-surface">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-borda">
        <button onClick={() => router.back()} aria-label="Voltar" className="p-2 rounded-xl hover:bg-surface-2">
          <ArrowLeft size={22} color="var(--text)" />
        </button>
        <h1 className="flex-1 text-center text-base font-bold text-conteudo">Nova Anotacao</h1>
        <button onClick={handleSave} disabled={saving}
          className="px-4 py-1.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
          style={{ backgroundColor: 'var(--accent)' }}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <div className="flex-1 p-5 flex flex-col gap-0">
        <input
          type="text"
          placeholder="Titulo da anotacao..."
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          aria-label="Titulo da anotacao"
          className="w-full text-2xl font-bold text-conteudo outline-none placeholder:text-conteudo-faint mb-3"
        />
        <div className="h-px bg-surface-2 mb-3" />

        {/* Tags input */}
        <div className="flex flex-wrap gap-1.5 mb-3 min-h-[28px]">
          {tags.map(t => (
            <span key={t} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
              #{t}
              <button onClick={() => setTags(prev => prev.filter(x => x !== t))} aria-label={`Remover tag ${t}`}>
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
            aria-label="Adicionar tag"
            className="text-xs text-conteudo-muted outline-none placeholder:text-conteudo-faint min-w-[120px] flex-1"
          />
        </div>
        <div className="h-px bg-surface-2 mb-4" />

        {/* Ferramentas de voz e IA */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <GravadorAudio onTranscrito={inserirTranscricao} />
          <button
            type="button"
            onClick={organizarComIA}
            disabled={organizando}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50 transition-colors"
            style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            {organizando ? <Loader2 size={17} className="animate-spin" /> : <Wand2 size={17} />}
            {organizando ? 'Organizando...' : 'Organizar com IA'}
          </button>
        </div>

        {aviso && (
          <p role="status" className="mb-3 text-xs font-semibold px-3 py-2 rounded-xl"
            style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-hover)' }}>
            {aviso}
          </p>
        )}

        <textarea
          ref={textareaRef}
          placeholder="Escreva sua anotacao aqui... ou toque em Ditar por voz."
          value={conteudo}
          onChange={e => setConteudo(e.target.value)}
          aria-label="Conteudo da anotacao"
          className="flex-1 w-full text-base text-conteudo outline-none resize-none leading-relaxed placeholder:text-conteudo-faint min-h-[45vh]"
          autoFocus={!conteudo}
        />
      </div>
    </div>
  )
}
