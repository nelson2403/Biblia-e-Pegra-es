'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Trash2, BookOpen, Share2, CheckCircle2, Circle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { EstudoBiblico } from '@/types'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { LeitorAudio } from '@/components/LeitorAudio'
import type { BlocoLeitura } from '@/hooks/useLeitor'

function Section({ title, content, icon, destacado }: { title: string; content?: string; icon: string; destacado?: boolean }) {
  if (!content?.trim()) return null
  return (
    <div className="bg-surface rounded-2xl p-4 shadow-cartao"
      style={destacado ? { backgroundColor: 'var(--gold-soft)', boxShadow: 'inset 3px 0 0 #4F46E5' } : undefined}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <p className="text-xs font-bold text-primary uppercase tracking-wider">{title}</p>
      </div>
      <p className="text-sm text-conteudo leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  )
}

const SECTIONS = [
  { key: 'contexto_historico', label: 'Contexto Historico' },
  { key: 'interpretacao', label: 'Interpretacao' },
  { key: 'aplicacao', label: 'Aplicacao' },
  { key: 'insights', label: 'Insights' },
] as const

export default function EstudoDetalhePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [estudo, setEstudo] = useState<EstudoBiblico | null>(null)
  const [loading, setLoading] = useState(true)
  const [lendoBloco, setLendoBloco] = useState<string | null>(null)

  const blocos: BlocoLeitura[] = useMemo(() => {
    if (!estudo) return []
    const lista: BlocoLeitura[] = [
      { id: 'ref', texto: `${estudo.livro}, capítulo ${estudo.capitulo}, versículo ${estudo.versiculo}.` },
      { id: 'texto', texto: estudo.texto_biblico, prefixo: 'Texto bíblico' },
    ]
    SECTIONS.forEach(s => {
      const conteudo = estudo[s.key]
      if (conteudo?.trim()) lista.push({ id: s.key, texto: conteudo, prefixo: s.label })
    })
    return lista
  }, [estudo])

  useEffect(() => {
    supabase.from('estudos_biblicos').select('*').eq('id', params.id).single()
      .then(({ data }) => { setEstudo(data); setLoading(false) })
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este estudo?')) return
    await supabase.from('estudos_biblicos').delete().eq('id', params.id)
    router.push('/estudos')
  }

  const handleShare = async () => {
    if (!estudo) return
    const text = `📖 ${estudo.livro} ${estudo.capitulo}:${estudo.versiculo}\n\n"${estudo.texto_biblico}"${estudo.interpretacao ? `\n\n🔍 Interpretacao:\n${estudo.interpretacao}` : ''}${estudo.aplicacao ? `\n\n🙏 Aplicacao:\n${estudo.aplicacao}` : ''}`
    if (navigator.share) {
      navigator.share({ title: `${estudo.livro} ${estudo.capitulo}:${estudo.versiculo}`, text })
    } else {
      await navigator.clipboard.writeText(text)
      alert('Copiado para a area de transferencia!')
    }
  }

  if (loading) return <LoadingSpinner fullScreen={false} />
  if (!estudo) return <div className="p-6 text-conteudo-muted">Estudo nao encontrado.</div>

  const filledSections = SECTIONS.filter(s => estudo[s.key]?.trim())
  const completeness = filledSections.length

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex items-center gap-2 px-4 py-4 text-white" style={{ backgroundColor: 'var(--accent-hover)' }}>
        <button onClick={() => router.back()} className="p-2 rounded-2xl hover:bg-white/10">
          <ArrowLeft size={22} />
        </button>
        <p className="flex-1 text-center font-bold truncate">{estudo.livro} {estudo.capitulo}:{estudo.versiculo}</p>
        <button onClick={handleShare} className="p-2 rounded-2xl hover:bg-white/10">
          <Share2 size={18} />
        </button>
        <Link href={`/estudos/novo?id=${estudo.id}`} className="p-2 rounded-2xl hover:bg-white/10">
          <Pencil size={18} />
        </Link>
        <button onClick={handleDelete} className="p-2 rounded-2xl hover:bg-white/10">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex-1 p-5 flex flex-col gap-3 pb-32">
        {/* Reference card */}
        <div className="bg-surface rounded-2xl p-4 shadow-cartao flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-soft)' }}>
            <BookOpen size={22} color="var(--accent)" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-conteudo">{estudo.livro} {estudo.capitulo}:{estudo.versiculo}</p>
            <p className="text-xs text-conteudo-faint">Criado em {new Date(estudo.created_at).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        {/* Verse */}
        <div className="rounded-2xl p-5"
          style={{ backgroundColor: lendoBloco === 'texto' ? 'var(--accent)' : 'var(--accent-hover)' }}>
          <p className="text-white italic text-sm leading-relaxed text-center">"{estudo.texto_biblico}"</p>
        </div>

        {/* Completeness */}
        <div className="bg-surface rounded-2xl p-4 shadow-cartao">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-conteudo-muted uppercase tracking-wider">Completude do Estudo</p>
            <span className="text-xs font-bold" style={{ color: completeness === 4 ? 'var(--success)' : 'var(--accent)' }}>
              {completeness}/4 secoes
            </span>
          </div>
          <div className="h-2 bg-surface-2 rounded-full overflow-hidden mb-3">
            <div className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completeness / 4) * 100}%`, backgroundColor: completeness === 4 ? 'var(--success)' : 'var(--accent)' }} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SECTIONS.map(s => {
              const filled = !!estudo[s.key]?.trim()
              return (
                <div key={s.key} className="flex items-center gap-1.5">
                  {filled
                    ? <CheckCircle2 size={14} color="var(--success)" />
                    : <Circle size={14} color="var(--border-strong)" />}
                  <span className="text-xs" style={{ color: filled ? 'var(--success)' : 'var(--text-faint)' }}>{s.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <Section title="Contexto Historico" icon="📜" content={estudo.contexto_historico} destacado={lendoBloco === 'contexto_historico'} />
        <Section title="Interpretacao" icon="🔍" content={estudo.interpretacao} destacado={lendoBloco === 'interpretacao'} />
        <Section title="Aplicacao Pratica" icon="🙏" content={estudo.aplicacao} destacado={lendoBloco === 'aplicacao'} />
        <Section title="Insights e Revelacoes" icon="💡" content={estudo.insights} destacado={lendoBloco === 'insights'} />

        {completeness < 4 && (
          <Link href={`/estudos/novo?id=${estudo.id}`}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-sm text-center block"
            style={{ backgroundColor: 'var(--accent)' }}>
            ✏️ Completar Estudo
          </Link>
        )}
      </div>

      <LeitorAudio
        blocos={blocos}
        titulo={`${estudo.livro} ${estudo.capitulo}:${estudo.versiculo}`}
        onBlocoAtual={setLendoBloco}
      />
    </div>
  )
}
