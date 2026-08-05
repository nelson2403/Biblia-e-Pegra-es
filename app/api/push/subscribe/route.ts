import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { usuarioDaRequisicao } from '@/lib/authServer'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const user = await usuarioDaRequisicao(req)
  if (!user) {
    return NextResponse.json({ error: 'Sessão inválida. Entre novamente.' }, { status: 401 })
  }

  try {
    const { subscription } = await req.json()

    const endpoint: string | undefined = subscription?.endpoint
    const p256dh: string | undefined = subscription?.keys?.p256dh
    const auth: string | undefined = subscription?.keys?.auth

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json({ error: 'Inscrição de push incompleta.' }, { status: 400 })
    }

    const { error } = await getSupabaseAdmin()
      .from('push_subscriptions')
      .upsert(
        {
          user_id: user.id,
          endpoint,
          p256dh,
          auth,
          user_agent: req.headers.get('user-agent')?.slice(0, 300) ?? null,
          ativo: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'endpoint' }
      )

    if (error) {
      console.error('[push/subscribe] erro:', error.message)
      return NextResponse.json({ error: `Erro ao salvar: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[push/subscribe] erro interno:', e?.message)
    return NextResponse.json({ error: `Erro interno: ${e?.message ?? 'desconhecido'}` }, { status: 500 })
  }
}
