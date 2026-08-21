'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { WifiOff, Download, X, Loader2, Check } from 'lucide-react'
import { useOffline } from '@/hooks/useOffline'

const CHAVE_DISPENSADO = 'convite_offline_dispensado'

/**
 * Oferece o download da Bíblia na primeira vez que a pessoa abre o app.
 * Aparece uma vez; se dispensado, só volta depois de 60 dias — e a opção
 * continua disponível no Perfil a qualquer momento.
 */
export function ConviteOffline() {
  const off = useOffline()
  const [visivel, setVisivel] = useState(false)
  const [pronto, setPronto] = useState(false)

  useEffect(() => {
    if (!off.suportado) return
    // Já escolheu alguma tradução? Então não precisa ser convidado.
    if (off.escolhidos.length > 0) return

    const quando = Number(localStorage.getItem(CHAVE_DISPENSADO) ?? 0)
    if (quando && Date.now() - quando < 60 * 86400000) return

    // Espera a pessoa se situar na tela antes de interromper.
    const t = setTimeout(() => setVisivel(true), 6000)
    return () => clearTimeout(t)
  }, [off.suportado, off.escolhidos.length])

  const dispensar = () => {
    localStorage.setItem(CHAVE_DISPENSADO, String(Date.now()))
    setVisivel(false)
  }

  const baixarPadrao = async () => {
    // Só a tradução padrão: 3,8 MB é um pedido honesto para um primeiro contato.
    await off.baixar(['aa'])
    setPronto(true)
    setTimeout(() => setVisivel(false), 2200)
  }

  if (!visivel) return null

  const baixando = off.progresso !== null

  return (
    <div
      role="dialog"
      aria-label="Usar o app sem internet"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-24 sm:pb-4"
      style={{ backgroundColor: 'rgba(0,0,0,.6)' }}
      onClick={() => { if (!baixando) dispensar() }}
    >
      <div
        className="bg-surface w-full max-w-sm rounded-[28px] p-6 shadow-alto"
        onClick={e => e.stopPropagation()}
      >
        {pronto ? (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--success-soft)' }}>
              <Check size={26} style={{ color: 'var(--success)' }} strokeWidth={3} />
            </div>
            <p className="font-extrabold text-conteudo">Pronto!</p>
            <p className="text-sm text-conteudo-muted leading-relaxed">
              A Bíblia agora abre mesmo sem internet.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent-soft)' }}>
                <WifiOff size={22} className="text-primary" />
              </div>
              {!baixando && (
                <button onClick={dispensar} aria-label="Agora não" className="p-1 text-conteudo-faint">
                  <X size={20} />
                </button>
              )}
            </div>

            <h2 className="text-lg font-extrabold text-conteudo mb-2">
              Leve a Bíblia sem depender de internet
            </h2>
            <p className="text-sm text-conteudo-muted leading-relaxed mb-5">
              Dá para guardar a Bíblia no seu aparelho e ler em qualquer lugar — no ônibus,
              no sítio, num culto sem sinal. São <strong className="text-conteudo">3,8 MB</strong>,
              menos que uma música.
            </p>

            {baixando ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-conteudo">
                  <Loader2 size={16} className="animate-spin text-primary" />
                  Baixando… não feche o app
                </div>
                <div className="h-1.5 rounded-full overflow-hidden bg-surface-3">
                  <div className="h-1.5 rounded-full transition-all"
                    style={{
                      width: `${((off.progresso?.concluidos ?? 0) / Math.max(1, off.progresso?.total ?? 1)) * 100}%`,
                      backgroundColor: 'var(--accent)',
                    }} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button onClick={baixarPadrao} className="btn-primario">
                  <Download size={17} /> Baixar agora
                </button>
                <button onClick={dispensar} className="btn-secundario w-full">
                  Agora não
                </button>
                <Link
                  href="/perfil#offline"
                  onClick={dispensar}
                  className="text-center text-xs font-bold text-primary mt-1 py-1"
                >
                  Escolher outras traduções
                </Link>
              </div>
            )}

            <p className="text-[11px] text-conteudo-faint text-center mt-4 leading-relaxed">
              Você pode baixar, trocar ou apagar isso quando quiser, em Perfil.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
