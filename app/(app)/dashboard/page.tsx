'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  BookOpen, PenLine, Mic, Layers, Heart, Search, Flame, Sun,
  ChevronRight, Headphones, HeartHandshake, Bot, BookA, Sparkles, CalendarDays,
  // Renomeado: o ícone `Map` do lucide sombreia o Map nativo do JavaScript.
  Map as IconeMapa,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { BIBLE_BOOKS } from '@/data/bibleBooks'
import { versiculoDoDia } from '@/data/versiculosDiarios'
import { SERIES_DEVOCIONAIS } from '@/data/devocionais'
import { PLANOS, plano as buscarPlano, cronograma, diaAtual } from '@/data/planosLeitura'
import { CartaoVersiculo } from '@/components/CartaoVersiculo'
import { MuralOracao } from '@/components/MuralOracao'
import type { ConteudoDiario } from '@/types'

const TOTAL_CAPITULOS = BIBLE_BOOKS.reduce((s, b) => s + b.chapters, 0)

type Aba = 'hoje' | 'explorar' | 'comunidade'

function calcularSequencia(datas: string[]): number {
  if (!datas.length) return 0
  const unicas = Array.from(new Set(datas)).sort().reverse()
  const hoje = new Date().toISOString().split('T')[0]
  const ontem = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  if (unicas[0] !== hoje && unicas[0] !== ontem) return 0
  let seq = 1
  for (let i = 1; i < unicas.length; i++) {
    const dif = (new Date(unicas[i - 1]).getTime() - new Date(unicas[i]).getTime()) / 86400000
    if (dif === 1) seq++
    else break
  }
  return seq
}

const EXPLORAR = [
  { href: '/devocionais', rotulo: 'Devocionais', descricao: 'Jornadas de 7 dias', Icone: Sun },
  { href: '/planos', rotulo: 'Planos de leitura', descricao: '8 planos disponíveis', Icone: IconeMapa },
  { href: '/biblia', rotulo: 'Bíblia', descricao: '3 traduções, com áudio', Icone: BookOpen },
  { href: '/estudos', rotulo: 'Estudos', descricao: 'Prontos e os seus', Icone: Layers },
  { href: '/pregacoes/ia', rotulo: 'Gerar pregação', descricao: 'Com ajuda de IA', Icone: Mic },
  { href: '/conselheiro', rotulo: 'Conselheiro', descricao: 'Uma palavra para agora', Icone: Bot },
  { href: '/anotacoes/nova', rotulo: 'Anotar por voz', descricao: 'Fale, a IA transcreve', Icone: PenLine },
  { href: '/dicionario', rotulo: 'Dicionário', descricao: 'Termos bíblicos', Icone: BookA },
  { href: '/favoritos', rotulo: 'Favoritos', descricao: 'Versículos salvos', Icone: Heart },
  { href: '/busca', rotulo: 'Busca', descricao: 'Em tudo que você criou', Icone: Search },
]

export default function InicioPage() {
  const { user, session } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [aba, setAba] = useState<Aba>('hoje')
  const [stats, setStats] = useState({ estudos: 0, anotacoes: 0, pregacoes: 0, favoritos: 0 })
  const [lidos, setLidos] = useState(0)
  const [sequencia, setSequencia] = useState(0)
  const [busca, setBusca] = useState('')
  const [diario, setDiario] = useState<ConteudoDiario | null>(null)
  const [planoAtivo, setPlanoAtivo] = useState<{ plano_id: string; iniciado_em: string } | null>(null)
  const [devocionalEmCurso, setDevocionalEmCurso] = useState<{ id: string; feitos: number } | null>(null)

  const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
  const reserva = versiculoDoDia(hoje)
  const versiculo = diario
    ? { texto: diario.versiculo_texto, ref: diario.versiculo_ref }
    : { texto: reserva.texto, ref: reserva.ref }

  const nome = (user?.user_metadata?.name || user?.email?.split('@')[0] || 'Servo').split(' ')[0]

  const saudacao = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Bom dia'
    if (h < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  useEffect(() => {
    const t = searchParams.get('aba')
    if (t === 'explorar' || t === 'comunidade') setAba(t)
  }, [searchParams])

  const carregar = useCallback(async () => {
    if (!user) return
    const [e, a, p, f, hist, pa, dev] = await Promise.all([
      supabase.from('estudos_biblicos').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('anotacoes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('pregacoes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('favoritos').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('historico_leitura').select('lido_em').eq('user_id', user.id),
      supabase.from('plano_ativo').select('plano_id, iniciado_em').eq('user_id', user.id).maybeSingle(),
      supabase.from('devocionais_progresso').select('serie_id').eq('user_id', user.id).eq('concluido', true),
    ])

    setStats({ estudos: e.count ?? 0, anotacoes: a.count ?? 0, pregacoes: p.count ?? 0, favoritos: f.count ?? 0 })
    const datas = (hist.data ?? []).map((h: any) => h.lido_em)
    setLidos(datas.length)
    setSequencia(calcularSequencia(datas))
    setPlanoAtivo(pa.data ?? null)

    // Série devocional com mais dias lidos = a que a pessoa está seguindo.
    const contagem = new Map<string, number>()
    for (const d of dev.data ?? []) {
      contagem.set(d.serie_id, (contagem.get(d.serie_id) ?? 0) + 1)
    }
    let melhor: { id: string; feitos: number } | null = null
    contagem.forEach((feitos, id) => {
      if (feitos < 7 && (!melhor || feitos > melhor.feitos)) melhor = { id, feitos }
    })
    setDevocionalEmCurso(melhor)
  }, [user])

  useEffect(() => { carregar() }, [carregar])

  useEffect(() => {
    const token = session?.access_token
    if (!token) return
    let cancelado = false
    fetch('/api/conteudo-diario', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (!cancelado && d?.conteudo) setDiario(d.conteudo) })
      .catch(() => {})
    return () => { cancelado = true }
  }, [session])

  const pesquisar = (e: React.FormEvent) => {
    e.preventDefault()
    if (busca.trim()) router.push(`/busca?q=${encodeURIComponent(busca)}`)
  }

  const pctLido = Math.round((lidos / TOTAL_CAPITULOS) * 100)
  const pl = planoAtivo ? buscarPlano(planoAtivo.plano_id) : undefined
  const leituraHoje = pl && planoAtivo ? cronograma(pl)[diaAtual(planoAtivo.iniciado_em, pl.dias) - 1] : undefined
  const serieEmCurso = devocionalEmCurso
    ? SERIES_DEVOCIONAIS.find(s => s.id === devocionalEmCurso.id)
    : undefined

  return (
    <div className="flex flex-col min-h-full bg-bg">
      {/* Cabeçalho fixo com abas */}
      <header className="sticky top-0 z-30 bg-bg border-b border-borda">
        <div className="px-5 pt-5 pb-1 flex items-start justify-between">
          <div>
            <p className="text-sm text-conteudo-muted">{saudacao()},</p>
            <h1 className="text-2xl font-extrabold text-conteudo leading-tight">{nome}</h1>
          </div>
          <div className="flex items-center gap-2">
            {sequencia > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-2">
                <Flame size={14} className="text-gold" />
                <span className="text-xs font-bold text-conteudo tabular-nums">{sequencia}</span>
              </div>
            )}
            <Link href="/perfil" aria-label="Abrir perfil"
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-surface-2 text-conteudo">
              {nome.slice(0, 2).toUpperCase()}
            </Link>
          </div>
        </div>

        <nav className="flex gap-1 px-4" aria-label="Seções">
          {([
            ['hoje', 'Hoje'],
            ['explorar', 'Explorar'],
            ['comunidade', 'Comunidade'],
          ] as [Aba, string][]).map(([id, rotulo]) => {
            const ativa = aba === id
            return (
              <button key={id} onClick={() => setAba(id)} aria-current={ativa ? 'page' : undefined}
                className="relative px-3 py-3 text-[15px] font-bold transition-colors"
                style={{ color: ativa ? 'var(--text)' : 'var(--text-faint)' }}>
                {rotulo}
                {ativa && (
                  <span className="absolute left-3 right-3 bottom-0 h-[3px] rounded-full"
                    style={{ backgroundColor: 'var(--accent)' }} />
                )}
              </button>
            )
          })}
        </nav>
      </header>

      {/* ── HOJE ─────────────────────────────────────── */}
      {aba === 'hoje' && (
        <div className="px-5 py-5 flex flex-col gap-7 pb-24">
          <CartaoVersiculo
            texto={versiculo.texto}
            referencia={versiculo.ref}
            href="/diario"
            data={hoje}
            limite={150}
          />

          {/* Continuar de onde parou */}
          {(leituraHoje || serieEmCurso || diario) && (
            <section>
              <h2 className="text-base font-extrabold text-conteudo mb-3">Continuar</h2>
              <div className="flex flex-col gap-2.5">
                {leituraHoje && pl && (
                  <Link href={`/planos/${pl.id}`} className="cartao flex items-center gap-3.5 p-4">
                    <div className="w-11 h-11 rounded-2xl bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(/fundos/${pl.fundo}.jpg)` }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-conteudo-faint">
                        {pl.titulo}
                      </p>
                      <p className="text-[15px] font-bold text-conteudo truncate">{leituraHoje.rotulo}</p>
                    </div>
                    <ChevronRight size={17} className="text-conteudo-faint" />
                  </Link>
                )}

                {serieEmCurso && devocionalEmCurso && (
                  <Link href={`/devocionais/${serieEmCurso.id}`} className="cartao flex items-center gap-3.5 p-4">
                    <div className="w-11 h-11 rounded-2xl bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(/fundos/${serieEmCurso.fundo}.jpg)` }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-conteudo-faint">
                        Devocional · dia {devocionalEmCurso.feitos + 1}
                      </p>
                      <p className="text-[15px] font-bold text-conteudo truncate">{serieEmCurso.titulo}</p>
                    </div>
                    <ChevronRight size={17} className="text-conteudo-faint" />
                  </Link>
                )}

                {diario && (
                  <Link href="/diario?estudo=1" className="cartao flex items-center gap-3.5 p-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'var(--accent-soft)' }}>
                      <Sparkles size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-conteudo-faint">
                        Estudo do dia
                      </p>
                      <p className="text-[15px] font-bold text-conteudo truncate">{diario.estudo_titulo}</p>
                      <p className="text-[11px] text-conteudo-muted flex items-center gap-1">
                        <Headphones size={10} /> pode ouvir
                      </p>
                    </div>
                    <ChevronRight size={17} className="text-conteudo-faint" />
                  </Link>
                )}
              </div>
            </section>
          )}

          {/* Sem plano ativo: convida a escolher */}
          {!planoAtivo && (
            <Link href="/planos" className="cartao p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--accent-soft)' }}>
                <CalendarDays size={22} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-conteudo">Escolha um plano de leitura</p>
                <p className="text-xs text-conteudo-muted leading-snug">
                  De 21 dias a 1 ano. O app te diz o que ler cada dia.
                </p>
              </div>
              <ChevronRight size={17} className="text-conteudo-faint" />
            </Link>
          )}

          {/* Progresso */}
          <section className="cartao p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-conteudo">Leitura da Bíblia</p>
                <p className="text-xs text-conteudo-muted tabular-nums">
                  {lidos} de {TOTAL_CAPITULOS} capítulos
                </p>
              </div>
              <Link href="/plano" className="text-xs font-bold text-primary">Detalhes</Link>
            </div>
            <div className="h-2 rounded-full overflow-hidden bg-surface-3">
              <div className="h-2 rounded-full transition-all"
                style={{ width: `${pctLido}%`, backgroundColor: 'var(--accent)' }} />
            </div>
            <p className="text-xs text-conteudo-faint mt-1.5 text-right tabular-nums">{pctLido}%</p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-conteudo mb-3">Meu ministério</h2>
            <div className="grid grid-cols-4 gap-2">
              {[
                { valor: stats.estudos, rotulo: 'Estudos', Icone: Layers, href: '/estudos' },
                { valor: stats.anotacoes, rotulo: 'Anotações', Icone: PenLine, href: '/anotacoes' },
                { valor: stats.pregacoes, rotulo: 'Pregações', Icone: Mic, href: '/pregacoes' },
                { valor: stats.favoritos, rotulo: 'Favoritos', Icone: Heart, href: '/favoritos' },
              ].map(({ valor, rotulo, Icone, href }) => (
                <Link key={rotulo} href={href} className="cartao flex flex-col items-center py-3.5 px-1">
                  <Icone size={17} className="text-conteudo-muted mb-1.5" />
                  <span className="text-xl font-extrabold text-conteudo tabular-nums">{valor}</span>
                  <span className="text-[10px] text-conteudo-muted font-medium mt-0.5 text-center leading-tight">
                    {rotulo}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── EXPLORAR ─────────────────────────────────── */}
      {aba === 'explorar' && (
        <div className="px-5 py-5 flex flex-col gap-5 pb-24">
          <form onSubmit={pesquisar} className="flex items-center gap-2 rounded-2xl px-4 py-3 bg-surface-2">
            <Search size={17} className="text-conteudo-faint" />
            <input type="text" placeholder="Buscar em estudos, anotações..." value={busca}
              onChange={e => setBusca(e.target.value)} aria-label="Buscar"
              className="flex-1 text-sm bg-transparent outline-none text-conteudo placeholder:text-conteudo-faint" />
          </form>

          {/* Devocionais em destaque */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-extrabold text-conteudo">Devocionais</h2>
              <Link href="/devocionais" className="text-xs font-bold text-primary">Ver todos</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
              {SERIES_DEVOCIONAIS.map(s => (
                <Link key={s.id} href={`/devocionais/${s.id}`}
                  className="relative w-44 flex-shrink-0 h-56 rounded-card overflow-hidden shadow-cartao">
                  <div className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(/fundos/${s.fundo}.jpg)` }} aria-hidden="true" />
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,.15), rgba(0,0,0,.85))' }}
                    aria-hidden="true" />
                  <div className="absolute inset-x-0 bottom-0 p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1"
                      style={{ color: 'rgba(255,255,255,.65)' }}>
                      {s.dias.length} dias
                    </p>
                    <p className="text-sm font-extrabold text-white leading-tight">{s.titulo}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Planos em destaque */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-extrabold text-conteudo">Planos de leitura</h2>
              <Link href="/planos" className="text-xs font-bold text-primary">Ver todos</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
              {PLANOS.slice(0, 5).map(p => (
                <Link key={p.id} href={`/planos/${p.id}`}
                  className="relative w-40 flex-shrink-0 h-32 rounded-card overflow-hidden shadow-cartao">
                  <div className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(/fundos/${p.fundo}.jpg)` }} aria-hidden="true" />
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,.2), rgba(0,0,0,.82))' }}
                    aria-hidden="true" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-sm font-extrabold text-white leading-tight">{p.titulo}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,.65)' }}>
                      {p.dias} dias · {p.minutos} min
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Tudo */}
          <section>
            <h2 className="text-base font-extrabold text-conteudo mb-3">Todas as ferramentas</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {EXPLORAR.map(({ href, rotulo, descricao, Icone }) => (
                <Link key={href} href={href} className="cartao p-4 flex flex-col gap-2">
                  <Icone size={20} className="text-primary" />
                  <div>
                    <p className="text-sm font-bold text-conteudo leading-tight">{rotulo}</p>
                    <p className="text-[11px] text-conteudo-muted leading-snug mt-0.5">{descricao}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── COMUNIDADE ───────────────────────────────── */}
      {aba === 'comunidade' && (
        <div className="px-5 py-5 pb-24">
          <div className="flex items-center gap-2 mb-4">
            <HeartHandshake size={19} className="text-primary" />
            <h2 className="text-base font-extrabold text-conteudo">Mural de oração</h2>
          </div>
          <MuralOracao />
        </div>
      )}
    </div>
  )
}
