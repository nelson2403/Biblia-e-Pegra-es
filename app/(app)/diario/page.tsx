'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Sparkles, BookOpen, RefreshCw, ChevronDown, HandHeart, Bell, Flame,
} from 'lucide-react'
import { CartaoVersiculo } from '@/components/CartaoVersiculo'
import { VideoEstudo } from '@/components/VideoEstudo'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { LeitorAudio } from '@/components/LeitorAudio'
import type { BlocoLeitura } from '@/hooks/useLeitor'
import type { ConteudoDiario } from '@/types'
import { BIBLE_BOOKS } from '@/data/bibleBooks'

export default function DiarioPage() {
  const { user, session } = useAuth()
  const searchParams = useSearchParams()
  const [conteudo, setConteudo] = useState<ConteudoDiario | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [favoritado, setFavoritado] = useState(false)
  const [estudoAberto, setEstudoAberto] = useState(false)
  const [lendoBloco, setLendoBloco] = useState<string | null>(null)
  const [sequencia, setSequencia] = useState(0)

  const token = session?.access_token

  const carregar = useCallback(async () => {
    if (!token) return
    setCarregando(true)
    setErro(null)
    try {
      const res = await fetch('/api/conteudo-diario', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Erro ao carregar.')
      setConteudo(data.conteudo)
    } catch (e: any) {
      setErro(e?.message ?? 'Não foi possível carregar a palavra de hoje.')
    } finally {
      setCarregando(false)
    }
  }, [token])

  useEffect(() => { carregar() }, [carregar])

  // Abre o estudo automaticamente quando a pessoa chega pelo botão da notificação.
  useEffect(() => {
    if (searchParams.get('estudo') === '1') setEstudoAberto(true)
  }, [searchParams])

  // Registra a leitura do dia (alimenta a sequência de dias seguidos).
  useEffect(() => {
    if (!user || !conteudo) return
    const hoje = conteudo.data

    supabase
      .from('devocionais_lidos')
      .upsert({ user_id: user.id, data: hoje }, { onConflict: 'user_id,data' })
      .then(() =>
        supabase
          .from('devocionais_lidos')
          .select('data')
          .eq('user_id', user.id)
          .order('data', { ascending: false })
          .limit(400)
      )
      .then(res => setSequencia(calcularSequencia((res?.data ?? []).map((d: any) => d.data))))
  }, [user, conteudo])

  const textoPartilha = conteudo
    ? `"${conteudo.versiculo_texto}"\n— ${conteudo.versiculo_ref}\n\n${conteudo.reflexao}\n\nCompartilhado pelo app Bíblia & Pregações 🙏`
    : ''

  const partilhar = useCallback(async () => {
    if (!conteudo) return
    if (navigator.share) {
      await navigator.share({ title: `Palavra do dia — ${conteudo.versiculo_ref}`, text: textoPartilha }).catch(() => {})
    } else {
      await navigator.clipboard.writeText(textoPartilha)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    }
  }, [conteudo, textoPartilha])

  // Veio do botão "Partilhar" da notificação: abre a folha de partilha direto.
  useEffect(() => {
    if (searchParams.get('partilhar') === '1' && conteudo) partilhar()
  }, [searchParams, conteudo, partilhar])

  const copiar = async () => {
    if (!conteudo) return
    await navigator.clipboard.writeText(`"${conteudo.versiculo_texto}" — ${conteudo.versiculo_ref}`)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const favoritar = async () => {
    if (!user || !conteudo || favoritado) return
    const { livro, capitulo, versiculo } = separarReferencia(conteudo.versiculo_ref)
    // Casar com o catálogo de livros mantém o link "abrir no capítulo" funcionando.
    const catalogo = BIBLE_BOOKS.find(b => b.pt.toLowerCase() === livro.toLowerCase())
    const { error } = await supabase.from('favoritos').insert({
      user_id: user.id,
      livro_pt: catalogo?.pt ?? livro,
      livro_en: catalogo?.en ?? livro.toLowerCase().replace(/\s+/g, '-'),
      capitulo,
      versiculo,
      texto: conteudo.versiculo_texto,
    })
    // Erro de duplicado significa que já estava salvo — do ponto de vista do usuário, é sucesso.
    if (!error || error.code === '23505') setFavoritado(true)
  }

  // Tudo que o leitor de áudio vai narrar, na ordem em que aparece na tela.
  const blocos: BlocoLeitura[] = useMemo(() => {
    if (!conteudo) return []
    const lista: BlocoLeitura[] = [
      { id: 'versiculo', texto: conteudo.versiculo_texto, prefixo: `Versículo do dia, ${conteudo.versiculo_ref}` },
      { id: 'reflexao', texto: conteudo.reflexao, prefixo: 'Reflexão' },
    ]
    if (conteudo.oracao) lista.push({ id: 'oracao', texto: conteudo.oracao, prefixo: 'Oração' })

    lista.push({ id: 'estudo-titulo', texto: conteudo.estudo_titulo, prefixo: 'Estudo do dia' })
    if (conteudo.estudo_introducao) lista.push({ id: 'estudo-intro', texto: conteudo.estudo_introducao })
    conteudo.estudo_pontos.forEach((p, i) =>
      lista.push({ id: `ponto-${i}`, texto: `${p.titulo}. ${p.referencia ? `${p.referencia}. ` : ''}${p.conteudo}` })
    )
    if (conteudo.estudo_aplicacao) lista.push({ id: 'estudo-aplicacao', texto: conteudo.estudo_aplicacao, prefixo: 'Aplicação prática' })
    if (conteudo.estudo_conclusao) lista.push({ id: 'estudo-conclusao', texto: conteudo.estudo_conclusao, prefixo: 'Conclusão' })

    return lista
  }, [conteudo])

  const destaque = (id: string) => (lendoBloco === id ? { backgroundColor: 'var(--gold-soft)', borderRadius: 12 } : undefined)

  if (carregando) return <LoadingSpinner fullScreen={false} />

  if (erro || !conteudo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-8 py-20 gap-4 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--danger-soft)' }}>
          <Sparkles size={28} color="var(--danger)" />
        </div>
        <p className="text-conteudo font-bold">Não foi possível carregar a palavra de hoje</p>
        <p className="text-sm text-conteudo-faint">{erro}</p>
        <button
          onClick={carregar}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <RefreshCw size={16} /> Tentar de novo
        </button>
      </div>
    )
  }

  const dataLonga = new Date(`${conteudo.data}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="flex flex-col min-h-full pb-32 bg-bg">
      <header className="px-5 pt-6 pb-1">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm capitalize text-conteudo-muted">{dataLonga}</p>
          {sequencia > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-2">
              <Flame size={13} className="text-gold" aria-hidden="true" />
              <span className="text-xs font-bold text-conteudo">{sequencia} dias</span>
            </div>
          )}
        </div>

        <div style={destaque('versiculo')}>
          <CartaoVersiculo
            texto={conteudo.versiculo_texto}
            referencia={conteudo.versiculo_ref}
            data={conteudo.data}
            favoritado={favoritado}
            copiado={copiado}
            aoFavoritar={favoritar}
            aoPartilhar={partilhar}
            aoCopiar={copiar}
          />
        </div>
      </header>

      <div className="px-5 py-5 flex flex-col gap-4">
        {/* Reflexão */}
        <section className="bg-surface rounded-2xl p-5 shadow-sm" style={destaque('reflexao')}>
          <h2 className="text-base font-extrabold text-conteudo mb-3">Reflexão de hoje</h2>
          <p className="text-[15px] text-conteudo leading-relaxed whitespace-pre-wrap">{conteudo.reflexao}</p>
        </section>

        {/* Oração */}
        {conteudo.oracao && (
          <section
            className="rounded-2xl p-5"
            style={{ background: 'linear-gradient(135deg, #F5F3FF, #EEF2FF)', ...destaque('oracao') }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <HandHeart size={17} color="var(--accent)" aria-hidden="true" />
              <h2 className="text-sm font-extrabold" style={{ color: 'var(--accent)' }}>Oração</h2>
            </div>
            <p className="text-[15px] text-conteudo leading-relaxed italic">{conteudo.oracao}</p>
          </section>
        )}

        {/* Estudo do dia */}
        <section className="bg-surface rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setEstudoAberto(v => !v)}
            aria-expanded={estudoAberto}
            className="w-full flex items-center gap-3 p-5 text-left"
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
            >
              <BookOpen size={20} color="#fff" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0" style={destaque('estudo-titulo')}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-conteudo-faint">Estudo do dia</p>
              <h2 className="text-base font-extrabold text-conteudo leading-tight">{conteudo.estudo_titulo}</h2>
              {conteudo.estudo_subtitulo && (
                <p className="text-xs text-conteudo-muted mt-0.5">{conteudo.estudo_subtitulo}</p>
              )}
            </div>
            <ChevronDown
              size={20}
              color="var(--text-faint)"
              style={{ transform: estudoAberto ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}
              aria-hidden="true"
            />
          </button>

          {estudoAberto && (
            <div className="px-5 pb-5 flex flex-col gap-4 border-t border-borda pt-4">
              {conteudo.estudo_texto_base && (
                <span
                  className="self-start px-3 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
                >
                  {conteudo.estudo_texto_base}
                </span>
              )}

              {conteudo.video_id && !conteudo.video_oculto && (
                <VideoEstudo
                  videoId={conteudo.video_id}
                  titulo={conteudo.video_titulo ?? 'Vídeo sobre o tema'}
                  canal={conteudo.video_canal ?? ''}
                />
              )}

              {conteudo.estudo_introducao && (
                <p className="text-[15px] text-conteudo leading-relaxed" style={destaque('estudo-intro')}>
                  {conteudo.estudo_introducao}
                </p>
              )}

              {conteudo.estudo_pontos.map((p, i) => (
                <article key={i} className="pl-4 py-1" style={{ borderLeft: '3px solid #C7D2FE', ...destaque(`ponto-${i}`) }}>
                  <h3 className="font-bold text-conteudo text-[15px] mb-1">{i + 1}. {p.titulo}</h3>
                  {p.referencia && (
                    <p className="text-xs font-bold mb-1.5" style={{ color: 'var(--accent)' }}>{p.referencia}</p>
                  )}
                  <p className="text-[15px] text-conteudo-muted leading-relaxed">{p.conteudo}</p>
                </article>
              ))}

              {conteudo.estudo_aplicacao && (
                <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--gold-soft)', ...destaque('estudo-aplicacao') }}>
                  <h3 className="text-sm font-extrabold mb-1.5" style={{ color: 'var(--gold)' }}>Aplicação prática</h3>
                  <p className="text-[15px] text-conteudo leading-relaxed">{conteudo.estudo_aplicacao}</p>
                </div>
              )}

              {conteudo.estudo_conclusao && (
                <div style={destaque('estudo-conclusao')} className="px-1">
                  <h3 className="text-sm font-extrabold text-conteudo mb-1.5">Conclusão</h3>
                  <p className="text-[15px] text-conteudo leading-relaxed">{conteudo.estudo_conclusao}</p>
                </div>
              )}

              <Link
                href={`/anotacoes/nova?ref=${encodeURIComponent(conteudo.estudo_titulo)}&texto=${encodeURIComponent(conteudo.versiculo_texto)}`}
                className="self-start text-sm font-bold px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                Anotar o que Deus falou comigo
              </Link>
            </div>
          )}
        </section>

        <Link
          href="/perfil#notificacoes"
          className="flex items-center gap-3 bg-surface rounded-2xl p-4 shadow-sm"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--gold-soft)' }}>
            <Bell size={18} color="var(--gold)" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-conteudo">Receber a Palavra todo dia</p>
            <p className="text-xs text-conteudo-faint">Escolha o horário do seu devocional</p>
          </div>
          <span className="text-conteudo-faint" aria-hidden="true">›</span>
        </Link>
      </div>

      <LeitorAudio blocos={blocos} titulo={`Devocional — ${conteudo.versiculo_ref}`} onBlocoAtual={setLendoBloco} />
    </div>
  )
}

/** Conta quantos dias seguidos, terminando hoje ou ontem, a pessoa abriu o devocional. */
function calcularSequencia(datas: string[]): number {
  if (!datas.length) return 0
  const unicas = Array.from(new Set(datas)).sort().reverse()
  const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
  const ontem = new Date(Date.now() - 86400000).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
  if (unicas[0] !== hoje && unicas[0] !== ontem) return 0

  let seq = 1
  for (let i = 1; i < unicas.length; i++) {
    const dif = (new Date(unicas[i - 1]).getTime() - new Date(unicas[i]).getTime()) / 86400000
    if (dif === 1) seq++
    else break
  }
  return seq
}

/** Quebra "1 Coríntios 13:4" em livro, capítulo e versículo para salvar nos favoritos. */
function separarReferencia(ref: string): { livro: string; capitulo: number; versiculo: number } {
  const m = ref.match(/^(.+?)\s+(\d+):(\d+)/)
  if (!m) return { livro: ref, capitulo: 1, versiculo: 1 }
  return { livro: m[1].trim(), capitulo: parseInt(m[2], 10), versiculo: parseInt(m[3], 10) }
}
