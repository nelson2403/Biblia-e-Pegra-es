import { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

/**
 * Valida o token do Supabase enviado no header Authorization e devolve o usuário.
 * Devolve null se não houver token ou se ele for inválido/expirado.
 */
export async function usuarioDaRequisicao(req: NextRequest) {
  const header = req.headers.get('authorization') ?? ''
  const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : ''
  if (!token) return null

  const { data, error } = await getSupabaseAdmin().auth.getUser(token)
  if (error || !data?.user) return null

  return data.user
}
