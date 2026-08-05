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
  'Salvação':       { bg: 'var(--success-soft)', color: 'var(--success)' },
  'Espírito Santo': { bg: 'var(--accent-soft)', color: 'var(--accent)' },
  'Fé':             { bg: 'var(--gold-soft)', color: 'var(--gold)' },
  'Amor':           { bg: 'var(--surface-2)', color: 'var(--text-muted)' },
  'Arrependimento': { bg: 'var(--danger-soft)', color: 'var(--danger)' },
  'Oração':         { bg: 'var(--accent-soft)', color: 'var(--accent)' },
  'Palavra':        { bg: 'var(--gold-soft)', color: 'var(--gold)' },
  'Aliança':        { bg: 'var(--success-soft)', color: 'var(--success)' },
  'Igreja':         { bg: 'var(--accent-soft)', color: 'var(--accent-hover)' },
  'Profecia':       { bg: 'var(--gold-soft)', color: 'var(--gold)' },
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
      <BookOpen size={48} color="var(--border-strong)" />
      <p className="text-conteudo-faint font-semibold">Estudo não encontrado.</p>
      <button onClick={() => router.back()} className="text-sm font-bold" style={{ color: 'var(--accent)' }}>Voltar</button>
    </div>
  )

  const catStyle = CAT[estudo.categoria] ?? { bg: 'var(--accent-soft)', color: 'var(--accent)' }

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
          style={{ backgroundColor: 'var(--gold-soft)', border: '1px solid #FDE68A' }}>
          <BookOpen size={18} color="var(--gold)" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--gold)' }}>Texto Base</p>
            <p className="text-sm font-bold" style={{ color: 'var(--gold)' }}>{estudo.textoBase}</p>
          </div>
        </div>

        {/* Tags */}
        {estudo.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {estudo.tags.map(t => (
              <span key={t} className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>#{t}</span>
            ))}
          </div>
        )}

        {/* Introdução */}
        <div className="bg-surface rounded-2xl p-4 shadow-sm"
          style={lendoBloco === 'introducao' ? { backgroundColor: 'var(--gold-soft)' } : undefined}>
          <p className="text-xs font-bold uppercase tracking-wider text-conteudo-faint mb-2">Introdução</p>
          <p className="text-sm text-conteudo leading-relaxed">{estudo.introducao}</p>
        </div>

        {/* Pontos */}
        <p className="text-sm font-bold text-conteudo px-1">Pontos do Estudo</p>
        {estudo.pontos.map((ponto, i) => (
          <div key={i} className="bg-surface rounded-2xl shadow-sm overflow-hidden"
            style={lendoBloco === `ponto-${i}` ? { backgroundColor: 'var(--gold-soft)', boxShadow: 'inset 3px 0 0 #4F46E5' } : undefined}>
            <div className="px-4 pt-4 pb-2 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-extrabold"
                style={{ backgroundColor: 'var(--accent)' }}>{i + 1}</div>
              <p className="font-bold text-conteudo text-sm flex-1">{ponto.titulo}</p>
            </div>
            <div className="mx-4 mb-3 rounded-xl p-3" style={{ backgroundColor: 'var(--accent-soft)' }}>
              <p className="text-xs italic text-primary leading-relaxed">"{ponto.versiculo}"</p>
              <p className="text-xs font-bold mt-1" style={{ color: 'var(--accent)' }}>— {ponto.referencia}</p>
            </div>
            <p className="px-4 pb-4 text-sm text-conteudo-muted leading-relaxed">{ponto.conteudo}</p>
          </div>
        ))}

        {/* Conclusão */}
        <div className="bg-surface rounded-2xl p-4 shadow-sm"
          style={lendoBloco === 'conclusao' ? { backgroundColor: 'var(--gold-soft)' } : undefined}>
          <p className="text-xs font-bold uppercase tracking-wider text-conteudo-faint mb-2">Conclusão</p>
          <p className="text-sm text-conteudo leading-relaxed">{estudo.conclusao}</p>
        </div>

        {/* Aplicação */}
        <div className="rounded-2xl p-4"
          style={{
            backgroundColor: lendoBloco === 'aplicacao' ? 'var(--gold-soft)' : 'var(--success-soft)',
            border: '1px solid #BBF7D0',
          }}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} color="var(--success)" />
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--success)' }}>Aplicação Prática</p>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--success)' }}>{estudo.aplicacao}</p>
        </div>

        {/* Salvar */}
        <button onClick={handleSave} disabled={saving || saved || !user}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-sm disabled:opacity-60"
          style={{ backgroundColor: saved ? 'var(--success-soft)' : 'var(--accent)', color: saved ? 'var(--success)' : '#fff' }}>
          {saved
            ? <><CheckCircle2 size={18} /> Salvo nos meus estudos!</>
            : saving ? 'Salvando...'
            : <><Save size={18} /> Salvar nos meus estudos</>}
        </button>

        {saved && (
          <button onClick={() => router.push('/estudos')}
            className="text-center text-sm font-bold" style={{ color: 'var(--accent)' }}>
            Ver meus estudos →
          </button>
        )}
      </div>

      <LeitorAudio blocos={blocos} titulo={estudo.titulo} onBlocoAtual={setLendoBloco} />
    </div>
  )
}
