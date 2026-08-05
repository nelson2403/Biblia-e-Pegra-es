'use client'
import { useState, useEffect } from 'react'
import {
  Headphones, Play, Pause, Square, SkipBack, SkipForward, Settings2, X, Check,
} from 'lucide-react'
import { useLeitor, BlocoLeitura } from '@/hooks/useLeitor'
import { usePreferencias } from '@/hooks/usePreferencias'

const VELOCIDADES = [0.7, 0.85, 1, 1.15, 1.3, 1.5, 1.75, 2]

interface Props {
  blocos: BlocoLeitura[]
  /** Aparece no player para a pessoa saber o que está sendo lido. */
  titulo: string
  /** Recebe o id do trecho sendo lido — use para destacar o texto na tela. */
  onBlocoAtual?: (id: string | null) => void
  /** Começa a leitura por este trecho quando o usuário aperta play. */
  iniciarEm?: string
  /** Sobe o player em N pixels — usado quando outra barra fixa ocupa a base da tela. */
  deslocamento?: number
}

/**
 * Leitor de áudio para quem tem deficiência visual ou prefere ouvir.
 * Usa as vozes do próprio aparelho (Web Speech API): funciona offline e sem custo.
 */
export function LeitorAudio({ blocos, titulo, onBlocoAtual, iniciarEm, deslocamento = 0 }: Props) {
  const leitor = useLeitor(blocos)
  const { prefs, salvar } = usePreferencias()
  const [aberto, setAberto] = useState(false)
  const [config, setConfig] = useState(false)

  useEffect(() => { onBlocoAtual?.(leitor.blocoAtual) }, [leitor.blocoAtual, onBlocoAtual])

  // Uma vez tocando, o player expandido fica visível.
  useEffect(() => { if (leitor.estado !== 'parado') setAberto(true) }, [leitor.estado])

  if (!leitor.suportado || blocos.length === 0) return null

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

  const mudarVoz = (uri: string) => {
    leitor.setVoz(uri)
    salvar({ tts_voz: uri })
  }

  // Botão flutuante enquanto ninguém pediu para ouvir.
  if (!aberto) {
    return (
      <button
        onClick={() => { setAberto(true); leitor.ler(iniciarEm) }}
        aria-label={`Ouvir ${titulo} em voz alta`}
        className="fixed right-4 bottom-20 md:bottom-6 z-40 flex items-center gap-2 pl-4 pr-5 py-3 rounded-full text-white font-bold text-sm shadow-lg active:scale-95 transition-all"
        style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', marginBottom: deslocamento }}
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
        className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-60 z-40 bg-white border-t border-gray-200 shadow-2xl"
        style={{ marginBottom: deslocamento }}
      >
        {/* Barra de progresso */}
        <div className="h-1 bg-gray-100" aria-hidden="true">
          <div
            className="h-1 transition-all duration-300"
            style={{ width: `${leitor.progresso}%`, background: 'linear-gradient(90deg, #4F46E5, #7C3AED)' }}
          />
        </div>

        <div className="px-4 py-2.5 flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#7C3AED' }}>
              {tocando ? 'Ouvindo agora' : parado ? 'Leitor de áudio' : 'Pausado'}
            </p>
            <p className="text-sm font-bold text-gray-800 truncate">{titulo}</p>
          </div>

          <button
            onClick={leitor.anterior}
            disabled={parado}
            aria-label="Trecho anterior"
            className="p-2.5 rounded-xl hover:bg-gray-100 disabled:opacity-30"
          >
            <SkipBack size={20} color="#4B5563" />
          </button>

          <button
            onClick={alternar}
            aria-label={tocando ? 'Pausar leitura' : parado ? 'Iniciar leitura' : 'Continuar leitura'}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md active:scale-95 transition-transform flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            {tocando ? <Pause size={22} fill="#fff" /> : <Play size={22} fill="#fff" style={{ marginLeft: 2 }} />}
          </button>

          <button
            onClick={leitor.proximo}
            disabled={parado}
            aria-label="Próximo trecho"
            className="p-2.5 rounded-xl hover:bg-gray-100 disabled:opacity-30"
          >
            <SkipForward size={20} color="#4B5563" />
          </button>

          <button
            onClick={() => setConfig(true)}
            aria-label="Ajustes de voz e velocidade"
            className="p-2.5 rounded-xl hover:bg-gray-100"
          >
            <Settings2 size={19} color="#4B5563" />
          </button>

          <button
            onClick={() => { leitor.parar(); setAberto(false) }}
            aria-label="Fechar leitor de áudio"
            className="p-2.5 rounded-xl hover:bg-red-50"
          >
            <Square size={17} color="#EF4444" fill="#EF4444" />
          </button>
        </div>
      </div>

      {/* Ajustes */}
      {config && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setConfig(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Ajustes do leitor"
        >
          <div
            className="bg-white w-full max-w-lg rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-gray-800 text-base">Ajustes de leitura</h3>
              <button onClick={() => setConfig(false)} aria-label="Fechar ajustes" className="p-1.5 text-gray-400">
                <X size={20} />
              </button>
            </div>

            <p className="text-sm font-bold text-gray-700 mb-2">Velocidade</p>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {VELOCIDADES.map(v => {
                const ativo = Math.abs(leitor.velocidade - v) < 0.01
                return (
                  <button
                    key={v}
                    onClick={() => mudarVelocidade(v)}
                    aria-pressed={ativo}
                    className="py-2.5 rounded-xl text-sm font-bold transition-colors"
                    style={{
                      backgroundColor: ativo ? '#4F46E5' : '#F3F4F6',
                      color: ativo ? '#fff' : '#4B5563',
                    }}
                  >
                    {v}×
                  </button>
                )
              })}
            </div>

            <p className="text-sm font-bold text-gray-700 mb-1">Voz</p>
            <p className="text-xs text-gray-400 mb-3">
              As vozes vêm do seu aparelho. Se a lista estiver pequena, instale vozes em português nas
              configurações do celular.
            </p>
            <div className="flex flex-col gap-2 pb-4">
              {leitor.vozes.length === 0 && (
                <p className="text-sm text-gray-400 py-3">Nenhuma voz encontrada neste aparelho.</p>
              )}
              {leitor.vozes.map(v => {
                const ativo = leitor.vozURI === v.voiceURI
                return (
                  <button
                    key={v.voiceURI}
                    onClick={() => mudarVoz(v.voiceURI)}
                    aria-pressed={ativo}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all"
                    style={{
                      backgroundColor: ativo ? '#EEF2FF' : '#F9FAFB',
                      border: ativo ? '2px solid #4F46E5' : '2px solid transparent',
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate" style={{ color: ativo ? '#4F46E5' : '#1F2937' }}>
                        {v.name}
                      </p>
                      <p className="text-xs text-gray-400">{v.lang}</p>
                    </div>
                    {ativo && <Check size={18} color="#4F46E5" />}
                  </button>
                )
              })}
            </div>

            {prefs.tts_velocidade !== leitor.velocidade && (
              <p className="text-xs text-gray-400 text-center pb-2">Suas escolhas ficam salvas no perfil.</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
