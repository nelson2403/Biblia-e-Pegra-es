'use client'
import { useEffect } from 'react'
import { usePreferencias } from '@/hooks/usePreferencias'

/**
 * Aplica as preferências de acessibilidade no documento inteiro.
 * As regras visuais correspondentes estão em app/globals.css.
 */
export function AcessibilidadeGlobal() {
  const { prefs } = usePreferencias()

  useEffect(() => {
    const raiz = document.documentElement
    raiz.dataset.fonte = prefs.fonte_grande ? 'grande' : 'normal'
    raiz.dataset.contraste = prefs.alto_contraste ? 'alto' : 'normal'
  }, [prefs.fonte_grande, prefs.alto_contraste])

  return null
}
