'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ChevronDown, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { EstudoForm } from '@/types'
import { BIBLE_BOOKS } from '@/data/bibleBooks'

const empty: EstudoForm = {
  livro: '', capitulo: '', versiculo: '', texto_biblico: '',
  contexto_historico: '', interpretacao: '', aplicacao: '', insights: '', tags: '',
}

function Field({ label, required, error, hint, children }: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <label className="text-sm font-semibold text-conteudo">{label}{required && <span className="text-perigo"> *</span>}</label>
        {hint && <span className="text-xs text-conteudo-faint">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-perigo mt-1">{error}</p>}
    </div>
  )
}

function BookSelector({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const matches = BIBLE_BOOKS.filter(b => b.pt.toLowerCase().includes(query.toLowerCase()))
  const AT = matches.filter(b => b.testament === 'AT')
  const NT = matches.filter(b => b.testament === 'NT')

  const select = (name: string) => { onChange(name); setOpen(false); setQuery('') }

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between border rounded-xl px-4 py-2.5 text-sm bg-surface text-left"
        style={{ borderColor: error ? 'var(--danger)' : 'var(--border)' }}>
        <span style={{ color: value ? 'var(--text)' : 'var(--text-faint)' }}>{value || 'Selecione o livro...'}</span>
        {value ? (
          <button type="button" onClick={e => { e.stopPropagation(); onChange('') }}>
            <X size={14} color="var(--text-faint)" />
          </button>
        ) : <ChevronDown size={15} color="var(--text-faint)" />}
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-borda rounded-xl shadow-xl z-20 overflow-hidden">
          <div className="p-2 border-b border-borda">
            <input autoFocus type="text" placeholder="Buscar livro..." value={query} onChange={e => setQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-bg outline-none text-conteudo" />
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 260 }}>
            {AT.length > 0 && (
              <>
                <p className="px-3 py-1.5 text-xs font-bold text-conteudo-faint uppercase tracking-wider bg-bg">Antigo Testamento</p>
                {AT.map(b => (
                  <button key={b.id} type="button" onClick={() => select(b.pt)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 font-medium"
                    style={{ color: value === b.pt ? 'var(--accent)' : 'var(--text)' }}>
                    {b.pt}
                  </button>
                ))}
              </>
            )}
            {NT.length > 0 && (
              <>
                <p className="px-3 py-1.5 text-xs font-bold text-conteudo-faint uppercase tracking-wider bg-bg">Novo Testamento</p>
                {NT.map(b => (
                  <button key={b.id} type="button" onClick={() => select(b.pt)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 font-medium"
                    style={{ color: value === b.pt ? 'var(--accent)' : 'var(--text)' }}>
                    {b.pt}
                  </button>
                ))}
              </>
            )}
            {AT.length === 0 && NT.length === 0 && (
              <p className="px-4 py-6 text-sm text-conteudo-faint text-center">Nenhum livro encontrado</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function NovoEstudoPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')
  const isEdit = !!editId

  const [form, setForm] = useState<EstudoForm>(empty)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(isEdit)
  const [errors, setErrors] = useState<Partial<EstudoForm>>({})

  const selectedBook = BIBLE_BOOKS.find(b => b.pt === form.livro)
  const maxCapitulo = selectedBook?.chapters ?? 150

  useEffect(() => {
    if (!isEdit) return
    supabase.from('estudos_biblicos').select('*').eq('id', editId).single().then(({ data }) => {
      if (data) setForm({
        livro: data.livro, capitulo: data.capitulo, versiculo: data.versiculo,
        texto_biblico: data.texto_biblico, contexto_historico: data.contexto_historico ?? '',
        interpretacao: data.interpretacao ?? '', aplicacao: data.aplicacao ?? '',
        insights: data.insights ?? '', tags: data.tags ?? '',
      })
      setFetchLoading(false)
    })
  }, [editId, isEdit])

  const set = (field: keyof EstudoForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const e: Partial<EstudoForm> = {}
    if (!form.livro.trim()) e.livro = 'Obrigatorio'
    if (!form.capitulo.trim()) e.capitulo = 'Obrigatorio'
    if (!form.versiculo.trim()) e.versiculo = 'Obrigatorio'
    if (!form.texto_biblico.trim()) e.texto_biblico = 'Obrigatorio'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const payload = { ...form, user_id: user!.id, updated_at: new Date().toISOString() }
    const { error } = isEdit
      ? await supabase.from('estudos_biblicos').update(payload).eq('id', editId)
      : await supabase.from('estudos_biblicos').insert({ ...payload, created_at: new Date().toISOString() })
    setLoading(false)
    if (error) { alert('Nao foi possivel salvar o estudo.'); return }
    router.push('/estudos')
  }

  if (fetchLoading) return <div className="flex items-center justify-center py-20 text-conteudo-faint">Carregando...</div>

  const inputCls = "w-full border border-borda rounded-xl px-4 py-2.5 text-sm text-conteudo outline-none focus:ring-2 focus:border-transparent"
  const textareaCls = inputCls + " min-h-[110px] resize-none"

  const filled = [form.contexto_historico, form.interpretacao, form.aplicacao, form.insights].filter(v => v.trim()).length

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex items-center gap-3 px-4 py-4 bg-surface border-b border-borda">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-surface-2">
          <ArrowLeft size={22} color="var(--text)" />
        </button>
        <h1 className="text-lg font-bold text-conteudo flex-1 text-center">{isEdit ? 'Editar Estudo' : 'Novo Estudo'}</h1>
        <div className="w-9" />
      </div>

      {!isEdit && (
        <div className="mx-5 mt-4 rounded-xl p-3 flex items-center gap-2" style={{ backgroundColor: 'var(--accent-soft)' }}>
          <span className="text-lg">📖</span>
          <p className="text-xs text-primary font-semibold flex-1">Preencha a referencia e o texto. Os demais campos enriquecem seu estudo!</p>
        </div>
      )}

      {isEdit && (
        <div className="mx-5 mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-conteudo-muted font-semibold">Progresso do estudo</span>
            <span className="text-xs font-bold" style={{ color: filled === 4 ? 'var(--success)' : 'var(--accent)' }}>{filled}/4</span>
          </div>
          <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
            <div className="h-1.5 rounded-full transition-all"
              style={{ width: `${(filled / 4) * 100}%`, backgroundColor: filled === 4 ? 'var(--success)' : 'var(--accent)' }} />
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="flex-1 overflow-auto p-5 flex flex-col gap-5 pb-10">
        {/* Reference */}
        <div className="bg-surface rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          <p className="text-sm font-bold text-conteudo flex items-center gap-2">📍 Referencia Biblica</p>
          <Field label="Livro" required error={errors.livro}>
            <BookSelector value={form.livro} onChange={v => setForm(p => ({ ...p, livro: v, capitulo: '', versiculo: '' }))} error={errors.livro} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Capitulo" required error={errors.capitulo}>
              <input type="number" placeholder="Ex: 3" min="1" max={maxCapitulo}
                value={form.capitulo} onChange={set('capitulo')}
                className={inputCls} style={{ borderColor: errors.capitulo ? 'var(--danger)' : 'var(--border)' }} />
              {selectedBook && <p className="text-xs text-conteudo-faint mt-0.5">1 a {selectedBook.chapters}</p>}
            </Field>
            <Field label="Versiculo" required error={errors.versiculo}>
              <input type="number" placeholder="Ex: 16" min="1"
                value={form.versiculo} onChange={set('versiculo')}
                className={inputCls} style={{ borderColor: errors.versiculo ? 'var(--danger)' : 'var(--border)' }} />
            </Field>
          </div>
        </div>

        {/* Verse text */}
        <div className="bg-surface rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          <p className="text-sm font-bold text-conteudo flex items-center gap-2">✍️ Texto Biblico</p>
          <Field label="Versiculo ou Passagem" required error={errors.texto_biblico}
            hint={form.texto_biblico ? `${form.texto_biblico.length} char` : undefined}>
            <textarea placeholder="Digite o versiculo ou passagem completa..." value={form.texto_biblico}
              onChange={set('texto_biblico')} className={textareaCls}
              style={{ borderColor: errors.texto_biblico ? 'var(--danger)' : 'var(--border)' }} />
          </Field>
        </div>

        {/* Analysis */}
        <div className="bg-surface rounded-2xl p-4 shadow-sm flex flex-col gap-4">
          <p className="text-sm font-bold text-conteudo flex items-center gap-2">🔬 Analise</p>
          <Field label="Contexto Historico" hint={form.contexto_historico ? `${form.contexto_historico.length} char` : 'Opcional'}>
            <textarea placeholder="Contexto historico, cultural e geografico do texto..." value={form.contexto_historico}
              onChange={set('contexto_historico')} className={textareaCls} />
          </Field>
          <Field label="Interpretacao" hint={form.interpretacao ? `${form.interpretacao.length} char` : 'Opcional'}>
            <textarea placeholder="Como voce interpreta este texto..." value={form.interpretacao}
              onChange={set('interpretacao')} className={textareaCls} />
          </Field>
        </div>

        {/* Application */}
        <div className="bg-surface rounded-2xl p-4 shadow-sm flex flex-col gap-4">
          <p className="text-sm font-bold text-conteudo flex items-center gap-2">🙏 Aplicacao Pratica</p>
          <Field label="Como Aplicar" hint={form.aplicacao ? `${form.aplicacao.length} char` : 'Opcional'}>
            <textarea placeholder="Como aplicar esta verdade na vida cotidiana..." value={form.aplicacao}
              onChange={set('aplicacao')} className={textareaCls} />
          </Field>
          <Field label="Insights e Revelacoes" hint={form.insights ? `${form.insights.length} char` : 'Opcional'}>
            <textarea placeholder="O que Deus revelou a voce neste texto..." value={form.insights}
              onChange={set('insights')} className={textareaCls} />
          </Field>
        </div>

        {/* Tags */}
        <div className="bg-surface rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-bold text-conteudo mb-2">🏷️ Tags</p>
          <input type="text" placeholder="Ex: fe, oracao, promessa (separar por virgula)"
            value={form.tags ?? ''}
            onChange={set('tags')}
            className={inputCls} />
          <p className="text-xs text-conteudo-faint mt-1">Ajuda a encontrar e filtrar seus estudos</p>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-60"
          style={{ backgroundColor: 'var(--accent)' }}>
          {loading ? 'Salvando...' : isEdit ? 'Salvar alteracoes' : 'Salvar estudo'}
        </button>
      </form>
    </div>
  )
}
