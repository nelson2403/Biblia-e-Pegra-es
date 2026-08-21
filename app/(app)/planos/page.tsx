'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Clock, BookOpen, ChevronRight, Flame } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { PLANOS, totalCapitulos, diaAtual, plano as buscarPlano } from '@/data/planosLeitura'

const CATEGORIAS = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'completo', rotulo: 'Bíblia inteira' },
  { id: 'tematico', rotulo: 'Temáticos' },
  { id: 'livro', rotulo: 'Um livro' },
] as const

export default function PlanosPage() {
  const { user } = useAuth()
  const [categoria, setCategoria] = useState<string>('todos')
  const [ativo, setAtivo] = useState<{ plano_id: string; iniciado_em: string } | null>(null)
  const [feitos, setFeitos] = useState<Record<string, number>>({})

  const carregar = useCallback(async () => {
    if (!user) return
    const [{ data: pa }, { data: pp }] = await Promise.all([
      supabase.from('plano_ativo').select('plano_id, iniciado_em').eq('user_id', user.id).maybeSingle(),
      supabase.from('planos_progresso').select('plano_id, dia').eq('user_id', user.id),
    ])

    setAtivo(pa ?? null)
    const mapa: Record<string, number> = {}
    for (const linha of pp ?? []) mapa[linha.plano_id] = (mapa[linha.plano_id] ?? 0) + 1
    setFeitos(mapa)
  }, [user])

  useEffect(() => { carregar() }, [carregar])

  const lista = categoria === 'todos' ? PLANOS : PLANOS.filter(p => p.categoria === categoria)
  const planoAtivo = ativo ? buscarPlano(ativo.plano_id) : undefined

  return (
    <div className="flex flex-col min-h-full bg-bg pb-24">
      <header className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-extrabold text-conteudo">Planos de leitura</h1>
        <p className="text-sm text-conteudo-muted mt-1">
          Escolha um ritmo e deixe o app te dizer o que ler hoje.
        </p>
      </header>

      {/* Plano em andamento */}
      {planoAtivo && ativo && (
        <div className="px-5 mb-5">
          <Link href={`/planos/${planoAtivo.id}`}
            className="relative overflow-hidden rounded-xl2 shadow-cartao block active:scale-[0.995] transition-transform">
            <div className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(/fundos/${planoAtivo.fundo}.jpg)` }} aria-hidden="true" />
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,.35), rgba(0,0,0,.82))' }}
              aria-hidden="true" />
            <div className="relative p-5">
              <div className="flex items-center gap-1.5 mb-2">
                <Flame size={12} color="#F0B64D" aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#F0B64D' }}>
                  Continuando
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white leading-tight mb-1">{planoAtivo.titulo}</h2>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,.72)' }}>
                Dia {diaAtual(ativo.iniciado_em, planoAtivo.dias)} de {planoAtivo.dias} ·{' '}
                {feitos[planoAtivo.id] ?? 0} concluídos
              </p>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold"
                style={{ backgroundColor: '#fff', color: 'var(--deep)' }}>
                Ler hoje <ChevronRight size={15} />
              </span>
            </div>
          </Link>
        </div>
      )}

      <div className="px-5 flex gap-2 overflow-x-auto pb-3 -mx-1 mx-5">
        {CATEGORIAS.map(c => (
          <button key={c.id} onClick={() => setCategoria(c.id)} aria-pressed={categoria === c.id}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors"
            style={{
              backgroundColor: categoria === c.id ? 'var(--accent)' : 'var(--surface-2)',
              color: categoria === c.id ? 'var(--accent-fg)' : 'var(--text-muted)',
            }}>
            {c.rotulo}
          </button>
        ))}
      </div>

      <div className="px-5 flex flex-col gap-3">
        {lista.map(p => {
          const emAndamento = ativo?.plano_id === p.id
          const concluidos = feitos[p.id] ?? 0
          const pct = Math.round((concluidos / p.dias) * 100)

          return (
            <Link key={p.id} href={`/planos/${p.id}`}
              className="cartao p-4 flex gap-4 items-center active:scale-[0.995] transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-cover bg-center flex-shrink-0 relative overflow-hidden"
                style={{ backgroundImage: `url(/fundos/${p.fundo}.jpg)` }}>
                <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,.25)' }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-[15px] font-bold text-conteudo truncate">{p.titulo}</h2>
                  {emAndamento && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
                      ativo
                    </span>
                  )}
                </div>
                <p className="text-xs text-conteudo-muted mb-2 line-clamp-1">{p.subtitulo}</p>

                <div className="flex items-center gap-3 text-[11px] text-conteudo-faint">
                  <span className="flex items-center gap-1">
                    <BookOpen size={11} /> {totalCapitulos(p)} caps
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {p.minutos} min/dia
                  </span>
                  <span>{p.dias} dias</span>
                </div>

                {concluidos > 0 && (
                  <div className="h-1 rounded-full mt-2 overflow-hidden bg-surface-3">
                    <div className="h-1 rounded-full" style={{ width: `${pct}%`, backgroundColor: 'var(--accent)' }} />
                  </div>
                )}
              </div>

              <ChevronRight size={17} className="text-conteudo-faint flex-shrink-0" />
            </Link>
          )
        })}
      </div>

      <div className="px-5 mt-6">
        <Link href="/plano" className="btn-secundario w-full">
          Ver meu histórico de capítulos lidos
        </Link>
      </div>
    </div>
  )
}
