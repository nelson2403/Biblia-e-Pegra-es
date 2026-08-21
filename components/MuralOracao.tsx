'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Plus, HandHeart, X, Loader2, MessageCircle, Sparkles, Trash2, Send, Check,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export const CATEGORIAS = [
  { id: 'geral', rotulo: 'Geral' },
  { id: 'saude', rotulo: 'Saúde' },
  { id: 'familia', rotulo: 'Família' },
  { id: 'trabalho', rotulo: 'Trabalho' },
  { id: 'financas', rotulo: 'Finanças' },
  { id: 'espiritual', rotulo: 'Vida espiritual' },
  { id: 'gratidao', rotulo: 'Gratidão' },
] as const

interface Comentario {
  id: string
  user_id: string
  autor_nome: string
  texto: string
  created_at: string
}

interface Pedido {
  id: string
  user_id: string
  autor_nome: string
  texto: string
  anonimo: boolean
  categoria: string
  respondido: boolean
  testemunho: string | null
  created_at: string
  oradores: number
  euOrei: boolean
  comentarios: Comentario[]
}

function tempoRelativo(iso: string): string {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `há ${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `há ${d}d`
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function iniciais(nome: string): string {
  return nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
}

type Filtro = 'todos' | 'orando' | 'respondidos' | 'meus'

export function MuralOracao({ compacto = false }: { compacto?: boolean }) {
  const { user } = useAuth()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [carregando, setCarregando] = useState(true)
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [categoria, setCategoria] = useState<string>('todas')
  const [formAberto, setFormAberto] = useState(false)
  const [texto, setTexto] = useState('')
  const [novaCategoria, setNovaCategoria] = useState('geral')
  const [anonimo, setAnonimo] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [comentando, setComentando] = useState<string | null>(null)
  const [rascunho, setRascunho] = useState('')
  const [testemunhando, setTestemunhando] = useState<string | null>(null)
  const [textoTestemunho, setTextoTestemunho] = useState('')

  const carregar = useCallback(async () => {
    const [{ data: ped }, { data: ora }, { data: com }] = await Promise.all([
      supabase.from('pedidos_oracao').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('oracoes').select('pedido_id, user_id'),
      supabase.from('oracao_comentarios').select('*').order('created_at', { ascending: true }),
    ])

    const contagem = new Map<string, number>()
    const meus = new Set<string>()
    ora?.forEach(o => {
      contagem.set(o.pedido_id, (contagem.get(o.pedido_id) ?? 0) + 1)
      if (o.user_id === user?.id) meus.add(o.pedido_id)
    })

    const porPedido = new Map<string, Comentario[]>()
    com?.forEach((c: any) => {
      const lista = porPedido.get(c.pedido_id) ?? []
      lista.push(c)
      porPedido.set(c.pedido_id, lista)
    })

    setPedidos(
      (ped ?? []).map((p: any) => ({
        ...p,
        categoria: p.categoria ?? 'geral',
        respondido: !!p.respondido,
        oradores: contagem.get(p.id) ?? 0,
        euOrei: meus.has(p.id),
        comentarios: porPedido.get(p.id) ?? [],
      }))
    )
  }, [user?.id])

  useEffect(() => {
    setCarregando(true)
    carregar().finally(() => setCarregando(false))
  }, [carregar])

  const orar = async (id: string) => {
    if (!user) return
    const alvo = pedidos.find(p => p.id === id)
    if (!alvo) return

    // Atualiza a tela na hora; o banco vem em seguida.
    setPedidos(prev =>
      prev.map(p =>
        p.id === id ? { ...p, euOrei: !p.euOrei, oradores: p.oradores + (p.euOrei ? -1 : 1) } : p
      )
    )

    if (alvo.euOrei) {
      await supabase.from('oracoes').delete().eq('pedido_id', id).eq('user_id', user.id)
    } else {
      await supabase.from('oracoes').insert({ pedido_id: id, user_id: user.id })
    }
  }

  const nomeDoUsuario = () =>
    user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? 'Servo'

  const publicar = async () => {
    if (!texto.trim() || !user || enviando) return
    setEnviando(true)
    await supabase.from('pedidos_oracao').insert({
      user_id: user.id,
      autor_nome: anonimo ? 'Anônimo' : nomeDoUsuario(),
      texto: texto.trim(),
      anonimo,
      categoria: novaCategoria,
    })
    setTexto('')
    setAnonimo(false)
    setNovaCategoria('geral')
    setFormAberto(false)
    setEnviando(false)
    carregar()
  }

  const comentar = async (pedidoId: string) => {
    if (!rascunho.trim() || !user) return
    await supabase.from('oracao_comentarios').insert({
      pedido_id: pedidoId,
      user_id: user.id,
      autor_nome: nomeDoUsuario(),
      texto: rascunho.trim(),
    })
    setRascunho('')
    setComentando(null)
    carregar()
  }

  const marcarRespondido = async (pedidoId: string) => {
    if (!user) return
    await supabase
      .from('pedidos_oracao')
      .update({ respondido: true, testemunho: textoTestemunho.trim() || null })
      .eq('id', pedidoId)
      .eq('user_id', user.id)
    setTextoTestemunho('')
    setTestemunhando(null)
    carregar()
  }

  const apagar = async (id: string) => {
    if (!confirm('Remover este pedido do mural?')) return
    await supabase.from('pedidos_oracao').delete().eq('id', id)
    setPedidos(prev => prev.filter(p => p.id !== id))
  }

  const visiveis = useMemo(() => {
    let lista = pedidos
    if (filtro === 'orando') lista = lista.filter(p => !p.respondido)
    if (filtro === 'respondidos') lista = lista.filter(p => p.respondido)
    if (filtro === 'meus') lista = lista.filter(p => p.user_id === user?.id)
    if (categoria !== 'todas') lista = lista.filter(p => p.categoria === categoria)
    return compacto ? lista.slice(0, 5) : lista
  }, [pedidos, filtro, categoria, user?.id, compacto])

  const totalOracoes = pedidos.reduce((s, p) => s + p.oradores, 0)
  const respondidos = pedidos.filter(p => p.respondido).length

  return (
    <div className="flex flex-col gap-4">
      {/* Pulso da comunidade */}
      {!compacto && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { valor: pedidos.length, rotulo: 'pedidos' },
            { valor: totalOracoes, rotulo: 'orações feitas' },
            { valor: respondidos, rotulo: 'respondidos' },
          ].map(({ valor, rotulo }) => (
            <div key={rotulo} className="cartao py-3 px-2 flex flex-col items-center">
              <span className="text-xl font-extrabold text-conteudo tabular-nums">{valor}</span>
              <span className="text-[10px] text-conteudo-muted text-center leading-tight">{rotulo}</span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setFormAberto(true)}
        className="flex items-center gap-3 w-full p-4 rounded-card text-left transition-transform active:scale-[0.99]"
        style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))' }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,.2)' }}>
          <Plus size={20} color="#fff" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold text-sm">Pedir oração</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,.75)' }}>
            A igreja inteira ora com você
          </p>
        </div>
      </button>

      {!compacto && (
        <>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {([
              ['todos', 'Todos'],
              ['orando', 'Em oração'],
              ['respondidos', 'Respondidos'],
              ['meus', 'Meus pedidos'],
            ] as [Filtro, string][]).map(([id, rotulo]) => (
              <button key={id} onClick={() => setFiltro(id)} aria-pressed={filtro === id}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors"
                style={{
                  backgroundColor: filtro === id ? 'var(--accent)' : 'var(--surface-2)',
                  color: filtro === id ? 'var(--accent-fg)' : 'var(--text-muted)',
                }}>
                {rotulo}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <button onClick={() => setCategoria('todas')} aria-pressed={categoria === 'todas'}
              className="px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap border transition-colors"
              style={{
                borderColor: categoria === 'todas' ? 'var(--accent)' : 'var(--border)',
                color: categoria === 'todas' ? 'var(--accent)' : 'var(--text-muted)',
              }}>
              Todas
            </button>
            {CATEGORIAS.map(c => (
              <button key={c.id} onClick={() => setCategoria(c.id)} aria-pressed={categoria === c.id}
                className="px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap border transition-colors"
                style={{
                  borderColor: categoria === c.id ? 'var(--accent)' : 'var(--border)',
                  color: categoria === c.id ? 'var(--accent)' : 'var(--text-muted)',
                }}>
                {c.rotulo}
              </button>
            ))}
          </div>
        </>
      )}

      {carregando ? (
        <div className="flex justify-center py-10">
          <Loader2 size={26} className="animate-spin text-primary" />
        </div>
      ) : visiveis.length === 0 ? (
        <div className="cartao flex flex-col items-center gap-2 py-10 px-6 text-center">
          <HandHeart size={30} className="text-conteudo-faint" />
          <p className="text-sm text-conteudo-muted">Nenhum pedido por aqui ainda.</p>
          <p className="text-xs text-conteudo-faint">Seja o primeiro a compartilhar.</p>
        </div>
      ) : (
        visiveis.map(p => {
          const cat = CATEGORIAS.find(c => c.id === p.categoria)
          const meu = p.user_id === user?.id

          return (
            <article key={p.id} className="cartao p-4"
              style={p.respondido ? { borderLeft: '3px solid var(--success)' } : undefined}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
                  {p.anonimo ? '?' : iniciais(p.autor_nome)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-conteudo truncate">{p.autor_nome}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-conteudo-faint">{tempoRelativo(p.created_at)}</span>
                    {cat && cat.id !== 'geral' && (
                      <span className="etiqueta text-[10px] py-0">{cat.rotulo}</span>
                    )}
                    {p.respondido && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                        style={{ backgroundColor: 'var(--success-soft)', color: 'var(--success)' }}>
                        <Check size={9} strokeWidth={3} /> Respondido
                      </span>
                    )}
                  </div>
                </div>
                {meu && (
                  <button onClick={() => apagar(p.id)} aria-label="Remover pedido"
                    className="p-1.5 text-conteudo-faint hover:text-perigo">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              <p className="text-[15px] text-conteudo leading-relaxed whitespace-pre-wrap mb-3">{p.texto}</p>

              {p.respondido && p.testemunho && (
                <div className="rounded-2xl p-3 mb-3" style={{ backgroundColor: 'var(--success-soft)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: 'var(--success)' }}>
                    Como Deus respondeu
                  </p>
                  <p className="text-sm text-conteudo leading-relaxed">{p.testemunho}</p>
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => orar(p.id)}
                  aria-pressed={p.euOrei}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-colors"
                  style={{
                    backgroundColor: p.euOrei ? 'var(--accent)' : 'var(--surface-2)',
                    color: p.euOrei ? 'var(--accent-fg)' : 'var(--text-muted)',
                  }}>
                  <HandHeart size={14} fill={p.euOrei ? 'currentColor' : 'none'} />
                  {p.euOrei ? 'Orando' : 'Orar'}
                  {p.oradores > 0 && <span className="tabular-nums">· {p.oradores}</span>}
                </button>

                <button onClick={() => setComentando(comentando === p.id ? null : p.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-surface-2 text-conteudo-muted">
                  <MessageCircle size={14} />
                  {p.comentarios.length > 0 ? p.comentarios.length : 'Apoiar'}
                </button>

                {meu && !p.respondido && (
                  <button onClick={() => setTestemunhando(testemunhando === p.id ? null : p.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold"
                    style={{ backgroundColor: 'var(--success-soft)', color: 'var(--success)' }}>
                    <Sparkles size={13} /> Foi respondido
                  </button>
                )}
              </div>

              {p.comentarios.length > 0 && (
                <div className="mt-3 pt-3 flex flex-col gap-2.5">
                  {p.comentarios.map(c => (
                    <div key={c.id} className="flex gap-2.5">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold mt-0.5"
                        style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                        {iniciais(c.autor_nome)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs">
                          <span className="font-bold text-conteudo">{c.autor_nome}</span>{' '}
                          <span className="text-conteudo-faint">{tempoRelativo(c.created_at)}</span>
                        </p>
                        <p className="text-sm text-conteudo-muted leading-snug">{c.texto}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {comentando === p.id && (
                <div className="mt-3 flex gap-2">
                  <input
                    value={rascunho}
                    onChange={e => setRascunho(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') comentar(p.id) }}
                    placeholder="Escreva uma palavra de apoio..."
                    aria-label="Comentário de apoio"
                    className="campo flex-1 py-2 text-sm"
                    autoFocus
                  />
                  <button onClick={() => comentar(p.id)} aria-label="Enviar apoio"
                    className="px-3.5 rounded-2xl text-white flex-shrink-0"
                    style={{ backgroundColor: 'var(--accent)' }}>
                    <Send size={16} />
                  </button>
                </div>
              )}

              {testemunhando === p.id && (
                <div className="mt-3 flex flex-col gap-2">
                  <textarea
                    value={textoTestemunho}
                    onChange={e => setTextoTestemunho(e.target.value)}
                    placeholder="Conte como Deus respondeu (opcional)..."
                    aria-label="Testemunho"
                    rows={3}
                    className="campo text-sm resize-none"
                    autoFocus
                  />
                  <button onClick={() => marcarRespondido(p.id)} className="btn-primario py-2.5 text-sm">
                    <Check size={16} /> Marcar como respondido
                  </button>
                </div>
              )}
            </article>
          )
        })
      )}

      {/* Novo pedido */}
      {formAberto && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,.55)' }}
          onClick={() => setFormAberto(false)}
          role="dialog" aria-modal="true" aria-label="Novo pedido de oração">
          <div className="bg-surface w-full max-w-lg rounded-t-[28px] p-5 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-conteudo text-base">Pedir oração</h3>
              <button onClick={() => setFormAberto(false)} aria-label="Fechar" className="p-1.5 text-conteudo-faint">
                <X size={20} />
              </button>
            </div>

            <textarea
              value={texto}
              onChange={e => setTexto(e.target.value)}
              placeholder="Pelo que você quer que orem?"
              aria-label="Pedido de oração"
              rows={5}
              className="campo resize-none mb-3"
              autoFocus
            />

            <p className="text-xs font-bold text-conteudo-muted mb-2">Assunto</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIAS.map(c => (
                <button key={c.id} onClick={() => setNovaCategoria(c.id)} aria-pressed={novaCategoria === c.id}
                  className="px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                  style={{
                    backgroundColor: novaCategoria === c.id ? 'var(--accent)' : 'var(--surface-2)',
                    color: novaCategoria === c.id ? 'var(--accent-fg)' : 'var(--text-muted)',
                  }}>
                  {c.rotulo}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-3 py-3 cursor-pointer">
              <input type="checkbox" checked={anonimo} onChange={e => setAnonimo(e.target.checked)}
                className="w-5 h-5 rounded accent-current text-primary" />
              <span className="text-sm text-conteudo">Publicar como anônimo</span>
            </label>

            <button onClick={publicar} disabled={!texto.trim() || enviando} className="btn-primario mt-2">
              {enviando ? <Loader2 size={17} className="animate-spin" /> : <HandHeart size={17} />}
              {enviando ? 'Publicando...' : 'Publicar pedido'}
            </button>

            <p className="text-xs text-conteudo-faint text-center mt-3 leading-relaxed">
              Seu pedido fica visível para todos os usuários do app.
              Evite dados pessoais como endereço ou telefone.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
