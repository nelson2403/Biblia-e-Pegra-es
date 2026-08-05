'use client'
import { useState } from 'react'
import {
  Bell, BellOff, Clock, Sun, BookOpen, Send, Loader2, Type, Contrast,
  Headphones, Volume2, Check, AlertCircle,
} from 'lucide-react'
import { usePush } from '@/hooks/usePush'
import { usePreferencias } from '@/hooks/usePreferencias'

const HORAS = Array.from({ length: 24 }, (_, h) => h)
const VELOCIDADES = [0.7, 0.85, 1, 1.15, 1.3, 1.5]

function Interruptor({
  ligado, aoMudar, rotulo, descricao, Icone, cor = '#4F46E5', desabilitado,
}: {
  ligado: boolean
  aoMudar: (v: boolean) => void
  rotulo: string
  descricao?: string
  Icone: typeof Bell
  cor?: string
  desabilitado?: boolean
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: ligado ? '#EEF2FF' : '#F3F4F6' }}>
        <Icone size={18} color={ligado ? cor : '#9CA3AF'} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{rotulo}</p>
        {descricao && <p className="text-xs text-gray-400 leading-snug">{descricao}</p>}
      </div>
      <button
        role="switch"
        aria-checked={ligado}
        aria-label={rotulo}
        disabled={desabilitado}
        onClick={() => aoMudar(!ligado)}
        className="relative w-12 h-7 rounded-full transition-colors flex-shrink-0 disabled:opacity-40"
        style={{ backgroundColor: ligado ? cor : '#D1D5DB' }}
      >
        <span
          className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all"
          style={{ left: ligado ? 26 : 4 }}
        />
      </button>
    </div>
  )
}

export function ConfiguracoesApp() {
  const push = usePush()
  const { prefs, salvar } = usePreferencias()
  const [mensagem, setMensagem] = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null)
  const [enviandoTeste, setEnviandoTeste] = useState(false)

  const notificacoesLigadas = prefs.notif_ativa && push.inscrito

  const alternarNotificacoes = async (ligar: boolean) => {
    setMensagem(null)
    if (ligar) {
      const ok = await push.ativar()
      if (!ok) {
        setMensagem({ tipo: 'erro', texto: push.erro ?? 'Não foi possível ativar.' })
        return
      }
      await salvar({ notif_ativa: true })
      setMensagem({ tipo: 'ok', texto: 'Pronto! Você vai receber a Palavra todo dia.' })
    } else {
      await push.desativar()
      await salvar({ notif_ativa: false })
      setMensagem({ tipo: 'ok', texto: 'Notificações desativadas.' })
    }
  }

  const testar = async () => {
    setEnviandoTeste(true)
    setMensagem(null)
    const erro = await push.enviarTeste()
    setEnviandoTeste(false)
    setMensagem(
      erro
        ? { tipo: 'erro', texto: erro }
        : { tipo: 'ok', texto: 'Enviamos uma notificação de teste. Confira o seu aparelho.' }
    )
  }

  /** Fala uma frase curta para a pessoa conferir voz e velocidade. */
  const ouvirAmostra = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(
      'O Senhor é o meu pastor, nada me faltará. Salmos, capítulo vinte e três.'
    )
    const voz = window.speechSynthesis.getVoices().find(v => v.voiceURI === prefs.tts_voz)
    if (voz) u.voice = voz
    u.lang = voz?.lang ?? 'pt-BR'
    u.rate = prefs.tts_velocidade
    window.speechSynthesis.speak(u)
  }

  return (
    <div className="flex flex-col gap-5">
      {mensagem && (
        <div
          role="status"
          className="rounded-xl px-4 py-3 text-sm font-semibold flex items-start gap-2"
          style={{
            backgroundColor: mensagem.tipo === 'ok' ? '#D1FAE5' : '#FEE2E2',
            color: mensagem.tipo === 'ok' ? '#065F46' : '#991B1B',
          }}
        >
          {mensagem.tipo === 'ok' ? <Check size={16} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />}
          <span>{mensagem.texto}</span>
        </div>
      )}

      {/* ── Notificações ───────────────────────────── */}
      <section id="notificacoes" className="bg-white rounded-2xl shadow-sm p-4 scroll-mt-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Palavra do dia</h2>
        <p className="text-xs text-gray-400 mb-2">
          Receba um versículo e um estudo novo todos os dias, direto no seu celular.
        </p>

        {!push.suportado ? (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: '#FFFBEB', color: '#92400E' }}>
            Este navegador não suporta notificações. Instale o app na tela inicial
            (menu do navegador → “Adicionar à tela inicial”) e volte aqui.
          </div>
        ) : (
          <>
            <Interruptor
              ligado={notificacoesLigadas}
              aoMudar={alternarNotificacoes}
              rotulo="Receber notificações"
              descricao={
                push.permissao === 'denied'
                  ? 'Bloqueadas no navegador — libere nas permissões do site'
                  : 'Um lembrete diário para se alimentar da Palavra'
              }
              Icone={notificacoesLigadas ? Bell : BellOff}
              desabilitado={push.carregando || push.permissao === 'denied'}
            />

            {notificacoesLigadas && (
              <>
                <div className="h-px bg-gray-100 my-1" />

                <div className="flex items-center gap-3 py-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#EEF2FF' }}>
                    <Clock size={18} color="#4F46E5" aria-hidden="true" />
                  </div>
                  <label htmlFor="hora-notificacao" className="flex-1 text-sm font-semibold text-gray-800">
                    Horário
                  </label>
                  <select
                    id="hora-notificacao"
                    value={prefs.notif_hora}
                    onChange={e => salvar({ notif_hora: parseInt(e.target.value, 10) })}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    {HORAS.map(h => (
                      <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>
                    ))}
                  </select>
                </div>

                <div className="h-px bg-gray-100 my-1" />

                <Interruptor
                  ligado={prefs.notif_versiculo}
                  aoMudar={v => salvar({ notif_versiculo: v })}
                  rotulo="Versículo do dia"
                  descricao="A Palavra que Deus separou para hoje"
                  Icone={Sun}
                />
                <Interruptor
                  ligado={prefs.notif_estudo}
                  aoMudar={v => salvar({ notif_estudo: v })}
                  rotulo="Estudo do dia"
                  descricao="Um estudo bíblico novo a cada dia"
                  Icone={BookOpen}
                />

                <button
                  onClick={testar}
                  disabled={enviandoTeste}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold disabled:opacity-50"
                  style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}
                >
                  {enviandoTeste ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {enviandoTeste ? 'Enviando...' : 'Enviar notificação de teste'}
                </button>
              </>
            )}
          </>
        )}
      </section>

      {/* ── Acessibilidade ─────────────────────────── */}
      <section id="acessibilidade" className="bg-white rounded-2xl shadow-sm p-4 scroll-mt-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Acessibilidade</h2>
        <p className="text-xs text-gray-400 mb-2">
          Deixe o app do jeito que é mais fácil para você ler e ouvir.
        </p>

        <Interruptor
          ligado={prefs.fonte_grande}
          aoMudar={v => salvar({ fonte_grande: v })}
          rotulo="Texto maior"
          descricao="Aumenta o tamanho das letras em todo o app"
          Icone={Type}
        />
        <div className="h-px bg-gray-100 my-1" />
        <Interruptor
          ligado={prefs.alto_contraste}
          aoMudar={v => salvar({ alto_contraste: v })}
          rotulo="Alto contraste"
          descricao="Cores mais fortes para enxergar melhor"
          Icone={Contrast}
        />

        <div className="h-px bg-gray-100 my-3" />

        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#EEF2FF' }}>
            <Headphones size={18} color="#4F46E5" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">Leitor de áudio</p>
            <p className="text-xs text-gray-400 leading-snug">
              Velocidade da voz que lê a Bíblia e os estudos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2 mb-3" role="group" aria-label="Velocidade da leitura">
          {VELOCIDADES.map(v => {
            const ativo = Math.abs(prefs.tts_velocidade - v) < 0.01
            return (
              <button
                key={v}
                onClick={() => salvar({ tts_velocidade: v })}
                aria-pressed={ativo}
                className="py-2.5 rounded-xl text-sm font-bold transition-colors"
                style={{ backgroundColor: ativo ? '#4F46E5' : '#F3F4F6', color: ativo ? '#fff' : '#4B5563' }}
              >
                {v}×
              </button>
            )
          })}
        </div>

        <button
          onClick={ouvirAmostra}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold"
          style={{ backgroundColor: '#F5F3FF', color: '#7C3AED' }}
        >
          <Volume2 size={16} aria-hidden="true" /> Ouvir uma amostra
        </button>

        <p className="text-xs text-gray-400 mt-3 leading-relaxed">
          Para escolher outra voz, toque em <strong>Ouvir</strong> em qualquer texto e abra os ajustes
          do leitor. As vozes vêm do seu próprio aparelho.
        </p>
      </section>
    </div>
  )
}
