'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Trash2, Share2, Download, BookOpen, Users, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Pregacao } from '@/types'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { LeitorAudio } from '@/components/LeitorAudio'
import type { BlocoLeitura } from '@/hooks/useLeitor'

function InfoSection({ label, value, destacado }: { label: string; value?: string; destacado?: boolean }) {
  if (!value?.trim()) return null
  return (
    <div className="bg-surface rounded-2xl p-4 shadow-cartao"
      style={destacado ? { backgroundColor: 'var(--gold-soft)', boxShadow: 'inset 3px 0 0 #4F46E5' } : undefined}>
      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{label}</p>
      <p className="text-sm text-conteudo leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  )
}

export default function PregacaoDetalhePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [pregacao, setPregacao] = useState<Pregacao | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'esboco' | 'completa'>('esboco')
  const [lendoBloco, setLendoBloco] = useState<string | null>(null)

  // Ouvir a pregação inteira ajuda a ensaiar e a cronometrar antes de pregar.
  const blocos: BlocoLeitura[] = useMemo(() => {
    if (!pregacao) return []

    if (tab === 'completa') {
      return pregacao.pregacao_completa
        .split(/\n{2,}/)
        .map(p => p.trim())
        .filter(Boolean)
        .map((texto, i) => ({ id: `c-${i}`, texto }))
    }

    let listaPontos: string[] = []
    try { listaPontos = JSON.parse(pregacao.pontos_principais) } catch {}

    const secoes: [string, string | undefined][] = [
      ['Objetivo', pregacao.objetivo],
      ['Problema', pregacao.problema],
      ['Mensagem central', pregacao.mensagem_central],
    ]
    const lista: BlocoLeitura[] = [{ id: 'tema', texto: `${pregacao.tema}. Texto base: ${pregacao.texto_base}.` }]

    secoes.forEach(([rotulo, valor]) => {
      if (valor?.trim()) lista.push({ id: rotulo, texto: valor, prefixo: rotulo })
    })
    listaPontos.forEach((p, i) => {
      if (p?.trim()) lista.push({ id: `ponto-${i}`, texto: p, prefixo: `Ponto ${i + 1}` })
    })
    const finais: [string, string | undefined][] = [
      ['Ilustração', pregacao.ilustracao],
      ['Aplicação prática', pregacao.aplicacao_pratica],
      ['Conclusão', pregacao.conclusao],
      ['Apelo final', pregacao.apelo_final],
    ]
    finais.forEach(([rotulo, valor]) => {
      if (valor?.trim()) lista.push({ id: rotulo, texto: valor, prefixo: rotulo })
    })

    return lista
  }, [pregacao, tab])

  useEffect(() => {
    supabase.from('pregacoes').select('*').eq('id', params.id).single()
      .then(({ data }) => { setPregacao(data); setLoading(false) })
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta pregacao?')) return
    await supabase.from('pregacoes').delete().eq('id', params.id)
    router.push('/pregacoes')
  }

  const handleShare = async () => {
    if (!pregacao) return
    if (navigator.share) {
      await navigator.share({ title: pregacao.tema, text: pregacao.pregacao_completa })
    } else {
      await navigator.clipboard.writeText(pregacao.pregacao_completa)
      alert('Pregacao copiada para a area de transferencia!')
    }
  }

  const handleDownload = () => {
    if (!pregacao) return
    const blob = new Blob([pregacao.pregacao_completa], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${pregacao.tema.replace(/[^a-zA-Z0-9 ]/g, '').trim()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) return <LoadingSpinner fullScreen={false} />
  if (!pregacao) return <div className="p-6 text-conteudo-muted">Pregacao nao encontrada.</div>

  let pontos: string[] = []
  try { pontos = JSON.parse(pregacao.pontos_principais) } catch {}

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-4 text-white" style={{ backgroundColor: 'var(--accent-hover)' }}>
        <button onClick={() => router.back()} className="p-2 rounded-2xl hover:bg-white/10">
          <ArrowLeft size={22} />
        </button>
        <p className="flex-1 text-center font-bold text-sm truncate">{pregacao.tema}</p>
        <div className="flex items-center">
          <button onClick={handleDownload} className="p-2 rounded-2xl hover:bg-white/10" title="Baixar .txt">
            <Download size={18} />
          </button>
          <button onClick={handleShare} className="p-2 rounded-2xl hover:bg-white/10">
            <Share2 size={18} />
          </button>
          <Link href={`/pregacoes/nova?id=${pregacao.id}`} className="p-2 rounded-2xl hover:bg-white/10">
            <Pencil size={18} />
          </Link>
          <button onClick={handleDelete} className="p-2 rounded-2xl hover:bg-white/10">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-surface">
        {(['esboco', 'completa'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-3 text-sm font-semibold transition-colors"
            style={{
              color: tab === t ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: tab === t ? '3px solid #4F46E5' : '3px solid transparent',
            }}>
            {t === 'esboco' ? 'Esboco' : 'Pregacao Completa'}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 flex flex-col gap-3 pb-32">
        {tab === 'esboco' ? (
          <>
            <div className="bg-surface rounded-2xl p-4 shadow-cartao flex flex-col gap-2">
              {[
                { Icon: BookOpen, text: pregacao.texto_base },
                { Icon: Users, text: pregacao.publico },
                { Icon: Calendar, text: new Date(pregacao.created_at).toLocaleDateString('pt-BR') },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon size={16} color="var(--accent)" />
                  <span className="text-sm text-conteudo font-medium">{text}</span>
                </div>
              ))}
            </div>

            <InfoSection label="Objetivo" value={pregacao.objetivo} destacado={lendoBloco === 'Objetivo'} />
            <InfoSection label="Problema / Necessidade" value={pregacao.problema} destacado={lendoBloco === 'Problema'} />
            <InfoSection label="Mensagem Central" value={pregacao.mensagem_central} destacado={lendoBloco === 'Mensagem central'} />

            {pontos.length > 0 && (
              <div className="bg-surface rounded-2xl p-4 shadow-cartao">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">3 Pontos Principais</p>
                <div className="flex flex-col gap-3">
                  {pontos.map((p, i) => p.trim() && (
                    <div key={i} className="flex items-start gap-3 rounded-2xl px-1 py-0.5"
                      style={lendoBloco === `ponto-${i}` ? { backgroundColor: 'var(--gold-soft)' } : undefined}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: 'var(--accent-soft)' }}>
                        <span className="text-xs font-bold text-primary">{i + 1}</span>
                      </div>
                      <p className="text-sm text-conteudo leading-relaxed flex-1">{p}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <InfoSection label="Ilustracao / Exemplo" value={pregacao.ilustracao} destacado={lendoBloco === 'Ilustração'} />
            <InfoSection label="Aplicacao Pratica" value={pregacao.aplicacao_pratica} destacado={lendoBloco === 'Aplicação prática'} />
            <InfoSection label="Conclusao" value={pregacao.conclusao} destacado={lendoBloco === 'Conclusão'} />
            <InfoSection label="Apelo Final" value={pregacao.apelo_final} destacado={lendoBloco === 'Apelo final'} />
          </>
        ) : (
          <>
            <div className="bg-surface rounded-2xl p-5 shadow-cartao flex flex-col gap-3">
              {pregacao.pregacao_completa.split(/\n{2,}/).map(p => p.trim()).filter(Boolean).map((p, i) => (
                <p key={i}
                  className="text-sm text-conteudo leading-relaxed whitespace-pre-wrap rounded-2xl px-1 py-0.5"
                  style={lendoBloco === `c-${i}` ? { backgroundColor: 'var(--gold-soft)' } : undefined}>
                  {p}
                </p>
              ))}
            </div>
            <button onClick={handleDownload}
              className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--accent)' }}>
              <Download size={18} /> Baixar como .txt
            </button>
          </>
        )}
      </div>

      <LeitorAudio blocos={blocos} titulo={pregacao.tema} onBlocoAtual={setLendoBloco} />
    </div>
  )
}
