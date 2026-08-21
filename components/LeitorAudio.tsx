'use client'
import { useState, useEffect, useMemo } from 'react'
import {
  Headphones, Play, Pause, Square, SkipBack, SkipForward, Settings2, X, Check, Loader2, Sparkles,
  WifiOff, Download,
} from 'lucide-react'
import { useLeitor, BlocoLeitura } from '@/hooks/useLeitor'
import { useLeitorNuvem } from '@/hooks/useLeitorNuvem'
import { usePreferencias } from '@/hooks/usePreferencias'
import { useAudioOffline } from '@/hooks/useAudioOffline'

const VELOCIDADES = [0.7, 0.85, 1, 1.15, 1.3, 1.5, 1.75, 2]

const VOZES_NUVEM = [
  { id: 'pt-BR-Neural2-B', rotulo: 'Daniel', descricao: 'Masculina, serena' },
  { id: 'pt-BR-Neural2-C', rotulo: 'Ester', descricao: 'Feminina, clara' },
  { id: 'pt-BR-Neural2-A', rotulo: 'Ana', descricao: 'Feminina, suave' },
  { id: 'pt-BR-Wavenet-B', rotulo: 'Tiago', descricao: 'Masculina, firme' },
]

interface Props {
  blocos: BlocoLeitura[]
  titulo: string
  onBlocoAtual?: (id: string | null) => void
  iniciarEm?: string
  deslocamento?: number
}

/**
 * Leitor de áudio. Usa a voz neural da Google quando ela está configurada, e
 * cai para a voz do próprio aparelho quando não está — assim a leitura em voz
 * alta nunca deixa de funcionar, só muda a qualidade.
 */
export function LeitorAudio({ blocos, titulo, onBlocoAtual, iniciarEm, deslocamento = 0 }: Props) {
  const nuvem = useLeitorNuvem(blocos)
  const dispositivo = useLeitor(blocos)
  const { prefs, salvar } = usePreferencias()
  const audioOffline = useAudioOffline(blocos, nuvem.voz)
  const [aberto, setAberto] = useState(false)
  const [config, setConfig] = useState(false)

  // Só usa a nuvem se o servidor tiver a chave E o usuário não tiver desligado.
  const usandoNuvem = nuvem.disponivel === true && prefs.voz_natural !== false
  const leitor = usandoNuvem ? nuvem : dispositivo

  useEffect(() => { onBlocoAtual?.(leitor.blocoAtual) }, [leitor.blocoAtual, onBlocoAtual])
  useEffect(() => { if (leitor.estado !== 'parado') setAberto(true) }, [leitor.estado])

  // Ao trocar de motor, silencia o outro para não sobrepor as vozes.
  useEffect(() => {
    if (usandoNuvem) dispositivo.parar()
    else nuvem.parar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usandoNuvem])

  const suportado = usandoNuvem || dispositivo.suportado
  const carregando = usandoNuvem ? nuvem.carregando : false

  if (!suportado || blocos.length === 0) return null

  const tocando = leitor.estado === 'lendo'
  const parado = leitor.estado === 'parado'

  const alternar = () => {
    if (parado) leitor.ler(iniciarEm)
    else if (tocando) leitor.pausar()
    else leitor.retomar()
  }

  const mudarVelocidade = (v: number) => {
    leitor.setVelocidade(v)
    salvar({ tts_velocidade: v })
  }

  if (!aberto) {
    return (
      <button
        onClick={() => { setAberto(true); leitor.ler(iniciarEm) }}
        aria-label={`Ouvir ${titulo} em voz alta`}
        className="fixed right-4 bottom-28 md:bottom-6 z-40 flex items-center gap-2 pl-4 pr-5 py-3 rounded-full text-white font-bold text-sm shadow-alto active:scale-95 transition-all"
        style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', marginBottom: deslocamento }}
      >
        <Headphones size={20} aria-hidden="true" />
        Ouvir
      </button>
    )
  }

  return (
    <>
      <div
        role="region"
        aria-label="Leitor de áudio"
        className="fixed bottom-24 md:bottom-0 left-2 right-2 md:left-60 md:right-0 z-40 rounded-2xl md:rounded-none overflow-hidden barra-vidro md:border-x-0 md:border-b-0"
        style={{ marginBottom: deslocamento }}
      >
        <div className="h-1 bg-surface-2" aria-hidden="true">
          <div
            className="h-1 transition-all duration-300"
            style={{ width: `${leitor.progresso}%`, backgroundColor: 'var(--accent)' }}
          />
        </div>

        <div className="px-4 py-2.5 flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 text-primary">
              {usandoNuvem && <Sparkles size={10} aria-hidden="true" />}
              {carregando ? 'Preparando...' : tocando ? 'Ouvindo agora' : parado ? 'Leitor de áudio' : 'Pausado'}
            </p>
            <p className="text-sm font-bold text-conteudo truncate">{titulo}</p>
          </div>

          <button onClick={leitor.anterior} disabled={parado} aria-label="Trecho anterior"
            className="p-2.5 rounded-2xl hover:bg-surface-2 disabled:opacity-30">
            <SkipBack size={20} className="text-conteudo-muted" />
          </button>

          <button
            onClick={alternar}
            aria-label={tocando ? 'Pausar leitura' : parado ? 'Iniciar leitura' : 'Continuar leitura'}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-cartao active:scale-95 transition-transform flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))' }}
          >
            {carregando
              ? <Loader2 size={20} className="animate-spin" />
              : tocando
                ? <Pause size={22} fill="#fff" />
                : <Play size={22} fill="#fff" style={{ marginLeft: 2 }} />}
          </button>

          <button onClick={leitor.proximo} disabled={parado} aria-label="Próximo trecho"
            className="p-2.5 rounded-2xl hover:bg-surface-2 disabled:opacity-30">
            <SkipForward size={20} className="text-conteudo-muted" />
          </button>

          <button onClick={() => setConfig(true)} aria-label="Ajustes de voz e velocidade"
            className="p-2.5 rounded-2xl hover:bg-surface-2">
            <Settings2 size={19} className="text-conteudo-muted" />
          </button>

          <button onClick={() => { leitor.parar(); setAberto(false) }} aria-label="Fechar leitor de áudio"
            className="p-2.5 rounded-2xl hover:bg-perigo-soft">
            <Square size={17} className="text-perigo" fill="currentColor" />
          </button>
        </div>

        {usandoNuvem && nuvem.erro && (
          <p role="alert" className="px-4 pb-2 text-xs text-perigo">{nuvem.erro}</p>
        )}
      </div>

      {config && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          onClick={() => setConfig(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Ajustes do leitor"
        >
          <div className="bg-surface w-full max-w-lg rounded-t-[28px] p-5 max-h-[82vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-conteudo text-base">Ajustes de leitura</h3>
              <button onClick={() => setConfig(false)} aria-label="Fechar ajustes" className="p-1.5 text-conteudo-faint">
                <X size={20} />
              </button>
            </div>

            <p className="text-sm font-bold text-conteudo mb-2">Velocidade</p>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {VELOCIDADES.map(v => {
                const ativo = Math.abs(leitor.velocidade - v) < 0.01
                return (
                  <button key={v} onClick={() => mudarVelocidade(v)} aria-pressed={ativo}
                    className="py-2.5 rounded-2xl text-sm font-bold transition-colors"
                    style={{
                      backgroundColor: ativo ? 'var(--accent)' : 'var(--surface-2)',
                      color: ativo ? 'var(--accent-fg)' : 'var(--text-muted)',
                    }}>
                    {v}×
                  </button>
                )
              })}
            </div>

            {nuvem.disponivel && (
              <div className="flex items-center gap-3 py-3 mb-2 rounded-2xl px-4"
                style={{ backgroundColor: 'var(--accent-soft)' }}>
                <Sparkles size={18} className="text-primary flex-shrink-0" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-conteudo">Voz natural</p>
                  <p className="text-xs text-conteudo-muted leading-snug">
                    Bem mais humana que a voz do aparelho
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={usandoNuvem}
                  aria-label="Voz natural"
                  onClick={() => salvar({ voz_natural: !usandoNuvem })}
                  className="relative w-12 h-7 rounded-full transition-colors flex-shrink-0"
                  style={{ backgroundColor: usandoNuvem ? 'var(--accent)' : 'var(--border-strong)' }}
                >
                  <span className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all"
                    style={{ left: usandoNuvem ? 26 : 4 }} />
                </button>
              </div>
            )}

            {/* Guardar o áudio no aparelho */}
            {usandoNuvem && audioOffline.estado !== 'indisponivel' && (
              <div className="rounded-card p-4 mt-4" style={{ backgroundColor: 'var(--surface-2)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <WifiOff size={15} className="text-conteudo-muted" aria-hidden="true" />
                  <p className="text-sm font-bold text-conteudo">Ouvir sem internet</p>
                </div>

                {audioOffline.estado === 'guardado' ? (
                  <p className="text-xs text-conteudo-muted">
                    Áudio guardado no aparelho
                    {audioOffline.mb !== null && ` · ${audioOffline.mb} MB`}. Agora toca offline.
                  </p>
                ) : audioOffline.estado === 'baixando' ? (
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="h-1.5 rounded-full overflow-hidden bg-surface-3">
                      <div className="h-1.5 rounded-full transition-all"
                        style={{ width: `${audioOffline.progresso}%`, backgroundColor: 'var(--accent)' }} />
                    </div>
                    <p className="text-xs text-conteudo-muted tabular-nums">
                      Gerando o áudio… {audioOffline.progresso}%
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-conteudo-muted mb-3 leading-relaxed">
                      Baixe este texto em áudio para ouvir sem sinal. Cerca de{' '}
                      <strong className="text-conteudo">
                        {audioOffline.mbEstimados.toFixed(1)} MB
                      </strong>
                      {audioOffline.formato === 'opus' && ' (formato compacto)'}.
                    </p>
                    <button onClick={audioOffline.baixar} className="btn-secundario w-full">
                      <Download size={16} /> Baixar áudio
                    </button>
                  </>
                )}
              </div>
            )}

            <p className="text-sm font-bold text-conteudo mb-1 mt-4">Voz</p>

            {usandoNuvem ? (
              <>
                <p className="text-xs text-conteudo-faint mb-3">
                  Vozes neurais em português do Brasil.
                </p>
                <div className="flex flex-col gap-2 pb-4">
                  {VOZES_NUVEM.map(v => {
                    const ativo = nuvem.voz === v.id
                    return (
                      <button key={v.id} onClick={() => { nuvem.setVoz(v.id); salvar({ tts_voz_nuvem: v.id }) }}
                        aria-pressed={ativo}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all"
                        style={{
                          backgroundColor: ativo ? 'var(--accent-soft)' : 'var(--surface-2)',
                          boxShadow: ativo ? '0 0 0 2px var(--accent)' : 'none',
                        }}>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-conteudo">{v.rotulo}</p>
                          <p className="text-xs text-conteudo-muted">{v.descricao}</p>
                        </div>
                        {ativo && <Check size={18} className="text-primary" />}
                      </button>
                    )
                  })}
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-conteudo-faint mb-3">
                  Vozes do seu aparelho. Para ter mais opções, instale vozes em português nas
                  configurações do celular.
                </p>
                <div className="flex flex-col gap-2 pb-4">
                  {dispositivo.vozes.length === 0 && (
                    <p className="text-sm text-conteudo-faint py-3">Nenhuma voz encontrada.</p>
                  )}
                  {dispositivo.vozes.map(v => {
                    const ativo = dispositivo.vozURI === v.voiceURI
                    return (
                      <button key={v.voiceURI}
                        onClick={() => { dispositivo.setVoz(v.voiceURI); salvar({ tts_voz: v.voiceURI }) }}
                        aria-pressed={ativo}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all"
                        style={{
                          backgroundColor: ativo ? 'var(--accent-soft)' : 'var(--surface-2)',
                          boxShadow: ativo ? '0 0 0 2px var(--accent)' : 'none',
                        }}>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate text-conteudo">{v.name}</p>
                          <p className="text-xs text-conteudo-muted">{v.lang}</p>
                        </div>
                        {ativo && <Check size={18} className="text-primary" />}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
