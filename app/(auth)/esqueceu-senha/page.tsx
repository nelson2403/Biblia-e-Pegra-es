'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Loader2, AlertCircle, MailCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { MolduraAuth } from '@/components/auth/MolduraAuth'
import { CampoTexto } from '@/components/auth/CampoTexto'

export default function EsqueceuSenhaPage() {
  const [email, setEmail] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState('')

  const enviar = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!email.trim()) { setErro('Informe seu e-mail'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setErro('E-mail inválido'); return }

    setErro('')
    setCarregando(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      // Precisa apontar para a tela que realmente troca a senha.
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })
    setCarregando(false)

    // Mesmo com erro mostramos sucesso: dizer "este e-mail não existe"
    // entrega a estranhos quais contas estão cadastradas.
    if (error) console.error('[esqueceu-senha]', error.message)
    setEnviado(true)
  }

  if (enviado) {
    return (
      <MolduraAuth titulo="Verifique seu e-mail" subtitulo="Enviamos o link de redefinição" voltarPara="/login">
        <div className="flex flex-col items-center text-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--success-soft)' }}
          >
            <MailCheck size={28} style={{ color: 'var(--success)' }} />
          </div>

          <p className="text-conteudo leading-relaxed">
            Se existir uma conta para <strong className="font-bold">{email.trim()}</strong>,
            o link de redefinição chegará em instantes.
          </p>

          <div className="cartao p-4 text-left w-full">
            <p className="text-sm font-bold text-conteudo mb-2">Não chegou?</p>
            <ul className="text-sm text-conteudo-muted flex flex-col gap-1.5 leading-relaxed">
              <li>• Veja a pasta de spam ou lixo eletrônico</li>
              <li>• Confira se digitou o e-mail certo</li>
              <li>• O link vale por 1 hora</li>
            </ul>
          </div>

          <button onClick={() => { setEnviado(false); setEmail('') }} className="btn-secundario w-full">
            Tentar com outro e-mail
          </button>

          <Link href="/login" className="text-sm font-bold text-primary mt-1">
            Voltar para o login
          </Link>
        </div>
      </MolduraAuth>
    )
  }

  return (
    <MolduraAuth
      titulo="Redefinir senha"
      subtitulo="Vamos te enviar um link por e-mail"
      voltarPara="/login"
    >
      <form onSubmit={enviar} className="flex flex-col gap-4" noValidate>
        <CampoTexto
          rotulo="E-mail da conta"
          tipo="email"
          valor={email}
          aoMudar={v => { setEmail(v); setErro('') }}
          erro={erro}
          dica="Enviaremos um link para você criar uma senha nova"
          placeholder="seu@email.com"
          autoComplete="email"
          autoFocus
        />

        <button type="submit" disabled={carregando} className="btn-primario mt-1">
          {carregando && <Loader2 size={17} className="animate-spin" />}
          {carregando ? 'Enviando...' : 'Enviar link de redefinição'}
        </button>
      </form>

      <p className="text-center text-sm text-conteudo-muted mt-6">
        Lembrou a senha? <Link href="/login" className="font-bold text-primary">Entrar</Link>
      </p>
    </MolduraAuth>
  )
}
