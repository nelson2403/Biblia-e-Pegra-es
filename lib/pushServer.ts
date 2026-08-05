import webpush from 'web-push'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

let configurado = false

function configurar() {
  if (configurado) return

  const publica = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privada = process.env.VAPID_PRIVATE_KEY
  const contato = process.env.VAPID_SUBJECT || 'mailto:contato@bibliapregacoes.app'

  if (!publica || !privada) {
    throw new Error('Faltam NEXT_PUBLIC_VAPID_PUBLIC_KEY e/ou VAPID_PRIVATE_KEY.')
  }

  webpush.setVapidDetails(contato, publica, privada)
  configurado = true
}

export interface PayloadNotificacao {
  titulo: string
  corpo: string
  url?: string
  tag?: string
}

interface Inscricao {
  id: string
  endpoint: string
  p256dh: string
  auth: string
}

export interface ResultadoEnvio {
  enviadas: number
  removidas: number
  falhas: number
}

/**
 * Envia a notificação para todas as inscrições ativas cujos donos aceitam esse tipo de aviso.
 * Inscrições mortas (404/410) são apagadas para a base não crescer com lixo.
 */
export async function enviarParaTodos(
  payload: PayloadNotificacao,
  filtro?: { hora?: number; tipo?: 'versiculo' | 'estudo' }
): Promise<ResultadoEnvio> {
  configurar()
  const admin = getSupabaseAdmin()

  // Quem desligou as notificações (ou este tipo) não recebe.
  let prefs = admin.from('preferencias').select('user_id').eq('notif_ativa', true)
  if (filtro?.hora !== undefined) prefs = prefs.eq('notif_hora', filtro.hora)
  if (filtro?.tipo === 'versiculo') prefs = prefs.eq('notif_versiculo', true)
  if (filtro?.tipo === 'estudo') prefs = prefs.eq('notif_estudo', true)

  const { data: usuariosOptIn, error: erroPrefs } = await prefs
  if (erroPrefs) throw new Error(`Erro ao ler preferências: ${erroPrefs.message}`)

  const permitidos = new Set((usuariosOptIn ?? []).map(p => p.user_id as string))
  if (permitidos.size === 0) return { enviadas: 0, removidas: 0, falhas: 0 }

  const { data: inscricoes, error } = await admin
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth, user_id')
    .eq('ativo', true)
    .in('user_id', Array.from(permitidos))

  if (error) throw new Error(`Erro ao ler inscrições: ${error.message}`)
  if (!inscricoes?.length) return { enviadas: 0, removidas: 0, falhas: 0 }

  const corpoJson = JSON.stringify(payload)
  const mortas: string[] = []
  let enviadas = 0
  let falhas = 0

  // Em lotes para não estourar limites dos serviços de push.
  const LOTE = 50
  for (let i = 0; i < inscricoes.length; i += LOTE) {
    const lote = inscricoes.slice(i, i + LOTE) as Inscricao[]
    const resultados = await Promise.allSettled(
      lote.map(s =>
        webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          corpoJson,
          { TTL: 60 * 60 * 12, urgency: 'normal' }
        )
      )
    )

    resultados.forEach((r, idx) => {
      if (r.status === 'fulfilled') {
        enviadas++
        return
      }
      const status = (r.reason as any)?.statusCode
      if (status === 404 || status === 410) mortas.push(lote[idx].id)
      else {
        falhas++
        console.error('[push] falha:', status, (r.reason as any)?.body?.slice?.(0, 120))
      }
    })
  }

  if (mortas.length) {
    await admin.from('push_subscriptions').delete().in('id', mortas)
  }

  return { enviadas, removidas: mortas.length, falhas }
}

/** Envia uma notificação de teste para um único usuário (usado nas configurações). */
export async function enviarParaUsuario(
  userId: string,
  payload: PayloadNotificacao
): Promise<ResultadoEnvio> {
  configurar()
  const admin = getSupabaseAdmin()

  const { data: inscricoes, error } = await admin
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth')
    .eq('user_id', userId)
    .eq('ativo', true)

  if (error) throw new Error(`Erro ao ler inscrições: ${error.message}`)
  if (!inscricoes?.length) return { enviadas: 0, removidas: 0, falhas: 0 }

  const corpoJson = JSON.stringify(payload)
  const mortas: string[] = []
  let enviadas = 0
  let falhas = 0

  const resultados = await Promise.allSettled(
    (inscricoes as Inscricao[]).map(s =>
      webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        corpoJson,
        { TTL: 60 * 10, urgency: 'high' }
      )
    )
  )

  resultados.forEach((r, idx) => {
    if (r.status === 'fulfilled') enviadas++
    else {
      const status = (r.reason as any)?.statusCode
      if (status === 404 || status === 410) mortas.push((inscricoes as Inscricao[])[idx].id)
      else falhas++
    }
  })

  if (mortas.length) await admin.from('push_subscriptions').delete().in('id', mortas)

  return { enviadas, removidas: mortas.length, falhas }
}
