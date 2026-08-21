'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Clock, BookOpen, Play, RotateCcw, ChevronRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { plano as buscarPlano, cronograma, totalCapitulos, diaAtual } from '@/data/planosLeitura'

export default function PlanoDetalhePage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const p = buscarPlano(params.id)

  const [iniciadoEm, setIniciadoEm] = useState<string | null>(null)
  const [concluidos, setConcluidos] = useState<Set<number>>(new Set())
  const [salvando, setSalvando] = useState(false)
  const [mostrarTodos, setMostrarTodos] = useState(false)

  const dias = useMemo(() => (p ? cronograma(p) : []), [p])

  const carregar = useCallback(async () => {
    if (!user || !p) return
    const [{ data: pa }, { data: pp }] = await Promise.all([
      supabase.from('plano_ativo').select('plano_id, iniciado_em').eq('user_id', user.id).maybeSingle(),
      supabase.from('planos_progresso').select('dia').eq('user_id', user.id).eq('plano_id', p.id),
    ])
    setIniciadoEm(pa?.plano_id === p.id ? pa.iniciado_em : null)
    setConcluidos(new Set((pp ?? []).map((x: any) => x.dia as number)))
  }, [user, p])

  useEffect(() => { carregar() }, [carregar])

  if (!p) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full gap-3 px-8 py-20">
        <p className="text-conteudo-muted">Plano não encontrado.</p>
        <Link href="/planos" className="text-sm font-bold text-primary">Ver todos os planos</Link>
      </div>
    )
  }

  const comecar = async () => {
    if (!user || salvando) return
    setSalvando(true)
    const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
    await supabase.from('plano_ativo').upsert(
      { user_id: user.id, plano_id: p.id, iniciado_em: hoje },
      { onConflict: 'user_id' }
    )
    setIniciadoEm(hoje)
    setSalvando(false)
  }

  const recomecar = async () => {
    if (!user || !confirm('Recomeçar do dia 1? Seu progresso neste plano será apagado.')) return
    await supabase.from('planos_progresso').delete().eq('user_id', user.id).eq('plano_id', p.id)
    setConcluidos(new Set())
    await comecar()
  }

  const alternarDia = async (dia: number) => {
    if (!user) return
    const jaFeito = concluidos.has(dia)

    setConcluidos(prev => {
      const s = new Set(prev)
      jaFeito ? s.delete(dia) : s.add(dia)
      return s
    })

    if (jaFeito) {
      await supabase.from('planos_progresso').delete()
        .eq('user_id', user.id).eq('plano_id', p.id).eq('dia', dia)
    } else {
      await supabase.from('planos_progresso').insert({ user_id: user.id, plano_id: p.id, dia })
    }
  }

  const hoje = iniciadoEm ? diaAtual(iniciadoEm, p.dias) : 1
  const pct = Math.round((concluidos.size / p.dias) * 100)
  const leituraDeHoje = dias[hoje - 1]
  const visiveis = mostrarTodos ? dias : dias.slice(0, Math.min(dias.length, Math.max(14, hoje + 6)))

  return (
    <div className="flex flex-col min-h-full bg-bg pb-24">
      {/* Capa */}
      <div className="relative">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/fundos/${p.fundo}.jpg)` }} aria-hidden="true" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,.40), rgba(0,0,0,.85))' }}
          aria-hidden="true" />

        <div className="relative px-5 pt-5 pb-6">
          <button onClick={() => router.push('/planos')} aria-label="Voltar"
            className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: 'rgba(0,0,0,.35)' }}>
            <ArrowLeft size={19} color="#fff" />
          </button>

          <h1 className="text-2xl font-extrabold text-white leading-tight mb-1">{p.titulo}</h1>
          <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,.75)' }}>{p.subtitulo}</p>

          <div className="flex items-center gap-4 text-[12px]" style={{ color: 'rgba(255,255,255,.7)' }}>
            <span className="flex items-center gap-1"><BookOpen size={12} /> {totalCapitulos(p)} capítulos</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {p.minutos} min por dia</span>
            <span>{p.dias} dias</span>
          </div>

          {iniciadoEm && (
            <div className="mt-4">
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,.22)' }}>
                <div className="h-1.5 rounded-full bg-white" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[11px] mt-1.5" style={{ color: 'rgba(255,255,255,.65)' }}>
                {concluidos.size} de {p.dias} dias · {pct}%
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-5 flex flex-col gap-4">
        <p className="text-[15px] text-conteudo-muted leading-relaxed">{p.descricao}</p>

        {!iniciadoEm ? (
          <button onClick={comecar} disabled={salvando} className="btn-primario">
            <Play size={17} fill="currentColor" /> Começar este plano
          </button>
        ) : (
          <>
            {/* Leitura de hoje */}
            {leituraDeHoje && (
              <section className="cartao p-5" style={{ borderLeft: '3px solid var(--accent)' }}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                  Sua leitura de hoje · dia {hoje}
                </p>
                <p className="text-lg font-extrabold text-conteudo mb-3">{leituraDeHoje.rotulo}</p>

                <div className="flex flex-col gap-2">
                  {leituraDeHoje.trechos.map(t => (
                    <Link key={`${t.livroId}-${t.capitulo}`}
                      href={`/biblia/${t.livroEn}/${t.capitulo}?plano=1`}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-surface-2">
                      <BookOpen size={16} className="text-primary flex-shrink-0" />
                      <span className="flex-1 text-sm font-semibold text-conteudo">
                        {t.livroPt} {t.capitulo}
                      </span>
                      <ChevronRight size={15} className="text-conteudo-faint" />
                    </Link>
                  ))}
                </div>

                <button onClick={() => alternarDia(hoje)}
                  className="btn-primario mt-4 py-2.5 text-sm"
                  style={concluidos.has(hoje) ? { backgroundColor: 'var(--success)' } : undefined}>
                  {concluidos.has(hoje) ? <><Check size={16} /> Leitura de hoje concluída</> : 'Marcar como lida'}
                </button>
              </section>
            )}

            <button onClick={recomecar} className="btn-secundario">
              <RotateCcw size={15} /> Recomeçar do dia 1
            </button>
          </>
        )}

        {/* Cronograma */}
        <section>
          <h2 className="text-base font-extrabold text-conteudo mb-3">Cronograma</h2>
          <div className="flex flex-col gap-1.5">
            {visiveis.map(d => {
              const feito = concluidos.has(d.dia)
              const ehHoje = iniciadoEm && d.dia === hoje
              return (
                <button key={d.dia} onClick={() => alternarDia(d.dia)}
                  className="flex items-center gap-3 p-3 rounded-2xl text-left transition-colors"
                  style={{
                    backgroundColor: ehHoje ? 'var(--accent-soft)' : 'var(--surface)',
                    border: ehHoje ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                  }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                    style={{
                      backgroundColor: feito ? 'var(--success)' : 'var(--surface-2)',
                      color: feito ? '#fff' : 'var(--text-faint)',
                    }}>
                    {feito ? <Check size={12} strokeWidth={3} /> : d.dia}
                  </span>
                  <span className="flex-1 text-sm text-conteudo truncate"
                    style={feito ? { color: 'var(--text-faint)' } : undefined}>
                    {d.rotulo}
                  </span>
                  {ehHoje && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-fg)' }}>
                      hoje
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {!mostrarTodos && dias.length > visiveis.length && (
            <button onClick={() => setMostrarTodos(true)} className="btn-secundario w-full mt-3">
              Ver os {dias.length} dias
            </button>
          )}
        </section>
      </div>
    </div>
  )
}
