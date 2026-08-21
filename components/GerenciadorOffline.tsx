'use client'
import { useState } from 'react'
import {
  Download, Check, Loader2, Trash2, WifiOff, HardDrive, AlertCircle, RefreshCw,
} from 'lucide-react'
import { useOffline } from '@/hooks/useOffline'

/** Painel de conteúdo offline, usado no Perfil. */
export function GerenciadorOffline() {
  const off = useOffline()
  const [selecao, setSelecao] = useState<string[] | null>(null)

  if (!off.suportado) {
    return (
      <section className="cartao p-4">
        <h2 className="text-xs font-bold text-conteudo-faint uppercase tracking-wider mb-1">
          Uso sem internet
        </h2>
        <p className="text-sm text-conteudo-muted">
          Este navegador não permite guardar conteúdo no aparelho. Instale o app na tela
          inicial para liberar o modo offline.
        </p>
      </section>
    )
  }

  // Enquanto o usuário não mexe, mostramos o que já está escolhido.
  const marcados = selecao ?? off.escolhidos
  const baixando = off.progresso !== null

  const alternar = (id: string) => {
    setSelecao(atual => {
      const base = atual ?? off.escolhidos
      return base.includes(id) ? base.filter(x => x !== id) : [...base, id]
    })
  }

  const mbSelecionados = off.traducoes
    .filter(t => marcados.includes(t.id) && !off.baixados.has(t.id))
    .reduce((s, t) => s + t.mb, 0)

  return (
    <section id="offline" className="cartao p-4 scroll-mt-4">
      <div className="flex items-center gap-2 mb-1">
        <WifiOff size={15} className="text-primary" aria-hidden="true" />
        <h2 className="text-xs font-bold text-conteudo-faint uppercase tracking-wider">
          Uso sem internet
        </h2>
      </div>
      <p className="text-xs text-conteudo-faint mb-3 leading-relaxed">
        Guarde a Bíblia no aparelho e leia em qualquer lugar, mesmo sem sinal ou dados.
      </p>

      <div className="flex flex-col gap-2 mb-4">
        {off.traducoes.map(t => {
          const pronto = off.baixados.has(t.id)
          const marcado = marcados.includes(t.id)

          return (
            <button
              key={t.id}
              onClick={() => alternar(t.id)}
              disabled={baixando}
              aria-pressed={marcado}
              className="flex items-center gap-3 p-3 rounded-2xl text-left transition-colors disabled:opacity-60"
              style={{ backgroundColor: marcado ? 'var(--accent-soft)' : 'var(--surface-2)' }}
            >
              <span
                className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: marcado ? 'var(--accent)' : 'transparent',
                  boxShadow: marcado ? 'none' : '0 0 0 1.5px var(--border-strong)',
                }}
              >
                {marcado && <Check size={12} color="#fff" strokeWidth={3} />}
              </span>

              <span className="flex-1 min-w-0">
                <span className="block text-sm font-bold text-conteudo">{t.nome}</span>
                <span className="block text-[11px] text-conteudo-muted">{t.descricao}</span>
              </span>

              {pronto ? (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0"
                  style={{ backgroundColor: 'var(--success-soft)', color: 'var(--success)' }}
                >
                  <Check size={9} strokeWidth={3} /> no aparelho
                </span>
              ) : (
                <span className="text-[11px] text-conteudo-faint tabular-nums flex-shrink-0">
                  {t.mb} MB
                </span>
              )}
            </button>
          )
        })}
      </div>

      {baixando ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-conteudo">
            <Loader2 size={16} className="animate-spin text-primary" />
            <span className="flex-1 truncate">Baixando {off.progresso?.atual}…</span>
            <span className="text-xs text-conteudo-faint tabular-nums">
              {off.progresso?.concluidos}/{off.progresso?.total}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden bg-surface-3">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${((off.progresso?.concluidos ?? 0) / Math.max(1, off.progresso?.total ?? 1)) * 100}%`,
                backgroundColor: 'var(--accent)',
              }}
            />
          </div>
          <p className="text-[11px] text-conteudo-faint">
            Não feche o app enquanto baixa.
          </p>
        </div>
      ) : (
        <button
          onClick={() => { off.baixar(marcados); setSelecao(null) }}
          disabled={marcados.length === 0 || mbSelecionados === 0}
          className="btn-primario"
        >
          {mbSelecionados === 0 ? (
            <><Check size={17} /> Tudo já está no aparelho</>
          ) : (
            <><Download size={17} /> Baixar {mbSelecionados.toFixed(1)} MB</>
          )}
        </button>
      )}

      {off.erro && (
        <p role="alert" className="flex items-start gap-2 mt-3 text-xs font-semibold px-3 py-2 rounded-2xl"
          style={{ backgroundColor: 'var(--danger-soft)', color: 'var(--danger)' }}>
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          {off.erro}
        </p>
      )}

      <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <RefreshCw size={16} className="text-conteudo-muted flex-shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-conteudo">Completar sozinho</p>
          <p className="text-[11px] text-conteudo-muted leading-snug">
            Ao abrir com internet, baixa o que ficou faltando
          </p>
        </div>
        <button
          role="switch"
          aria-checked={off.autoAtualizar}
          aria-label="Completar downloads automaticamente"
          onClick={() => off.definirAuto(!off.autoAtualizar)}
          className="relative w-12 h-7 rounded-full transition-colors flex-shrink-0"
          style={{ backgroundColor: off.autoAtualizar ? 'var(--accent)' : 'var(--border-strong)' }}
        >
          <span className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all"
            style={{ left: off.autoAtualizar ? 26 : 4 }} />
        </button>
      </div>

      {off.espaco !== null && (
        <div className="flex items-center justify-between mt-3">
          <span className="flex items-center gap-1.5 text-[11px] text-conteudo-faint">
            <HardDrive size={12} /> {off.espaco} MB usados no aparelho
          </span>
          {off.baixados.size > 0 && (
            <button
              onClick={() => { if (confirm('Apagar o conteúdo baixado?')) off.remover() }}
              className="flex items-center gap-1 text-[11px] font-bold text-perigo"
            >
              <Trash2 size={11} /> Apagar
            </button>
          )}
        </div>
      )}
    </section>
  )
}
