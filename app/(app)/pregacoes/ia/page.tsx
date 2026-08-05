'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader2, ArrowLeft, Save, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface PregacaoGerada {
  titulo: string
  mensagem_central: string
  introducao: string
  ponto1: string
  ponto2: string
  ponto3: string
  ilustracao: string
  aplicacao_pratica: string
  conclusao: string
  apelo_final: string
}

const SECOES: { key: keyof PregacaoGerada; label: string; icon: string }[] = [
  { key: 'titulo', label: 'Título', icon: '✝️' },
  { key: 'mensagem_central', label: 'Mensagem Central', icon: '💡' },
  { key: 'introducao', label: 'Introdução', icon: '📖' },
  { key: 'ponto1', label: '1º Ponto', icon: '1️⃣' },
  { key: 'ponto2', label: '2º Ponto', icon: '2️⃣' },
  { key: 'ponto3', label: '3º Ponto', icon: '3️⃣' },
  { key: 'ilustracao', label: 'Ilustração', icon: '🌟' },
  { key: 'aplicacao_pratica', label: 'Aplicação Prática', icon: '🙏' },
  { key: 'conclusao', label: 'Conclusão', icon: '🔑' },
  { key: 'apelo_final', label: 'Apelo Final', icon: '💫' },
]

function SecaoCard({ secao, texto }: { secao: (typeof SECOES)[0]; texto: string }) {
  const [aberta, setAberta] = useState(true)
  return (
    <div className="bg-surface rounded-2xl shadow-sm overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3"
        onClick={() => setAberta(v => !v)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{secao.icon}</span>
          <span className="font-bold text-conteudo text-sm">{secao.label}</span>
        </div>
        {aberta ? <ChevronUp size={16} color="var(--text-faint)" /> : <ChevronDown size={16} color="var(--text-faint)" />}
      </button>
      {aberta && (
        <div className="px-4 pb-4">
          <p className="text-sm text-conteudo leading-relaxed">{texto}</p>
        </div>
      )}
    </div>
  )
}

export default function PregacaoIAPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ tema: '', texto_base: '', publico: '' })
  const [gerando, setGerando] = useState(false)
  const [pregacao, setPregacao] = useState<PregacaoGerada | null>(null)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const handleGerar = async () => {
    if (!form.tema.trim() || !form.texto_base.trim()) return
    setGerando(true)
    setErro('')
    setPregacao(null)

    try {
      const res = await fetch('/api/gerar-pregacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setPregacao(data.pregacao)
    } catch (e: any) {
      setErro(e.message ?? 'Erro ao gerar. Tente novamente.')
    } finally {
      setGerando(false)
    }
  }

  const handleSalvar = async () => {
    if (!pregacao || !user) return
    setSalvando(true)
    const now = new Date().toISOString()

    const texto = `PREGAÇÃO GERADA COM IA\n${'='.repeat(30)}\nTEMA: ${form.tema}\nTEXTO BASE: ${form.texto_base}\n\nMENSAGEM CENTRAL:\n${pregacao.mensagem_central}\n\nINTRODUÇÃO:\n${pregacao.introducao}\n\n1º PONTO:\n${pregacao.ponto1}\n\n2º PONTO:\n${pregacao.ponto2}\n\n3º PONTO:\n${pregacao.ponto3}\n\nILUSTRAÇÃO:\n${pregacao.ilustracao}\n\nAPLICAÇÃO PRÁTICA:\n${pregacao.aplicacao_pratica}\n\nCONCLUSÃO:\n${pregacao.conclusao}\n\nAPELO FINAL:\n${pregacao.apelo_final}`

    const { data, error } = await supabase
      .from('pregacoes')
      .insert({
        user_id: user.id,
        tema: form.tema,
        texto_base: form.texto_base,
        objetivo: form.publico || 'Toda a congregação',
        publico: form.publico || 'Toda a congregação',
        problema: '',
        mensagem_central: pregacao.mensagem_central,
        pontos_principais: JSON.stringify([pregacao.ponto1, pregacao.ponto2, pregacao.ponto3]),
        ilustracao: pregacao.ilustracao,
        aplicacao_pratica: pregacao.aplicacao_pratica,
        conclusao: pregacao.conclusao,
        apelo_final: pregacao.apelo_final,
        pregacao_completa: texto,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single()

    setSalvando(false)
    if (!error && data) router.push(`/pregacoes/${data.id}`)
  }

  return (
    <div className="flex flex-col min-h-full bg-bg">
      {/* Header */}
      <div
        className="px-4 py-4 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #1E1B4B 100%)' }}
      >
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-white/10 text-white"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1">
          <h1 className="text-white font-extrabold text-base leading-tight">Gerador de Pregação</h1>
          <p className="text-white/60 text-xs">Powered by IA · Gratuito</p>
        </div>
        <Sparkles size={22} color="rgba(255,255,255,0.7)" />
      </div>

      <div className="px-4 py-5 flex flex-col gap-4">
        {/* Form */}
        {!pregacao && (
          <div className="bg-surface rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-conteudo-muted uppercase tracking-wider mb-1.5">
                Tema da Pregação *
              </label>
              <input
                type="text"
                value={form.tema}
                onChange={e => setForm(p => ({ ...p, tema: e.target.value }))}
                placeholder="Ex: A graça de Deus, Fé que move montanhas..."
                className="w-full border border-borda rounded-xl px-4 py-3 text-sm text-conteudo outline-none"
                style={{ borderColor: form.tema ? 'var(--accent)' : 'var(--border)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-conteudo-muted uppercase tracking-wider mb-1.5">
                Texto Base *
              </label>
              <input
                type="text"
                value={form.texto_base}
                onChange={e => setForm(p => ({ ...p, texto_base: e.target.value }))}
                placeholder="Ex: João 3:16, Filipenses 4:13..."
                className="w-full border border-borda rounded-xl px-4 py-3 text-sm text-conteudo outline-none"
                style={{ borderColor: form.texto_base ? 'var(--accent)' : 'var(--border)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-conteudo-muted uppercase tracking-wider mb-1.5">
                Público (opcional)
              </label>
              <input
                type="text"
                value={form.publico}
                onChange={e => setForm(p => ({ ...p, publico: e.target.value }))}
                placeholder="Ex: Jovens, casais, toda a congregação..."
                className="w-full border border-borda rounded-xl px-4 py-3 text-sm text-conteudo outline-none"
              />
            </div>

            {erro && (
              <div className="bg-perigo-soft border border-perigo rounded-xl px-4 py-3 text-sm text-perigo">
                {erro}
              </div>
            )}

            <button
              onClick={handleGerar}
              disabled={!form.tema.trim() || !form.texto_base.trim() || gerando}
              className="w-full py-4 rounded-xl font-extrabold text-white flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {gerando ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Gerando pregação com IA...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Gerar Pregação com IA
                </>
              )}
            </button>

            {gerando && (
              <p className="text-xs text-center text-conteudo-faint">
                A IA está elaborando sua pregação completa. Isso pode levar alguns segundos...
              </p>
            )}
          </div>
        )}

        {/* Generated Sermon */}
        {pregacao && (
          <>
            <div
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #1E1B4B 100%)' }}
            >
              <Sparkles size={20} color="#fff" />
              <div>
                <p className="text-white font-extrabold text-sm">Pregação gerada com sucesso!</p>
                <p className="text-white/60 text-xs">Revise e salve na sua coleção</p>
              </div>
            </div>

            {SECOES.map(s => (
              <SecaoCard key={s.key} secao={s} texto={pregacao[s.key]} />
            ))}

            <div className="flex gap-3 pb-4">
              <button
                onClick={() => setPregacao(null)}
                className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-violet-500 text-violet-600"
              >
                Gerar outra
              </button>
              <button
                onClick={handleSalvar}
                disabled={salvando}
                className="flex-1 py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                {salvando ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
