'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { GravadorAudio } from '@/components/GravadorAudio'
import { LeitorAudio } from '@/components/LeitorAudio'
import type { BlocoLeitura } from '@/hooks/useLeitor'

export default function AnotacaoDetalhePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)
  const [lendoBloco, setLendoBloco] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('anotacoes').select('*').eq('id', params.id).single().then(({ data }) => {
      if (data) { setTitulo(data.titulo); setConteudo(data.conteudo) }
      setLoading(false)
    })
  }, [params.id])

  const handleSave = async () => {
    if (!titulo.trim() || !conteudo.trim()) { setAviso('Preencha título e conteúdo.'); return }
    setSaving(true)
    const { error } = await supabase
      .from('anotacoes')
      .update({ titulo, conteudo, updated_at: new Date().toISOString() })
      .eq('id', params.id)
    setSaving(false)
    if (error) { setAviso(`Erro ao salvar: ${error.message}`); return }
    setAviso(null)
    setEditing(false)
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta anotação?')) return
    await supabase.from('anotacoes').delete().eq('id', params.id)
    router.push('/anotacoes')
  }

  const inserirTranscricao = (texto: string) => {
    setConteudo(atual => {
      const pos = textareaRef.current?.selectionStart ?? atual.length
      const antes = atual.slice(0, pos)
      const separador = antes && !antes.endsWith('\n') && !antes.endsWith(' ') ? ' ' : ''
      return `${antes}${separador}${texto}${atual.slice(pos)}`
    })
    setAviso('Áudio transcrito. Revise antes de salvar.')
  }

  const paragrafos = useMemo(
    () => conteudo.split(/\n{2,}/).map(p => p.trim()).filter(Boolean),
    [conteudo]
  )

  // Cada parágrafo é um bloco: dá para destacar o trecho que está sendo lido.
  const blocos: BlocoLeitura[] = useMemo(
    () => [
      { id: 'titulo', texto: titulo },
      ...paragrafos.map((p, i) => ({ id: `p-${i}`, texto: p })),
    ],
    [titulo, paragrafos]
  )

  if (loading) return <LoadingSpinner fullScreen={false} />

  return (
    <div className="flex flex-col min-h-full bg-surface pb-28">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-borda">
        <button onClick={() => router.back()} aria-label="Voltar" className="p-2 rounded-xl hover:bg-surface-2">
          <ArrowLeft size={22} color="var(--text)" />
        </button>
        <h1 className="flex-1 text-center text-base font-bold text-conteudo">
          {editing ? 'Editando' : 'Anotação'}
        </h1>
        <div className="flex items-center gap-1">
          {!editing ? (
            <>
              <button onClick={() => setEditing(true)} aria-label="Editar anotação"
                className="p-2 rounded-xl hover:bg-surface-2 text-primary">
                <Pencil size={19} />
              </button>
              <button onClick={handleDelete} aria-label="Excluir anotação"
                className="p-2 rounded-xl hover:bg-perigo-soft text-perigo">
                <Trash2 size={19} />
              </button>
            </>
          ) : (
            <button onClick={handleSave} disabled={saving}
              className="px-4 py-1.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col gap-0">
        {aviso && (
          <p role="status" className="mb-3 text-xs font-semibold px-3 py-2 rounded-xl"
            style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-hover)' }}>
            {aviso}
          </p>
        )}

        {editing ? (
          <>
            <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)}
              aria-label="Título da anotação"
              className="w-full text-2xl font-bold text-conteudo outline-none mb-3" />
            <div className="h-px bg-surface-2 mb-4" />
            <div className="mb-4">
              <GravadorAudio onTranscrito={inserirTranscricao} />
            </div>
            <textarea ref={textareaRef} value={conteudo} onChange={e => setConteudo(e.target.value)}
              aria-label="Conteúdo da anotação"
              className="flex-1 w-full text-base text-conteudo outline-none resize-none leading-relaxed min-h-[50vh]" />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-conteudo mb-3 px-1 rounded-xl"
              style={lendoBloco === 'titulo' ? { backgroundColor: 'var(--gold-soft)' } : undefined}>
              {titulo}
            </h2>
            <div className="h-px bg-surface-2 mb-4" />
            <div className="flex flex-col gap-3">
              {paragrafos.map((p, i) => (
                <p key={i}
                  className="text-base text-conteudo leading-relaxed whitespace-pre-wrap px-1 py-0.5 rounded-xl"
                  style={lendoBloco === `p-${i}` ? { backgroundColor: 'var(--gold-soft)' } : undefined}>
                  {p}
                </p>
              ))}
            </div>
          </>
        )}
      </div>

      {!editing && conteudo && (
        <LeitorAudio blocos={blocos} titulo={titulo || 'Anotação'} onBlocoAtual={setLendoBloco} />
      )}
    </div>
  )
}
