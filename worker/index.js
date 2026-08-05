// Service worker customizado — compilado pelo next-pwa e importado dentro de public/sw.js.
// Responsável por exibir as notificações de push (Versículo do Dia / Estudo do Dia).

self.addEventListener('push', event => {
  let payload = {}
  try {
    payload = event.data ? event.data.json() : {}
  } catch {
    payload = { corpo: event.data ? event.data.text() : '' }
  }

  const titulo = payload.titulo || 'Bíblia & Pregações'
  const corpo = payload.corpo || 'Uma palavra para o seu dia.'
  const url = payload.url || '/diario'

  const options = {
    body: corpo,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-96.png',
    lang: 'pt-BR',
    tag: payload.tag || 'palavra-do-dia',
    renotify: true,
    // Vibração curta para não incomodar, mas garantir que a pessoa perceba.
    vibrate: [180, 80, 180],
    timestamp: Date.now(),
    data: { url },
    actions: [
      { action: 'abrir', title: 'Ler agora' },
      { action: 'partilhar', title: 'Partilhar' },
    ],
  }

  event.waitUntil(self.registration.showNotification(titulo, options))
})

self.addEventListener('notificationclick', event => {
  event.notification.close()

  const base = event.notification.data?.url || '/diario'
  // A ação "partilhar" abre a página do dia já com o cartão de partilha aberto.
  const destino = event.action === 'partilhar' ? `${base}?partilhar=1` : base

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Se o app já estiver aberto, reaproveita a janela em vez de abrir outra.
      for (const client of clientList) {
        if ('focus' in client && 'navigate' in client) {
          return client.focus().then(c => c.navigate(destino)).catch(() => client.focus())
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(destino)
    })
  )
})

// Quando o navegador rotaciona/expira a subscrição, reinscreve para não perder as notificações.
// O novo endpoint é enviado ao servidor pelo próprio app na próxima abertura (usePush sincroniza
// a cada montagem); o endpoint antigo é desativado pelo cron ao receber 404/410.
self.addEventListener('pushsubscriptionchange', event => {
  const options = event.oldSubscription?.options
  if (!options) return
  event.waitUntil(self.registration.pushManager.subscribe(options).catch(() => {}))
})
