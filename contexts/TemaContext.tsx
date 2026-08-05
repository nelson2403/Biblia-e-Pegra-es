'use client'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type Tema = 'claro' | 'escuro' | 'automatico'

const CHAVE = 'tema_app'

interface TemaContextData {
  /** O que o usuário escolheu. */
  tema: Tema
  /** O que está de fato na tela agora (resolve o 'automatico'). */
  efetivo: 'claro' | 'escuro'
  definirTema: (t: Tema) => void
}

const TemaContext = createContext<TemaContextData>({
  tema: 'automatico',
  efetivo: 'claro',
  definirTema: () => {},
})

/**
 * Roda antes da primeira pintura para o app não abrir claro e "piscar" para o escuro.
 * Precisa ser string: vai inline no <head>, antes de qualquer JavaScript do React.
 */
export const SCRIPT_ANTI_FLASH = `
(function(){
  try {
    var escolha = localStorage.getItem('${CHAVE}') || 'automatico';
    var escuro = escolha === 'escuro' ||
      (escolha === 'automatico' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var raiz = document.documentElement;
    raiz.setAttribute('data-tema', escuro ? 'escuro' : 'claro');
    raiz.style.colorScheme = escuro ? 'dark' : 'light';

    var prefs = localStorage.getItem('preferencias_app');
    if (prefs) {
      var p = JSON.parse(prefs);
      if (p.fonte_grande) raiz.setAttribute('data-fonte', 'grande');
      if (p.alto_contraste) raiz.setAttribute('data-contraste', 'alto');
    }
  } catch (e) {}
})();
`

function resolver(escolha: Tema): 'claro' | 'escuro' {
  if (escolha !== 'automatico') return escolha
  if (typeof window === 'undefined') return 'claro'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
}

function aplicar(efetivo: 'claro' | 'escuro') {
  const raiz = document.documentElement
  // Sem a trava, trocar o tema anima centenas de elementos ao mesmo tempo.
  raiz.classList.add('trocando-tema')
  raiz.setAttribute('data-tema', efetivo)
  raiz.style.colorScheme = efetivo === 'escuro' ? 'dark' : 'light'

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', efetivo === 'escuro' ? '#0a0a0d' : '#f6f6f8')

  window.setTimeout(() => raiz.classList.remove('trocando-tema'), 60)
}

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<Tema>('automatico')
  const [efetivo, setEfetivo] = useState<'claro' | 'escuro'>('claro')

  useEffect(() => {
    const salvo = (localStorage.getItem(CHAVE) as Tema | null) ?? 'automatico'
    setTema(salvo)
    setEfetivo(resolver(salvo))
  }, [])

  // No modo automático, acompanha a troca de tema do sistema em tempo real.
  useEffect(() => {
    if (tema !== 'automatico') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const aoMudar = () => {
      const novo = mq.matches ? 'escuro' : 'claro'
      setEfetivo(novo)
      aplicar(novo)
    }
    mq.addEventListener('change', aoMudar)
    return () => mq.removeEventListener('change', aoMudar)
  }, [tema])

  const definirTema = useCallback((novo: Tema) => {
    setTema(novo)
    localStorage.setItem(CHAVE, novo)
    const resolvido = resolver(novo)
    setEfetivo(resolvido)
    aplicar(resolvido)
  }, [])

  return (
    <TemaContext.Provider value={{ tema, efetivo, definirTema }}>
      {children}
    </TemaContext.Provider>
  )
}

export function useTema() {
  return useContext(TemaContext)
}
