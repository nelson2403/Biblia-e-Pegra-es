'use client'
import { useState } from 'react'
import {
  Bell, BellOff, Clock, Sun, BookOpen, Send, Loader2, Type, Contrast,
  Headphones, Volume2, Check, AlertCircle, Moon, SunMedium, SmartphoneNfc,
} from 'lucide-react'
import { usePush } from '@/hooks/usePush'
import { usePreferencias } from '@/hooks/usePreferencias'
import { useTema } from '@/contexts/TemaContext'

const HORAS = Array.from({ length: 24 }, (_, h) => h)
const VELOCIDADES = [0.7, 0.85, 1, 1.15, 1.3, 1.5]

function Interruptor({
  ligado, aoMudar, rotulo, descricao, Icone, cor = 'var(--accent)', desabilitado,
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
      <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: ligado ? 'var(--accent-soft)' : 'var(--surface-2)' }}>
        <Icone size={18} color={ligado ? cor : 'var(--text-faint)'} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-conteudo">{rotulo}</p>
        {descricao && <p className="text-xs text-conteudo-faint leading-snug">{descricao}</p>}
      </div>
      <button
        role="switch"
        aria-checked={ligado}
        aria-label={rotulo}
        disabled={desabilitado}
        onClick={() => aoMudar(!ligado)}
        className="relative w-12 h-7 rounded-full transition-colors flex-shrink-0 disabled:opacity-40"
        style={{ backgroundColor: ligado ? cor : 'var(--border-strong)' }}
      >
        <span
          className="absolute top-1 w-5 h-5 rounded-full bg-surface shadow transition-all"
          style={{ left: ligado ? 26 : 4 }}
        />
      </button>
    </div>
  )
}

export function ConfiguracoesApp() {
  const push = usePush()
  const { prefs, salvar } = usePreferencias()
  const { tema, efetivo, definirTema } = useTema()
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
          className="rounded-2xl px-4 py-3 text-sm font-semibold flex items-start gap-2"
          style={{
            backgroundColor: mensagem.tipo === 'ok' ? 'var(--success-soft)' : 'var(--danger-soft)',
            color: mensagem.tipo === 'ok' ? 'var(--success)' : 'var(--danger)',
          }}
        >
          {mensagem.tipo === 'ok' ? <Check size={16} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />}
          <span>{mensagem.texto}</span>
        </div>
      )}

      {/* ── Notificações ───────────────────────────── */}
      <section id="notificacoes" className="bg-surface rounded-2xl shadow-cartao p-4 scroll-mt-4">
        <h2 className="text-xs font-bold text-conteudo-faint uppercase tracking-wider mb-1">Palavra do dia</h2>
        <p className="text-xs text-conteudo-faint mb-2">
          Receba um versículo e um estudo novo todos os dias, direto no seu celular.
        </p>

        {!push.suportado ? (
          <div className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: 'var(--gold-soft)', color: 'var(--gold)' }}>
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
                <div className="h-px bg-surface-2 my-1" />

                <div className="flex items-center gap-3 py-3">
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--accent-soft)' }}>
                    <Clock size={18} color="var(--accent)" aria-hidden="true" />
                  </div>
                  <label htmlFor="hora-notificacao" className="flex-1 text-sm font-semibold text-conteudo">
                    Horário
                  </label>
                  <select
                    id="hora-notificacao"
                    value={prefs.notif_hora}
                    onChange={e => salvar({ notif_hora: parseInt(e.target.value, 10) })}
                    className="rounded-2xl px-3 py-2 text-sm font-bold text-conteudo outline-none focus:ring-2 focus:ring-primary"
                  >
                    {HORAS.map(h => (
                      <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>
                    ))}
                  </select>
                </div>

                <div className="h-px bg-surface-2 my-1" />

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
                  className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold disabled:opacity-50"
                  style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
                >
                  {enviandoTeste ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {enviandoTeste ? 'Enviando...' : 'Enviar notificação de teste'}
                </button>
              </>
            )}
          </>
        )}
      </section>

      {/* ── Aparência ──────────────────────────────── */}
      <section id="aparencia" className="bg-surface rounded-2xl shadow-cartao p-4 scroll-mt-4">
        <h2 className="text-xs font-bold text-conteudo-faint uppercase tracking-wider mb-1">Aparência</h2>
        <p className="text-xs text-conteudo-faint mb-3">
          O modo escuro cansa menos a vista para ler à noite.
        </p>

        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Tema do aplicativo">
          {([
            { valor: 'claro', rotulo: 'Claro', Icone: SunMedium },
            { valor: 'escuro', rotulo: 'Escuro', Icone: Moon },
            { valor: 'automatico', rotulo: 'Automático', Icone: SmartphoneNfc },
          ] as const).map(({ valor, rotulo, Icone }) => {
            const ativo = tema === valor
            return (
              <button
                key={valor}
                onClick={() => definirTema(valor)}
                aria-pressed={ativo}
                className="flex flex-col items-center gap-2 py-3.5 rounded-2xl transition-colors"
                style={{
                  backgroundColor: ativo ? 'var(--accent-soft)' : 'var(--surface-2)',
                  boxShadow: ativo ? '0 0 0 2px var(--accent)' : 'none',
                  color: ativo ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                <Icone size={20} aria-hidden="true" />
                <span className="text-xs font-bold">{rotulo}</span>
              </button>
            )
          })}
        </div>

        {tema === 'automatico' && (
          <p className="text-xs text-conteudo-faint mt-3">
            Seguindo o seu celular — agora está no modo {efetivo}.
          </p>
        )}
      </section>

      {/* ── Acessibilidade ─────────────────────────── */}
      <section id="acessibilidade" className="bg-surface rounded-2xl shadow-cartao p-4 scroll-mt-4">
        <h2 className="text-xs font-bold text-conteudo-faint uppercase tracking-wider mb-1">Acessibilidade</h2>
        <p className="text-xs text-conteudo-faint mb-2">
          Deixe o app do jeito que é mais fácil para você ler e ouvir.
        </p>

        <Interruptor
          ligado={prefs.fonte_grande}
          aoMudar={v => salvar({ fonte_grande: v })}
          rotulo="Texto maior"
          descricao="Aumenta o tamanho das letras em todo o app"
          Icone={Type}
        />
        <div className="h-px bg-surface-2 my-1" />
        <Interruptor
          ligado={prefs.alto_contraste}
          aoMudar={v => salvar({ alto_contraste: v })}
          rotulo="Alto contraste"
          descricao="Cores mais fortes para enxergar melhor"
          Icone={Contrast}
        />

        <div className="h-px bg-surface-2 my-3" />

        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--accent-soft)' }}>
            <Headphones size={18} color="var(--accent)" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-conteudo">Leitor de áudio</p>
            <p className="text-xs text-conteudo-faint leading-snug">
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
                className="py-2.5 rounded-2xl text-sm font-bold transition-colors"
                style={{ backgroundColor: ativo ? 'var(--accent)' : 'var(--surface-2)', color: ativo ? '#fff' : 'var(--text-muted)' }}
              >
                {v}×
              </button>
            )
          })}
        </div>

        <button
          onClick={ouvirAmostra}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold"
          style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
        >
          <Volume2 size={16} aria-hidden="true" /> Ouvir uma amostra
        </button>

        <p className="text-xs text-conteudo-faint mt-3 leading-relaxed">
          Para escolher outra voz, toque em <strong>Ouvir</strong> em qualquer texto e abra os ajustes
          do leitor. As vozes vêm do seu próprio aparelho.
        </p>
      </section>
    </div>
  )
}
