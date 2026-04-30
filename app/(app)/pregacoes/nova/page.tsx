'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { PregacaoForm } from '@/types'

interface Step { key: keyof PregacaoForm; question: string; hint: string; multiline: boolean; icon: string }

const STEPS: Step[] = [
  { key: 'tema', question: 'Qual sera o tema da pregacao?', hint: 'Ex: A graca de Deus, Fe que move montanhas...', multiline: false, icon: '✝️' },
  { key: 'texto_base', question: 'Qual sera o texto base?', hint: 'Ex: Joao 3:16, Filipenses 4:13...', multiline: false, icon: '📖' },
  { key: 'objetivo', question: 'Qual o objetivo principal da mensagem?', hint: 'O que voce quer que as pessoas levem para casa...', multiline: true, icon: '🎯' },
  { key: 'publico', question: 'Para qual publico essa mensagem sera pregada?', hint: 'Ex: Jovens, toda a congregacao, casais...', multiline: false, icon: '👥' },
  { key: 'problema', question: 'Qual problema ou necessidade essa mensagem vai tratar?', hint: 'Qual desafio ou dor do publico esta mensagem responde...', multiline: true, icon: '💔' },
  { key: 'mensagem_central', question: 'Qual e a mensagem central?', hint: 'A grande verdade em uma frase poderosa...', multiline: true, icon: '💡' },
  { key: 'ponto1', question: '1o Ponto Principal', hint: 'Primeiro ponto de desenvolvimento da mensagem...', multiline: true, icon: '1️⃣' },
  { key: 'ponto2', question: '2o Ponto Principal', hint: 'Segundo ponto de desenvolvimento da mensagem...', multiline: true, icon: '2️⃣' },
  { key: 'ponto3', question: '3o Ponto Principal', hint: 'Terceiro ponto de desenvolvimento da mensagem...', multiline: true, icon: '3️⃣' },
  { key: 'ilustracao', question: 'Qual ilustracao ou exemplo pode ser usado?', hint: 'Uma historia, parabola ou exemplo pratico...', multiline: true, icon: '🌟' },
  { key: 'aplicacao_pratica', question: 'Qual sera a aplicacao pratica?', hint: 'O que as pessoas podem fazer ao sair daqui...', multiline: true, icon: '🙏' },
  { key: 'conclusao', question: 'Qual sera a conclusao?', hint: 'Como voce fecha a mensagem com chave de ouro...', multiline: true, icon: '🔑' },
  { key: 'apelo_final', question: 'Qual sera o apelo ou chamada final?', hint: 'O convite, altar, decisao ou compromisso...', multiline: true, icon: '💫' },
]

const empty: PregacaoForm = {
  tema: '', texto_base: '', objetivo: '', publico: '', problema: '',
  mensagem_central: '', ponto1: '', ponto2: '', ponto3: '',
  ilustracao: '', aplicacao_pratica: '', conclusao: '', apelo_final: '',
}

function gerarPregacao(f: PregacaoForm): string {
  return `PREGACAO COMPLETA
===================
TEMA: ${f.tema}
TEXTO BASE: ${f.texto_base}

INTRODUCAO
===================
Hoje vamos falar sobre "${f.tema}". A Palavra de Deus em ${f.texto_base} nos traz uma verdade transformadora.
Vivemos em um tempo onde ${f.problema} E para isso que Deus tem uma palavra poderosa hoje.
Esta mensagem e especialmente para: ${f.publico}.
O nosso objetivo e: ${f.objetivo}

MENSAGEM CENTRAL
===================
${f.mensagem_central}

DESENVOLVIMENTO
===================
1o PONTO:
${f.ponto1}

2o PONTO:
${f.ponto2}

3o PONTO:
${f.ponto3}

ILUSTRACAO / EXEMPLO
===================
${f.ilustracao}

APLICACAO PRATICA
===================
${f.aplicacao_pratica}

CONCLUSAO
===================
${f.conclusao}

APELO / CHAMADA
===================
${f.apelo_final}

Que Deus abencoe!`
}

export default function NovaPregacaoPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')
  const isEdit = !!editId

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<PregacaoForm>(empty)
  const [saving, setSaving] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    supabase.from('pregacoes').select('*').eq('id', editId).single().then(({ data }) => {
      if (data) {
        let pts: string[] = ['', '', '']
        try { pts = JSON.parse(data.pontos_principais) } catch {}
        setForm({
          tema: data.tema ?? '', texto_base: data.texto_base ?? '', objetivo: data.objetivo ?? '',
          publico: data.publico ?? '', problema: data.problema ?? '', mensagem_central: data.mensagem_central ?? '',
          ponto1: pts[0] ?? '', ponto2: pts[1] ?? '', ponto3: pts[2] ?? '',
          ilustracao: data.ilustracao ?? '', aplicacao_pratica: data.aplicacao_pratica ?? '',
          conclusao: data.conclusao ?? '', apelo_final: data.apelo_final ?? '',
        })
      }
      setFetchLoading(false)
    })
  }, [editId, isEdit])

  const currentStep = STEPS[step]
  const currentValue = form[currentStep.key]
  const isLast = step === STEPS.length - 1
  const progress = (step + 1) / STEPS.length

  const setValue = (value: string) => setForm(prev => ({ ...prev, [currentStep.key]: value }))

  const handleNext = async () => {
    if (!currentValue.trim()) { alert('Por favor, preencha este campo antes de continuar.'); return }
    if (!isLast) { setStep(s => s + 1); return }
    setSaving(true)
    const now = new Date().toISOString()
    const payload = {
      user_id: user!.id,
      tema: form.tema, texto_base: form.texto_base, objetivo: form.objetivo,
      publico: form.publico, problema: form.problema, mensagem_central: form.mensagem_central,
      pontos_principais: JSON.stringify([form.ponto1, form.ponto2, form.ponto3]),
      ilustracao: form.ilustracao, aplicacao_pratica: form.aplicacao_pratica,
      conclusao: form.conclusao, apelo_final: form.apelo_final,
      pregacao_completa: gerarPregacao(form),
      updated_at: now,
    }
    const { data, error } = isEdit
      ? await supabase.from('pregacoes').update(payload).eq('id', editId).select().single()
      : await supabase.from('pregacoes').insert({ ...payload, created_at: now }).select().single()
    setSaving(false)
    if (error) { alert('Nao foi possivel salvar a pregacao.'); return }
    router.replace(`/pregacoes/${data.id}`)
  }

  if (fetchLoading) return <div className="flex items-center justify-center py-20 text-gray-400">Carregando...</div>

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex items-center justify-between px-4 py-4 text-white" style={{ backgroundColor: '#3730A3' }}>
        <button onClick={() => step === 0 ? router.back() : setStep(s => s - 1)} className="p-2 rounded-xl hover:bg-white/10">
          <ArrowLeft size={22} />
        </button>
        <span className="font-bold text-base">{isEdit ? 'Editar Pregacao' : 'Nova Pregacao'}</span>
        <span className="text-sm text-white/70 font-semibold">{step + 1}/{STEPS.length}</span>
      </div>

      <div className="h-1 bg-indigo-200">
        <div className="h-1 bg-amber-400 transition-all duration-300" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="flex-1 flex flex-col p-5 gap-5 overflow-auto pb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
          <span className="text-4xl mb-4">{currentStep.icon}</span>
          <h2 className="text-lg font-bold text-gray-800 mb-2 leading-snug">{currentStep.question}</h2>
          <p className="text-sm text-gray-400 leading-relaxed">{currentStep.hint}</p>
        </div>

        <div className="bg-white rounded-2xl p-1 shadow-sm border-2 border-indigo-200">
          {currentStep.multiline ? (
            <textarea
              value={currentValue}
              onChange={e => setValue(e.target.value)}
              placeholder="Digite sua resposta aqui..."
              className="w-full px-4 py-4 text-sm text-gray-800 outline-none resize-none min-h-[140px] rounded-xl"
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={currentValue}
              onChange={e => setValue(e.target.value)}
              placeholder="Digite sua resposta aqui..."
              className="w-full px-4 py-4 text-sm text-gray-800 outline-none rounded-xl"
              autoFocus
            />
          )}
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-primary border-2 border-primary text-sm">
              <ArrowLeft size={17} /> Anterior
            </button>
          )}
          <button onClick={handleNext} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-60"
            style={{ backgroundColor: '#4F46E5' }}>
            {saving ? 'Gerando...' : isLast ? '✨ Gerar Pregacao' : 'Proximo'}
            {!saving && !isLast && <ArrowRight size={17} />}
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 20 : 8,
                backgroundColor: i < step ? '#10B981' : i === step ? '#4F46E5' : '#E5E7EB',
              }} />
          ))}
        </div>
      </div>
    </div>
  )
}
