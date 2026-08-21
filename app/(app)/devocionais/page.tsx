'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { CalendarDays, ChevronRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { SERIES_DEVOCIONAIS } from '@/data/devocionais'

export default function DevocionaisPage() {
  const { user } = useAuth()
  const [progresso, setProgresso] = useState<Record<string, number>>({})

  const carregar = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('devocionais_progresso')
      .select('serie_id, dia, concluido')
      .eq('user_id', user.id)
      .eq('concluido', true)

    const mapa: Record<string, number> = {}
    for (const linha of data ?? []) {
      mapa[linha.serie_id] = (mapa[linha.serie_id] ?? 0) + 1
    }
    setProgresso(mapa)
  }, [user])

  useEffect(() => { carregar() }, [carregar])

  return (
    <div className="flex flex-col min-h-full bg-bg pb-24">
      <header className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-extrabold text-conteudo">Devocionais</h1>
        <p className="text-sm text-conteudo-muted mt-1">
          Jornadas de sete dias sobre o que você está vivendo agora.
        </p>
      </header>

      <div className="px-5 flex flex-col gap-4">
        {SERIES_DEVOCIONAIS.map(serie => {
          const feitos = progresso[serie.id] ?? 0
          const pct = Math.round((feitos / serie.dias.length) * 100)
          const comecou = feitos > 0
          const terminou = feitos >= serie.dias.length

          return (
            <Link key={serie.id} href={`/devocionais/${serie.id}`}
              className="relative overflow-hidden rounded-xl2 shadow-cartao active:scale-[0.995] transition-transform">
              <div className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(/fundos/${serie.fundo}.jpg)` }} aria-hidden="true" />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,.32), rgba(0,0,0,.80))' }}
                aria-hidden="true" />

              <div className="relative p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays size={12} style={{ color: 'rgba(255,255,255,.7)' }} aria-hidden="true" />
                  <span className="text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: 'rgba(255,255,255,.7)' }}>
                    {serie.dias.length} dias
                  </span>
                  {terminou && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(255,255,255,.22)', color: '#fff' }}>
                      Concluído
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-extrabold text-white leading-tight mb-1">{serie.titulo}</h2>
                <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,.75)' }}>{serie.subtitulo}</p>
                <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,.6)' }}>
                  {serie.descricao}
                </p>

                {comecou && !terminou && (
                  <div className="mb-3">
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,.22)' }}>
                      <div className="h-1.5 rounded-full bg-white" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[11px] mt-1.5" style={{ color: 'rgba(255,255,255,.65)' }}>
                      {feitos} de {serie.dias.length} dias
                    </p>
                  </div>
                )}

                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold"
                  style={{ backgroundColor: '#fff', color: 'var(--deep)' }}>
                  {terminou ? 'Reler' : comecou ? 'Continuar' : 'Começar'}
                  <ChevronRight size={15} />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
