'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Check, ChevronLeft, ChevronRight, HandHeart, PenLine, Lock,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { serieDevocional } from '@/data/devocionais'
import { LeitorAudio } from '@/components/LeitorAudio'
import type { BlocoLeitura } from '@/hooks/useLeitor'

export default function SerieDevocionalPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const serie = serieDevocional(params.id)

  const [dia, setDia] = useState(1)
  const [concluidos, setConcluidos] = useState<Set<number>>(new Set())
  const [salvando, setSalvando] = useState(false)
  const [lendoBloco, setLendoBloco] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    if (!user || !serie) return
    const { data } = await supabase
      .from('devocionais_progresso')
      .select('dia, concluido')
      .eq('user_id', user.id)
      .eq('serie_id', serie.id)
      .eq('concluido', true)

    const feitos = new Set((data ?? []).map((d: any) => d.dia as number))
    setConcluidos(feitos)

    // Abre no primeiro dia ainda não lido.
    for (let d = 1; d <= serie.dias.length; d++) {
      if (!feitos.has(d)) { setDia(d); return }
    }
    setDia(serie.dias.length)
  }, [user, serie])

  useEffect(() => { carregar() }, [carregar])

  const conteudo = serie?.dias[dia - 1]

  const blocos: BlocoLeitura[] = useMemo(() => {
    if (!conteudo) return []
    return [
      { id: 'titulo', texto: conteudo.titulo, prefixo: `Dia ${dia}` },
      { id: 'versiculo', texto: conteudo.versiculo, prefixo: conteudo.referencia },
      { id: 'reflexao', texto: conteudo.reflexao },
      { id: 'oracao', texto: conteudo.oracao, prefixo: 'Oração' },
      { id: 'pergunta', texto: conteudo.pergunta, prefixo: 'Para pensar' },
    ]
  }, [conteudo, dia])

  if (!serie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full gap-3 px-8 py-20">
        <p className="text-conteudo-muted">Devocional não encontrado.</p>
        <Link href="/devocionais" className="text-sm font-bold text-primary">Ver todos</Link>
      </div>
    )
  }

  const concluir = async () => {
    if (!user || salvando) return
    setSalvando(true)
    await supabase.from('devocionais_progresso').upsert(
      { user_id: user.id, serie_id: serie.id, dia, concluido: true, atualizado_em: new Date().toISOString() },
      { onConflict: 'user_id,serie_id,dia' }
    )
    setConcluidos(prev => new Set(prev).add(dia))
    setSalvando(false)
    if (dia < serie.dias.length) setDia(dia + 1)
  }

  const feito = concluidos.has(dia)
  const destaque = (id: string) =>
    lendoBloco === id ? { backgroundColor: 'var(--gold-soft)', borderRadius: 12 } : undefined

  return (
    <div className="flex flex-col min-h-full bg-bg pb-32">
      {/* Capa */}
      <div className="relative">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/fundos/${serie.fundo}.jpg)` }} aria-hidden="true" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,.45), rgba(0,0,0,.82))' }}
          aria-hidden="true" />

        <div className="relative px-5 pt-5 pb-6">
          <button onClick={() => router.push('/devocionais')} aria-label="Voltar"
            className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: 'rgba(0,0,0,.35)' }}>
            <ArrowLeft size={19} color="#fff" />
          </button>

          <p className="text-[11px] font-bold uppercase tracking-wider mb-1"
            style={{ color: 'rgba(255,255,255,.65)' }}>
            {serie.titulo}
          </p>
          <h1 className="text-2xl font-extrabold text-white leading-tight">{conteudo?.titulo}</h1>

          {/* Trilha dos dias */}
          <div className="flex gap-1.5 mt-5">
            {serie.dias.map((_, i) => {
              const d = i + 1
              const ok = concluidos.has(d)
              const atual = d === dia
              return (
                <button key={d} onClick={() => setDia(d)} aria-label={`Dia ${d}`} aria-current={atual}
                  className="flex-1 h-1.5 rounded-full transition-all"
                  style={{
                    backgroundColor: atual ? '#fff' : ok ? 'rgba(255,255,255,.62)' : 'rgba(255,255,255,.22)',
                  }} />
              )
            })}
          </div>
          <p className="text-[11px] mt-2" style={{ color: 'rgba(255,255,255,.6)' }}>
            Dia {dia} de {serie.dias.length}
          </p>
        </div>
      </div>

      {conteudo && (
        <div className="px-5 py-5 flex flex-col gap-4">
          {/* Versículo */}
          <blockquote className="cartao p-5" style={destaque('versiculo')}>
            <p className="text-[17px] leading-relaxed text-conteudo mb-2"
              style={{ fontFamily: 'Georgia, serif' }}>
              &ldquo;{conteudo.versiculo}&rdquo;
            </p>
            <cite className="text-sm font-bold not-italic text-primary">{conteudo.referencia}</cite>
          </blockquote>

          <section className="cartao p-5" style={destaque('reflexao')}>
            <p className="text-[15px] text-conteudo leading-relaxed">{conteudo.reflexao}</p>
          </section>

          <section className="rounded-card p-5" style={{ backgroundColor: 'var(--accent-soft)', ...destaque('oracao') }}>
            <div className="flex items-center gap-2 mb-2">
              <HandHeart size={16} className="text-primary" aria-hidden="true" />
              <h2 className="text-sm font-extrabold text-primary">Oração</h2>
            </div>
            <p className="text-[15px] text-conteudo leading-relaxed italic">{conteudo.oracao}</p>
          </section>

          <section className="cartao p-5" style={destaque('pergunta')}>
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-conteudo-faint mb-2">
              Para pensar
            </h2>
            <p className="text-[15px] font-semibold text-conteudo leading-relaxed">{conteudo.pergunta}</p>

            <Link
              href={`/anotacoes/nova?ref=${encodeURIComponent(`${serie.titulo} — dia ${dia}`)}&texto=${encodeURIComponent(conteudo.pergunta)}`}
              className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-xl text-sm font-bold"
              style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text)' }}
            >
              <PenLine size={15} /> Responder por escrito
            </Link>
          </section>

          <button onClick={concluir} disabled={salvando}
            className="btn-primario mt-1"
            style={feito ? { backgroundColor: 'var(--success)' } : undefined}>
            {feito ? <><Check size={17} /> Dia concluído</> : 'Marcar como lido'}
          </button>

          <div className="flex items-center justify-between mt-1">
            <button onClick={() => setDia(d => Math.max(1, d - 1))} disabled={dia <= 1}
              className="flex items-center gap-1 text-sm font-bold text-conteudo-muted disabled:opacity-30">
              <ChevronLeft size={17} /> Anterior
            </button>
            <button onClick={() => setDia(d => Math.min(serie.dias.length, d + 1))}
              disabled={dia >= serie.dias.length}
              className="flex items-center gap-1 text-sm font-bold text-primary disabled:opacity-30">
              Próximo <ChevronRight size={17} />
            </button>
          </div>

          {dia === serie.dias.length && concluidos.size >= serie.dias.length && (
            <div className="cartao p-5 text-center mt-2">
              <p className="text-sm font-bold text-conteudo mb-1">Você concluiu esta jornada 🙌</p>
              <p className="text-xs text-conteudo-muted mb-3">
                Que tal começar outra ou reler daqui a alguns meses?
              </p>
              <Link href="/devocionais" className="btn-secundario inline-flex">
                Ver outros devocionais
              </Link>
            </div>
          )}
        </div>
      )}

      <LeitorAudio
        blocos={blocos}
        titulo={`${serie.titulo} — dia ${dia}`}
        onBlocoAtual={setLendoBloco}
      />
    </div>
  )
}
