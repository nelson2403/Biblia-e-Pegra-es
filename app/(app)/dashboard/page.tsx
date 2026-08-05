'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BookOpen, PenLine, Mic, Layers, Heart, Map, Search, Flame, Sun,
  ChevronRight, Headphones, HeartHandshake, Bot,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { BIBLE_BOOKS } from '@/data/bibleBooks'
import { versiculoDoDia } from '@/data/versiculosDiarios'
import { CartaoVersiculo } from '@/components/CartaoVersiculo'
import type { ConteudoDiario } from '@/types'

const TOTAL_CAPITULOS = BIBLE_BOOKS.reduce((s, b) => s + b.chapters, 0)

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

const ATALHOS = [
  { href: '/biblia', rotulo: 'Ler a Bíblia', Icone: BookOpen },
  { href: '/plano', rotulo: 'Plano de leitura', Icone: Map },
  { href: '/anotacoes/nova', rotulo: 'Anotar por voz', Icone: PenLine },
  { href: '/pregacoes/ia', rotulo: 'Pregação com IA', Icone: Mic },
  { href: '/oracao', rotulo: 'Mural de oração', Icone: HeartHandshake },
  { href: '/conselheiro', rotulo: 'Conselheiro', Icone: Bot },
]

export default function DashboardPage() {
  const { user, session } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({ estudos: 0, anotacoes: 0, pregacoes: 0, favoritos: 0 })
  const [lidos, setLidos] = useState(0)
  const [sequencia, setSequencia] = useState(0)
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [diario, setDiario] = useState<ConteudoDiario | null>(null)

  const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
  // Mostra o versículo da lista local na hora e troca pelo do servidor quando ele chega.
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

  const buscarTudo = useCallback(async () => {
    if (!user) return
    const [e, a, p, f, hist] = await Promise.all([
      supabase.from('estudos_biblicos').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('anotacoes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('pregacoes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('favoritos').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('historico_leitura').select('lido_em').eq('user_id', user.id),
    ])
    setStats({ estudos: e.count ?? 0, anotacoes: a.count ?? 0, pregacoes: p.count ?? 0, favoritos: f.count ?? 0 })
    const datas = (hist.data ?? []).map((h: any) => h.lido_em)
    setLidos(datas.length)
    setSequencia(calcularSequencia(datas))
    setCarregando(false)
  }, [user])

  useEffect(() => { buscarTudo() }, [buscarTudo])

  // O devocional do dia chega em segundo plano — a tela nunca fica esperando por ele.
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

  return (
    <div className="flex flex-col min-h-full bg-bg">
      {/* Cabeçalho */}
      <header className="px-5 pt-6 pb-2">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-conteudo-muted">{saudacao()},</p>
            <h1 className="text-2xl font-extrabold text-conteudo leading-tight">{nome}</h1>
          </div>

          <div className="flex items-center gap-2">
            {sequencia > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-2">
                <Flame size={14} className="text-gold" />
                <span className="text-xs font-bold text-conteudo">{sequencia}</span>
              </div>
            )}
            <Link
              href="/perfil"
              aria-label="Abrir perfil"
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-surface-2 text-conteudo"
            >
              {nome.slice(0, 2).toUpperCase()}
            </Link>
          </div>
        </div>

        <form onSubmit={pesquisar} className="flex items-center gap-2 rounded-2xl px-4 py-3 bg-surface-2">
          <Search size={17} className="text-conteudo-faint" />
          <input
            type="text"
            placeholder="Buscar em estudos, anotações..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            aria-label="Buscar"
            className="flex-1 text-sm bg-transparent outline-none text-conteudo placeholder:text-conteudo-faint"
          />
        </form>
      </header>

      <div className="px-5 py-4 flex flex-col gap-7">
        {/* Versículo do dia */}
        <CartaoVersiculo
          texto={versiculo.texto}
          referencia={versiculo.ref}
          href="/diario"
          data={hoje}
          limite={150}
        />

        {/* Estudo do dia */}
        {diario && (
          <section>
            <h2 className="text-base font-extrabold text-conteudo mb-3">Para hoje</h2>

            <Link
              href="/diario?estudo=1"
              className="cartao flex items-center gap-4 p-4 active:scale-[0.995] transition-transform"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary-soft">
                <Sun size={22} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-conteudo-faint">Estudo do dia</p>
                <p className="text-[15px] font-bold text-conteudo leading-tight">{diario.estudo_titulo}</p>
                <p className="text-xs text-conteudo-muted mt-0.5 flex items-center gap-1">
                  <Headphones size={11} /> {diario.estudo_pontos.length} pontos · pode ouvir
                </p>
              </div>
              <ChevronRight size={18} className="text-conteudo-faint flex-shrink-0" />
            </Link>
          </section>
        )}

        {/* Progresso de leitura */}
        <section className="cartao p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-conteudo">Leitura da Bíblia</p>
              <p className="text-xs text-conteudo-muted">{lidos} de {TOTAL_CAPITULOS} capítulos</p>
            </div>
            <Link href="/plano" className="text-xs font-bold text-primary">Ver plano</Link>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-surface-3">
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${pctLido}%`, backgroundColor: 'var(--accent)' }}
            />
          </div>
          <p className="text-xs text-conteudo-faint mt-1.5 text-right">{pctLido}% concluído</p>
        </section>

        {/* Números do ministério */}
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
                <span className="text-xl font-extrabold text-conteudo">{carregando ? '—' : valor}</span>
                <span className="text-[10px] text-conteudo-muted font-medium mt-0.5 text-center leading-tight">
                  {rotulo}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Atalhos */}
        <section>
          <h2 className="text-base font-extrabold text-conteudo mb-3">Acesso rápido</h2>
          <div className="grid grid-cols-2 gap-3">
            {ATALHOS.map(({ href, rotulo, Icone }) => (
              <Link key={href} href={href} className="cartao flex items-center gap-3 p-4">
                <Icone size={19} className="text-primary flex-shrink-0" />
                <span className="text-sm font-semibold text-conteudo leading-tight">{rotulo}</span>
              </Link>
            ))}
          </div>
        </section>

        <p className="text-center text-xs text-conteudo-faint pb-2">
          &ldquo;Prega a palavra, insta, quer seja oportuno, quer não.&rdquo; — 2 Timóteo 4:2
        </p>
      </div>
    </div>
  )
}
