'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'

/** Converte a chave VAPID (base64url) para o Uint8Array que o PushManager exige. */
function base64ParaUint8(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const normalizado = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const bruto = window.atob(normalizado)
  const saida = new Uint8Array(bruto.length)
  for (let i = 0; i < bruto.length; i++) saida[i] = bruto.charCodeAt(i)
  return saida
}

type Permissao = 'default' | 'granted' | 'denied' | 'indisponivel'

export function usePush() {
  const { session } = useAuth()
  const [suportado, setSuportado] = useState(false)
  const [permissao, setPermissao] = useState<Permissao>('indisponivel')
  const [inscrito, setInscrito] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const jaSincronizou = useRef(false)

  const token = session?.access_token

  useEffect(() => {
    const ok =
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    setSuportado(ok)
    if (ok) setPermissao(Notification.permission as Permissao)
  }, [])

  const registrarNoServidor = useCallback(
    async (subscription: PushSubscription) => {
      if (!token) throw new Error('Sessão expirada. Entre novamente.')
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error ?? 'Não foi possível salvar a inscrição.')
      }
    },
    [token]
  )

  // Ao abrir o app, reenvia a inscrição existente — cobre o caso do navegador
  // ter rotacionado o endpoint enquanto o app estava fechado.
  useEffect(() => {
    if (!suportado || !token || jaSincronizou.current) return
    if (Notification.permission !== 'granted') return
    jaSincronizou.current = true

    navigator.serviceWorker.ready
      .then(reg => reg.pushManager.getSubscription())
      .then(sub => {
        if (!sub) return
        setInscrito(true)
        return registrarNoServidor(sub)
      })
      .catch(() => {})
  }, [suportado, token, registrarNoServidor])

  const ativar = useCallback(async (): Promise<boolean> => {
    setErro(null)

    if (!suportado) {
      setErro('Seu navegador não suporta notificações. Instale o app na tela inicial e tente de novo.')
      return false
    }

    const chave = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!chave) {
      setErro('Chave de notificações não configurada no servidor.')
      return false
    }

    setCarregando(true)
    try {
      const resultado = await Notification.requestPermission()
      setPermissao(resultado as Permissao)

      if (resultado !== 'granted') {
        setErro(
          resultado === 'denied'
            ? 'As notificações foram bloqueadas. Libere nas configurações do navegador para este site.'
            : 'Permissão não concedida.'
        )
        return false
      }

      const reg = await navigator.serviceWorker.ready
      const existente = await reg.pushManager.getSubscription()
      const sub =
        existente ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64ParaUint8(chave) as BufferSource,
        }))

      await registrarNoServidor(sub)
      setInscrito(true)
      return true
    } catch (e: any) {
      setErro(e?.message ?? 'Erro ao ativar as notificações.')
      return false
    } finally {
      setCarregando(false)
    }
  }, [suportado, registrarNoServidor])

  const desativar = useCallback(async (): Promise<boolean> => {
    setErro(null)
    setCarregando(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()

      if (sub) {
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        }).catch(() => {})
        await sub.unsubscribe()
      }

      setInscrito(false)
      return true
    } catch (e: any) {
      setErro(e?.message ?? 'Erro ao desativar.')
      return false
    } finally {
      setCarregando(false)
    }
  }, [token])

  const enviarTeste = useCallback(async (): Promise<string | null> => {
    if (!token) return 'Sessão expirada.'
    const res = await fetch('/api/push/teste', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      return data?.error ?? 'Não foi possível enviar o teste.'
    }
    return null
  }, [token])

  return { suportado, permissao, inscrito, carregando, erro, ativar, desativar, enviarTeste }
}
