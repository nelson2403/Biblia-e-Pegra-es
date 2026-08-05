'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, AlertCircle, Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { MolduraAuth } from '@/components/auth/MolduraAuth'
import { CampoTexto } from '@/components/auth/CampoTexto'

/** Força da senha só para orientar — não bloqueia o cadastro. */
function forcaDaSenha(s: string): { nivel: 0 | 1 | 2 | 3; rotulo: string; cor: string } {
  if (s.length < 6) return { nivel: 0, rotulo: 'Muito curta', cor: 'var(--danger)' }
  let pontos = 0
  if (s.length >= 10) pontos++
  if (/[a-z]/.test(s) && /[A-Z]/.test(s)) pontos++
  if (/\d/.test(s)) pontos++
  if (/[^A-Za-z0-9]/.test(s)) pontos++
  if (pontos <= 1) return { nivel: 1, rotulo: 'Fraca', cor: 'var(--danger)' }
  if (pontos <= 2) return { nivel: 2, rotulo: 'Razoável', cor: 'var(--gold)' }
  return { nivel: 3, rotulo: 'Forte', cor: 'var(--success)' }
}

export default function CadastroPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirma: '' })
  const [carregando, setCarregando] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})

  const alterar = (campo: keyof typeof form) => (v: string) => {
    setForm(prev => ({ ...prev, [campo]: v }))
    setErros(prev => ({ ...prev, [campo]: '', geral: '' }))
  }

  const validar = () => {
    const e: Record<string, string> = {}
    if (!form.nome.trim()) e.nome = 'Como podemos te chamar?'
    if (!form.email.trim()) e.email = 'Informe seu e-mail'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail inválido'
    if (!form.senha) e.senha = 'Crie uma senha'
    else if (form.senha.length < 6) e.senha = 'Use pelo menos 6 caracteres'
    if (form.senha !== form.confirma) e.confirma = 'As senhas não são iguais'
    setErros(e)
    return Object.keys(e).length === 0
  }

  const criarConta = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validar()) return
    setCarregando(true)
    const { error } = await signUp(form.email.trim(), form.senha, form.nome.trim())
    setCarregando(false)

    if (!error) {
      router.replace('/dashboard')
      return
    }

    const bruto = error.toLowerCase()
    if (bruto.includes('already') || bruto.includes('registered')) {
      setErros({ email: 'Já existe uma conta com este e-mail. Tente entrar.' })
    } else if (bruto.includes('password')) {
      setErros({ senha: 'Senha muito fraca. Use pelo menos 6 caracteres.' })
    } else {
      setErros({ geral: error })
    }
  }

  const forca = form.senha ? forcaDaSenha(form.senha) : null

  return (
    <MolduraAuth
      titulo="Criar sua conta"
      subtitulo="Leva menos de um minuto"
      voltarPara="/login"
    >
      <form onSubmit={criarConta} className="flex flex-col gap-4" noValidate>
        <CampoTexto
          rotulo="Seu nome"
          valor={form.nome}
          aoMudar={alterar('nome')}
          erro={erros.nome}
          placeholder="Como quer ser chamado"
          autoComplete="name"
          autoFocus
        />

        <CampoTexto
          rotulo="E-mail"
          tipo="email"
          valor={form.email}
          aoMudar={alterar('email')}
          erro={erros.email}
          placeholder="seu@email.com"
          autoComplete="email"
        />

        <div>
          <CampoTexto
            rotulo="Senha"
            tipo="password"
            valor={form.senha}
            aoMudar={alterar('senha')}
            erro={erros.senha}
            dica={!form.senha ? 'Mínimo de 6 caracteres' : undefined}
            placeholder="Crie uma senha"
            autoComplete="new-password"
          />

          {forca && !erros.senha && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex gap-1 flex-1" aria-hidden="true">
                {[1, 2, 3].map(n => (
                  <span
                    key={n}
                    className="h-1 flex-1 rounded-full transition-colors"
                    style={{ backgroundColor: forca.nivel >= n ? forca.cor : 'var(--surface-3)' }}
                  />
                ))}
              </div>
              <span className="text-xs font-bold" style={{ color: forca.cor }}>{forca.rotulo}</span>
            </div>
          )}
        </div>

        <CampoTexto
          rotulo="Repita a senha"
          tipo="password"
          valor={form.confirma}
          aoMudar={alterar('confirma')}
          erro={erros.confirma}
          placeholder="Digite de novo"
          autoComplete="new-password"
        />

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
          {carregando ? 'Criando conta...' : 'Criar minha conta'}
        </button>
      </form>

      <ul className="flex flex-col gap-2 mt-6 mb-6">
        {[
          'Bíblia completa em 3 traduções, com áudio',
          'Versículo e estudo novos todos os dias',
          'Anotações por voz e pregações com IA',
        ].map(item => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-conteudo-muted">
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: 'var(--success-soft)' }}
            >
              <Check size={11} style={{ color: 'var(--success)' }} strokeWidth={3} />
            </span>
            {item}
          </li>
        ))}
      </ul>

      <p className="text-center text-sm text-conteudo-muted">
        Já tem conta? <Link href="/login" className="font-bold text-primary">Entrar</Link>
      </p>
    </MolduraAuth>
  )
}
