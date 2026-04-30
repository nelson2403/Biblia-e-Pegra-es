'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, PenLine, Mic, Layers, Sparkles, Heart, Map, Search, Flame } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { BIBLE_BOOKS } from '@/data/bibleBooks'

const TOTAL_CHAPTERS = BIBLE_BOOKS.reduce((sum, b) => sum + b.chapters, 0)

const VERSES = [
  { text: 'Lampada para os meus pes e a tua palavra, e luz para o meu caminho.', ref: 'Salmos 119:105' },
  { text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigenito.', ref: 'Joao 3:16' },
  { text: 'Posso tudo naquele que me fortalece.', ref: 'Filipenses 4:13' },
  { text: 'O Senhor e o meu pastor, e nada me faltara.', ref: 'Salmos 23:1' },
  { text: 'Mas os que esperam no Senhor renovarao as forcas.', ref: 'Isaias 40:31' },
  { text: 'Confiai no Senhor com todo o vosso coracao.', ref: 'Proverbios 3:5' },
  { text: 'Sede fortes e corajosos. Nao temais nem vos assusteis.', ref: 'Josue 1:9' },
]

function calcStreak(dates: string[]): number {
  if (!dates.length) return 0
  const unique = Array.from(new Set(dates)).sort().reverse()
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  if (unique[0] !== today && unique[0] !== yesterday) return 0
  let streak = 1
  for (let i = 1; i < unique.length; i++) {
    const diff = (new Date(unique[i - 1]).getTime() - new Date(unique[i]).getTime()) / 86400000
    if (diff === 1) streak++
    else break
  }
  return streak
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({ estudos: 0, anotacoes: 0, pregacoes: 0, favoritos: 0 })
  const [readCount, setReadCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const verse = VERSES[new Date().getDay() % VERSES.length]
  const userName = (user?.user_metadata?.name || user?.email?.split('@')[0] || 'Servo').split(' ')[0]

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Bom dia'
    if (h < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const fetchAll = useCallback(async () => {
    if (!user) return
    const [e, a, p, f, hist] = await Promise.all([
      supabase.from('estudos_biblicos').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('anotacoes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('pregacoes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('favoritos').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('historico_leitura').select('lido_em').eq('user_id', user.id),
    ])
    setStats({ estudos: e.count ?? 0, anotacoes: a.count ?? 0, pregacoes: p.count ?? 0, favoritos: f.count ?? 0 })
    const dates = (hist.data ?? []).map((h: any) => h.lido_em)
    setReadCount(dates.length)
    setStreak(calcStreak(dates))
    setLoading(false)
  }, [user])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) router.push(`/busca?q=${encodeURIComponent(searchQuery)}`)
  }

  const readPct = Math.round((readCount / TOTAL_CHAPTERS) * 100)

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-6 text-white"
        style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 50%, #4F46E5 100%)' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-extrabold">{greeting()}, {userName}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Que Deus abencoe sua jornada</p>
          </div>
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-white/20 px-2.5 py-1.5 rounded-xl">
                <Flame size={14} color="#F59E0B" />
                <span className="text-xs font-bold text-amber-300">{streak}</span>
              </div>
            )}
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.3)' }}>
              {userName.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch}
          className="flex items-center gap-2 bg-white/15 border border-white/25 rounded-xl px-3 py-2.5 mb-4">
          <Search size={16} color="rgba(255,255,255,0.7)" />
          <input
            type="text"
            placeholder="Buscar em estudos, anotacoes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 text-sm text-white placeholder:text-white/50 outline-none bg-transparent"
          />
        </form>

        {/* Verse card */}
        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={12} color="#F59E0B" />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#F59E0B' }}>Versiculo do dia</span>
          </div>
          <p className="text-sm italic text-white leading-relaxed mb-1">"{verse.text}"</p>
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>{verse.ref}</p>
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5">
        {/* Reading progress */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-bold text-gray-800">Leitura da Biblia</p>
              <p className="text-xs text-gray-400">{readCount} de {TOTAL_CHAPTERS} capitulos</p>
            </div>
            <Link href="/plano" className="text-xs font-bold text-primary">Ver plano &rarr;</Link>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-2.5 rounded-full transition-all"
              style={{ width: `${readPct}%`, background: 'linear-gradient(90deg, #4F46E5, #7C3AED)' }} />
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right">{readPct}% concluido</p>
        </div>

        {/* Stats */}
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Meu Ministerio</h2>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: stats.estudos, label: 'Estudos', Icon: Layers, color: '#4F46E5', bg: '#EEF2FF', href: '/estudos' },
              { value: stats.anotacoes, label: 'Anotacoes', Icon: PenLine, color: '#D97706', bg: '#FFFBEB', href: '/anotacoes' },
              { value: stats.pregacoes, label: 'Pregacoes', Icon: Mic, color: '#059669', bg: '#ECFDF5', href: '/pregacoes' },
              { value: stats.favoritos, label: 'Favoritos', Icon: Heart, color: '#EF4444', bg: '#FEF2F2', href: '/favoritos' },
            ].map(({ value, label, Icon, color, bg, href }) => (
              <Link key={label} href={href} className="bg-white rounded-2xl p-3 flex flex-col items-center shadow-sm">
                <div className="w-9 h-9 rounded-full flex items-center justify-center mb-1.5" style={{ backgroundColor: bg }}>
                  <Icon size={17} color={color} />
                </div>
                <span className="text-xl font-extrabold" style={{ color }}>{loading ? '—' : value}</span>
                <span className="text-[10px] text-gray-500 font-medium mt-0.5 text-center leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Acesso Rapido</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/biblia', label: 'Ler a Biblia', Icon: BookOpen, color: '#4F46E5', bg: '#EEF2FF' },
              { href: '/plano', label: 'Plano de Leitura', Icon: Map, color: '#7C3AED', bg: '#F5F3FF' },
              { href: '/anotacoes/nova', label: 'Nova Anotacao', Icon: PenLine, color: '#D97706', bg: '#FFFBEB' },
              { href: '/pregacoes/nova', label: 'Nova Pregacao', Icon: Mic, color: '#059669', bg: '#ECFDF5' },
            ].map(({ href, label, Icon, color, bg }) => (
              <Link key={href} href={href}
                className="bg-white rounded-2xl p-5 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2.5" style={{ backgroundColor: bg }}>
                  <Icon size={24} color={color} />
                </div>
                <span className="text-sm font-semibold text-gray-800 text-center">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Banner */}
        <div className="rounded-2xl p-5 flex flex-col items-center gap-2 text-center"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}>
          <p className="text-sm italic text-white leading-relaxed">
            "Prega a palavra, insiste, quer seja oportuno quer nao."
          </p>
          <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.65)' }}>2 Timoteo 4:2</p>
        </div>
      </div>
    </div>
  )
}
