'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Trash2, BookOpen, Share2, CheckCircle2, Circle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { EstudoBiblico } from '@/types'
import { LoadingSpinner } from '@/components/LoadingSpinner'

function Section({ title, content, icon }: { title: string; content?: string; icon: string }) {
  if (!content?.trim()) return null
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <p className="text-xs font-bold text-primary uppercase tracking-wider">{title}</p>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
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
  if (!estudo) return <div className="p-6 text-gray-500">Estudo nao encontrado.</div>

  const filledSections = SECTIONS.filter(s => estudo[s.key]?.trim())
  const completeness = filledSections.length

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex items-center gap-2 px-4 py-4 text-white" style={{ backgroundColor: '#3730A3' }}>
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-white/10">
          <ArrowLeft size={22} />
        </button>
        <p className="flex-1 text-center font-bold truncate">{estudo.livro} {estudo.capitulo}:{estudo.versiculo}</p>
        <button onClick={handleShare} className="p-2 rounded-xl hover:bg-white/10">
          <Share2 size={18} />
        </button>
        <Link href={`/estudos/novo?id=${estudo.id}`} className="p-2 rounded-xl hover:bg-white/10">
          <Pencil size={18} />
        </Link>
        <button onClick={handleDelete} className="p-2 rounded-xl hover:bg-white/10">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex-1 p-5 flex flex-col gap-3 pb-10">
        {/* Reference card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EEF2FF' }}>
            <BookOpen size={22} color="#4F46E5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800">{estudo.livro} {estudo.capitulo}:{estudo.versiculo}</p>
            <p className="text-xs text-gray-400">Criado em {new Date(estudo.created_at).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        {/* Verse */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: '#3730A3' }}>
          <p className="text-white italic text-sm leading-relaxed text-center">"{estudo.texto_biblico}"</p>
        </div>

        {/* Completeness */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Completude do Estudo</p>
            <span className="text-xs font-bold" style={{ color: completeness === 4 ? '#059669' : '#4F46E5' }}>
              {completeness}/4 secoes
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completeness / 4) * 100}%`, backgroundColor: completeness === 4 ? '#059669' : '#4F46E5' }} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SECTIONS.map(s => {
              const filled = !!estudo[s.key]?.trim()
              return (
                <div key={s.key} className="flex items-center gap-1.5">
                  {filled
                    ? <CheckCircle2 size={14} color="#059669" />
                    : <Circle size={14} color="#D1D5DB" />}
                  <span className="text-xs" style={{ color: filled ? '#059669' : '#9CA3AF' }}>{s.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <Section title="Contexto Historico" icon="📜" content={estudo.contexto_historico} />
        <Section title="Interpretacao" icon="🔍" content={estudo.interpretacao} />
        <Section title="Aplicacao Pratica" icon="🙏" content={estudo.aplicacao} />
        <Section title="Insights e Revelacoes" icon="💡" content={estudo.insights} />

        {completeness < 4 && (
          <Link href={`/estudos/novo?id=${estudo.id}`}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-sm text-center block"
            style={{ backgroundColor: '#4F46E5' }}>
            ✏️ Completar Estudo
          </Link>
        )}
      </div>
    </div>
  )
}
