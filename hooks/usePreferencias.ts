'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import type { Preferencias } from '@/types'

const PADRAO: Omit<Preferencias, 'user_id'> = {
  notif_ativa: true,
  notif_versiculo: true,
  notif_estudo: true,
  notif_hora: 7,
  tts_voz: null,
  tts_velocidade: 1.0,
  tts_voz_nuvem: 'pt-BR-Neural2-B',
  voz_natural: true,
  fonte_grande: false,
  alto_contraste: false,
}

const CHAVE_LOCAL = 'preferencias_app'

/** Lê o cache local — evita o app "piscar" sem as preferências enquanto o Supabase responde. */
function lerCache(): Omit<Preferencias, 'user_id'> {
  if (typeof window === 'undefined') return PADRAO
  try {
    const bruto = localStorage.getItem(CHAVE_LOCAL)
    return bruto ? { ...PADRAO, ...JSON.parse(bruto) } : PADRAO
  } catch {
    return PADRAO
  }
}

export function usePreferencias() {
  const { user } = useAuth()
  const [prefs, setPrefs] = useState<Omit<Preferencias, 'user_id'>>(PADRAO)
  const [carregando, setCarregando] = useState(true)
  const hidratou = useRef(false)

  // Cache local primeiro (síncrono, sem esperar a rede).
  useEffect(() => {
    if (hidratou.current) return
    hidratou.current = true
    setPrefs(lerCache())
  }, [])

  useEffect(() => {
    if (!user) return
    let cancelado = false

    supabase
      .from('preferencias')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelado) return
        if (data) {
          const { user_id: _ignorado, updated_at: _ts, ...resto } = data as Preferencias
          const valores = { ...PADRAO, ...resto }
          setPrefs(valores)
          localStorage.setItem(CHAVE_LOCAL, JSON.stringify(valores))
        }
        setCarregando(false)
      })

    return () => { cancelado = true }
  }, [user])

  /** Atualiza uma ou mais preferências. Aplica na hora e persiste em segundo plano. */
  const salvar = useCallback(
    async (mudancas: Partial<Omit<Preferencias, 'user_id'>>): Promise<string | null> => {
      const novo = { ...prefs, ...mudancas }
      setPrefs(novo)
      localStorage.setItem(CHAVE_LOCAL, JSON.stringify(novo))

      if (!user) return null

      const { error } = await supabase.from('preferencias').upsert(
        { user_id: user.id, ...novo, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )

      return error?.message ?? null
    },
    [prefs, user]
  )

  return { prefs, carregando, salvar }
}
