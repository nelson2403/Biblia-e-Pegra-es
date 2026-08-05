'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, Share2, CheckCircle2, Save } from 'lucide-react'
import { ESTUDOS_PRONTOS } from '@/data/estudosProntos'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { LeitorAudio } from '@/components/LeitorAudio'
import type { BlocoLeitura } from '@/hooks/useLeitor'

const CAT: Record<string, { bg: string; color: string }> = {
  'Salvação':       { bg: '#DCFCE7', color: '#15803D' },
  'Espírito Santo': { bg: '#EDE9FE', color: '#6D28D9' },
  'Fé':             { bg: '#FEF3C7', color: '#92400E' },
  'Amor':           { bg: '#FCE7F3', color: '#9D174D' },
  'Arrependimento': { bg: '#FEE2E2', color: '#991B1B' },
  'Oração':         { bg: '#DBEAFE', color: '#1D4ED8' },
  'Palavra':        { bg: '#FEF9C3', color: '#854D0E' },
  'Aliança':        { bg: '#F0FDF4', color: '#166534' },
  'Igreja':         { bg: '#EEF2FF', color: '#3730A3' },
  'Profecia':       { bg: '#FFF7ED', color: '#9A3412' },
}

export default function EstudoProntoPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const estudo = ESTUDOS_PRONTOS.find(e => e.id === params.id)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [lendoBloco, setLendoBloco] = useState<string | null>(null)

  const blocos: BlocoLeitura[] = useMemo(() => {
    if (!estudo) return []
    return [
      { id: 'titulo', texto: `${estudo.titulo}. ${estudo.subtitulo}. Texto base: ${estudo.textoBase}.` },
      { id: 'introducao', texto: estudo.introducao, prefixo: 'Introdução' },
      ...estudo.pontos.map((p, i) => ({
        id: `ponto-${i}`,
        texto: `${p.titulo}. ${p.versiculo} ${p.referencia}. ${p.conteudo}`,
        prefixo: `Ponto ${i + 1}`,
      })),
      { id: 'conclusao', texto: estudo.conclusao, prefixo: 'Conclusão' },
      { id: 'aplicacao', texto: estudo.aplicacao, prefixo: 'Aplicação prática' },
    ]
  }, [estudo])

  if (!estudo) return (
    <div className="p-6 flex flex-col items-center py-20 gap-3">
      <BookOpen size={48} color="#D1D5DB" />
      <p className="text-gray-400 font-semibold">Estudo não encontrado.</p>
      <button onClick={() => router.back()} className="text-sm font-bold" style={{ color: '#4F46E5' }}>Voltar</button>
    </div>
  )

  const catStyle = CAT[estudo.categoria] ?? { bg: '#EEF2FF', color: '#4F46E5' }

  const handleSave = async () => {
    if (!user || saved) return
    setSaving(true)
    const texto = estudo.pontos.map(p => p.titulo + '\n' + p.versiculo + ' (' + p.referencia + ')\n' + p.conteudo).join('\n\n')
    await supabase.from('estudos_biblicos').insert({
      user_id: user.id,
      livro: estudo.textoBase.split(' ')[0],
      capitulo: '1',
      versiculo: '1',
      texto_biblico: estudo.textoBase + ' — ' + estudo.subtitulo,
      contexto_historico: estudo.introducao,
      interpretacao: texto,
      aplicacao: estudo.aplicacao,
      insights: estudo.conclusao,
      tags: estudo.tags.join(', '),
    })
    setSaving(false)
    setSaved(true)
  }

  const handleShare = async () => {
    const text = estudo.titulo + '\n' + estudo.textoBase + '\n\n' + estudo.introducao
    if (navigator.share) await navigator.share({ title: estudo.titulo, text })
    else { await navigator.clipboard.writeText(text); alert('Copiado!') }
  }

  return (
    <div className="flex flex-col min-h-full pb-32">
      <div className="px-4 pt-4 pb-6 text-white"
        style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #4F46E5 100%)' }}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-white/10">
            <ArrowLeft size={22} />
          </button>
          <button onClick={handleShare} className="p-2 rounded-xl hover:bg-white/10">
            <Share2 size={20} />
          </button>
        </div>
        <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
          style={{ backgroundColor: catStyle.bg, color: catStyle.color }}>
          {estudo.categoria}
        </span>
        <h1 className="text-xl font-extrabold leading-snug mb-1">{estudo.titulo}</h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{estudo.subtitulo}</p>
      </div>

      <div className="px-4 flex flex-col gap-4 mt-4">
        {/* Texto base */}
        <div className="rounded-2xl p-4 flex items-start gap-3"
          style={{ backgroundColor: '#FEF9C3', border: '1px solid #FDE68A' }}>
          <BookOpen size={18} color="#92400E" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#92400E' }}>Texto Base</p>
            <p className="text-sm font-bold" style={{ color: '#78350F' }}>{estudo.textoBase}</p>
          </div>
        </div>

        {/* Tags */}
        {estudo.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {estudo.tags.map(t => (
              <span key={t} className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>#{t}</span>
            ))}
          </div>
        )}

        {/* Introdução */}
        <div className="bg-white rounded-2xl p-4 shadow-sm"
          style={lendoBloco === 'introducao' ? { backgroundColor: '#FEF9C3' } : undefined}>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Introdução</p>
          <p className="text-sm text-gray-700 leading-relaxed">{estudo.introducao}</p>
        </div>

        {/* Pontos */}
        <p className="text-sm font-bold text-gray-700 px-1">Pontos do Estudo</p>
        {estudo.pontos.map((ponto, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden"
            style={lendoBloco === `ponto-${i}` ? { backgroundColor: '#FEF9C3', boxShadow: 'inset 3px 0 0 #4F46E5' } : undefined}>
            <div className="px-4 pt-4 pb-2 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-extrabold"
                style={{ backgroundColor: '#4F46E5' }}>{i + 1}</div>
              <p className="font-bold text-gray-800 text-sm flex-1">{ponto.titulo}</p>
            </div>
            <div className="mx-4 mb-3 rounded-xl p-3" style={{ backgroundColor: '#EEF2FF' }}>
              <p className="text-xs italic text-indigo-700 leading-relaxed">"{ponto.versiculo}"</p>
              <p className="text-xs font-bold mt-1" style={{ color: '#4F46E5' }}>— {ponto.referencia}</p>
            </div>
            <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{ponto.conteudo}</p>
          </div>
        ))}

        {/* Conclusão */}
        <div className="bg-white rounded-2xl p-4 shadow-sm"
          style={lendoBloco === 'conclusao' ? { backgroundColor: '#FEF9C3' } : undefined}>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Conclusão</p>
          <p className="text-sm text-gray-700 leading-relaxed">{estudo.conclusao}</p>
        </div>

        {/* Aplicação */}
        <div className="rounded-2xl p-4"
          style={{
            backgroundColor: lendoBloco === 'aplicacao' ? '#FEF9C3' : '#F0FDF4',
            border: '1px solid #BBF7D0',
          }}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} color="#16A34A" />
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#16A34A' }}>Aplicação Prática</p>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#166534' }}>{estudo.aplicacao}</p>
        </div>

        {/* Salvar */}
        <button onClick={handleSave} disabled={saving || saved || !user}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-sm disabled:opacity-60"
          style={{ backgroundColor: saved ? '#D1FAE5' : '#4F46E5', color: saved ? '#065F46' : '#fff' }}>
          {saved
            ? <><CheckCircle2 size={18} /> Salvo nos meus estudos!</>
            : saving ? 'Salvando...'
            : <><Save size={18} /> Salvar nos meus estudos</>}
        </button>

        {saved && (
          <button onClick={() => router.push('/estudos')}
            className="text-center text-sm font-bold" style={{ color: '#4F46E5' }}>
            Ver meus estudos →
          </button>
        )}
      </div>

      <LeitorAudio blocos={blocos} titulo={estudo.titulo} onBlocoAtual={setLendoBloco} />
    </div>
  )
}
