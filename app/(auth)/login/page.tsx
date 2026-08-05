'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { MolduraAuth } from '@/components/auth/MolduraAuth'
import { CampoTexto } from '@/components/auth/CampoTexto'

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erros, setErros] = useState<{ email?: string; senha?: string; geral?: string }>({})

  const validar = () => {
    const e: typeof erros = {}
    if (!email.trim()) e.email = 'Informe seu e-mail'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'E-mail inválido'
    if (!senha) e.senha = 'Informe sua senha'
    setErros(e)
    return Object.keys(e).length === 0
  }

  const entrar = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validar()) return
    setCarregando(true)
    const { error } = await signIn(email.trim(), senha)
    setCarregando(false)

    if (!error) {
      router.replace('/dashboard')
      return
    }

    // A mensagem do Supabase vem em inglês e é técnica demais para o usuário final.
    const bruto = error.toLowerCase()
    setErros({
      geral: bruto.includes('not confirmed')
        ? 'Confirme seu e-mail antes de entrar. Procure a mensagem na sua caixa de entrada.'
        : 'E-mail ou senha incorretos. Confira e tente novamente.',
    })
  }

  return (
    <MolduraAuth
      titulo="Bem-vindo de volta"
      subtitulo="Continue de onde você parou"
      rodape="✝ Que a Palavra ilumine seu caminho"
    >
      <form onSubmit={entrar} className="flex flex-col gap-4" noValidate>
        <CampoTexto
          rotulo="E-mail"
          tipo="email"
          valor={email}
          aoMudar={v => { setEmail(v); setErros({}) }}
          erro={erros.email}
          placeholder="seu@email.com"
          autoComplete="email"
        />

        <CampoTexto
          rotulo="Senha"
          tipo="password"
          valor={senha}
          aoMudar={v => { setSenha(v); setErros({}) }}
          erro={erros.senha}
          placeholder="Sua senha"
          autoComplete="current-password"
        />

        <div className="flex justify-end -mt-1">
          <Link href="/esqueceu-senha" className="text-sm font-bold text-primary">
            Esqueci minha senha
          </Link>
        </div>

        {erros.geral && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-2xl px-4 py-3 text-sm font-medium"
            style={{ backgroundColor: 'var(--danger-soft)', color: 'var(--danger)' }}
          >
            <AlertCircle size={17} className="mt-0.5 flex-shrink-0" />
            <span>{erros.geral}</span>
          </div>
        )}

        <button type="submit" disabled={carregando} className="btn-primario mt-1">
          {carregando && <Loader2 size={17} className="animate-spin" />}
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-borda" />
        <span className="text-xs text-conteudo-faint">ainda não tem conta?</span>
        <div className="flex-1 h-px bg-borda" />
      </div>

      <Link href="/cadastro" className="btn-secundario w-full">
        Criar conta grátis
      </Link>
    </MolduraAuth>
  )
}
