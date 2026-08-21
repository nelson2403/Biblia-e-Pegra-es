'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  TRADUCOES_OFFLINE, baixarPendentes, jaBaixados, limpar, espacoUsado,
  suportaOffline, type Progresso,
} from '@/lib/offline'
import { usePreferencias } from '@/hooks/usePreferencias'

const CHAVE_ESCOLHA = 'offline_traducoes'

/** Quais traduções o usuário quer manter no aparelho. */
function lerEscolha(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(CHAVE_ESCOLHA) ?? '[]')
  } catch {
    return []
  }
}

export function useOffline() {
  const { prefs, salvar } = usePreferencias()
  const [suportado, setSuportado] = useState(false)
  const [baixados, setBaixados] = useState<Set<string>>(new Set())
  const [escolhidos, setEscolhidos] = useState<string[]>([])
  const [progresso, setProgresso] = useState<Progresso | null>(null)
  const [espaco, setEspaco] = useState<number | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const jaCompletou = useRef(false)

  const atualizar = useCallback(async () => {
    setBaixados(await jaBaixados())
    setEspaco(await espacoUsado())
  }, [])

  useEffect(() => {
    setSuportado(suportaOffline())
    setEscolhidos(lerEscolha())
    atualizar()
  }, [atualizar])

  const baixar = useCallback(
    async (ids: string[]) => {
      setErro(null)
      localStorage.setItem(CHAVE_ESCOLHA, JSON.stringify(ids))
      setEscolhidos(ids)

      const { falhas } = await baixarPendentes(ids, setProgresso)
      setProgresso(null)
      if (falhas.length) setErro(`Não consegui baixar: ${falhas.join(', ')}. Tente de novo.`)
      await atualizar()
    },
    [atualizar]
  )

  /**
   * Completa o que ficou pendente quando o app abre com internet.
   * Roda uma vez por sessão e em silêncio: se a pessoa já escolheu manter uma
   * tradução offline, ela não precisa pedir de novo a cada atualização.
   */
  useEffect(() => {
    if (!suportado || jaCompletou.current) return
    if (!prefs.offline_auto) return

    const alvos = lerEscolha()
    if (alvos.length === 0) return
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return

    jaCompletou.current = true
    baixarPendentes(alvos)
      .then(({ baixados: n }) => { if (n > 0) atualizar() })
      .catch(() => {})
  }, [suportado, prefs.offline_auto, atualizar])

  const remover = useCallback(async () => {
    await limpar()
    localStorage.setItem(CHAVE_ESCOLHA, '[]')
    setEscolhidos([])
    await atualizar()
  }, [atualizar])

  const tudoBaixado =
    escolhidos.length > 0 && escolhidos.every(id => baixados.has(id))

  const mbPendentes = TRADUCOES_OFFLINE
    .filter(t => escolhidos.includes(t.id) && !baixados.has(t.id))
    .reduce((s, t) => s + t.mb, 0)

  return {
    suportado,
    traducoes: TRADUCOES_OFFLINE,
    baixados,
    escolhidos,
    progresso,
    espaco,
    erro,
    tudoBaixado,
    mbPendentes,
    autoAtualizar: prefs.offline_auto !== false,
    definirAuto: (v: boolean) => salvar({ offline_auto: v }),
    baixar,
    remover,
  }
}
