'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, AlertCircle, ShieldCheck, KeyRound } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { MolduraAuth } from '@/components/auth/MolduraAuth'
import { CampoTexto } from '@/components/auth/CampoTexto'

type Estado = 'verificando' | 'pronto' | 'invalido' | 'concluido'

/**
 * Tela final da redefinição de senha.
 *
 * Fica FORA do grupo (auth) de propósito: o link do e-mail cria uma sessão
 * temporária, e o layout de (auth) manda todo usuário logado para o dashboard —
 * o que expulsaria a pessoa daqui antes de ela trocar a senha.
 */
export default function RedefinirSenhaPage() {
  const router = useRouter()
  const [estado, setEstado] = useState<Estado>('verificando')
  const [senha, setSenha] = useState('')
  const [confirma, setConfirma] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erros, setErros] = useState<{ senha?: string; confirma?: string; geral?: string }>({})

  useEffect(() => {
    let vivo = true

    // O link do e-mail dispara PASSWORD_RECOVERY assim que o token é lido da URL.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((evento) => {
      if (!vivo) return
      if (evento === 'PASSWORD_RECOVERY' || evento === 'SIGNED_IN') setEstado('pronto')
    })

    // Se o token já foi processado antes do listener entrar, a sessão já existe.
    supabase.auth.getSession().then(({ data }) => {
      if (!vivo) return
      setEstado(atual => (atual === 'verificando' ? (data.session ? 'pronto' : 'invalido') : atual))
    })

    // Sem sessão e sem evento em alguns segundos, o link não presta mais.
    const limite = setTimeout(() => {
      if (vivo) setEstado(atual => (atual === 'verificando' ? 'invalido' : atual))
    }, 4000)

    return () => { vivo = false; subscription.unsubscribe(); clearTimeout(limite) }
  }, [])

  const validar = () => {
    const e: typeof erros = {}
    if (!senha) e.senha = 'Crie uma senha nova'
    else if (senha.length < 6) e.senha = 'Use pelo menos 6 caracteres'
    if (senha !== confirma) e.confirma = 'As senhas não são iguais'
    setErros(e)
    return Object.keys(e).length === 0
  }

  const salvar = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validar()) return

    setSalvando(true)
    const { error } = await supabase.auth.updateUser({ password: senha })
    setSalvando(false)

    if (error) {
      const bruto = error.message.toLowerCase()
      setErros({
        geral: bruto.includes('same')
          ? 'Escolha uma senha diferente da anterior.'
          : bruto.includes('expired') || bruto.includes('session')
            ? 'O link expirou. Peça um novo e-mail de redefinição.'
            : error.message,
      })
      return
    }

    setEstado('concluido')
    // Sai da sessão temporária para a pessoa entrar de novo com a senha nova.
    await supabase.auth.signOut()
    setTimeout(() => router.replace('/login'), 2500)
  }

  if (estado === 'verificando') {
    return (
      <MolduraAuth titulo="Um instante" subtitulo="Conferindo o seu link">
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2 size={30} className="animate-spin text-primary" />
          <p className="text-sm text-conteudo-muted">Validando…</p>
        </div>
      </MolduraAuth>
    )
  }

  if (estado === 'invalido') {
    return (
      <MolduraAuth titulo="Link inválido" subtitulo="Ele expirou ou já foi usado" voltarPara="/login">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--danger-soft)' }}>
            <AlertCircle size={28} style={{ color: 'var(--danger)' }} />
          </div>
          <p className="text-conteudo leading-relaxed">
            Links de redefinição valem por 1 hora e só podem ser usados uma vez.
            Peça um novo que resolvemos em seguida.
          </p>
          <Link href="/esqueceu-senha" className="btn-primario">
            Pedir um novo link
          </Link>
          <Link href="/login" className="text-sm font-bold text-primary">Voltar para o login</Link>
        </div>
      </MolduraAuth>
    )
  }

  if (estado === 'concluido') {
    return (
      <MolduraAuth titulo="Senha alterada" subtitulo="Tudo certo por aqui">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--success-soft)' }}>
            <ShieldCheck size={28} style={{ color: 'var(--success)' }} />
          </div>
          <p className="text-conteudo leading-relaxed">
            Sua senha foi trocada com sucesso. Estamos te levando para o login…
          </p>
          <Link href="/login" className="btn-primario">Entrar agora</Link>
        </div>
      </MolduraAuth>
    )
  }

  return (
    <MolduraAuth titulo="Nova senha" subtitulo="Escolha uma senha que você lembre">
      <form onSubmit={salvar} className="flex flex-col gap-4" noValidate>
        <div className="flex items-start gap-2.5 rounded-2xl px-4 py-3 mb-1"
          style={{ backgroundColor: 'var(--accent-soft)' }}>
          <KeyRound size={17} className="mt-0.5 flex-shrink-0 text-primary" />
          <p className="text-sm text-conteudo-muted leading-snug">
            Depois de salvar, você entra de novo usando a senha nova.
          </p>
        </div>

        <CampoTexto
          rotulo="Nova senha"
          tipo="password"
          valor={senha}
          aoMudar={v => { setSenha(v); setErros({}) }}
          erro={erros.senha}
          dica={!senha ? 'Mínimo de 6 caracteres' : undefined}
          placeholder="Sua nova senha"
          autoComplete="new-password"
          autoFocus
        />

        <CampoTexto
          rotulo="Repita a nova senha"
          tipo="password"
          valor={confirma}
          aoMudar={v => { setConfirma(v); setErros({}) }}
          erro={erros.confirma}
          placeholder="Digite de novo"
          autoComplete="new-password"
        />

        {erros.geral && (
          <div role="alert" className="flex items-start gap-2 rounded-2xl px-4 py-3 text-sm font-medium"
            style={{ backgroundColor: 'var(--danger-soft)', color: 'var(--danger)' }}>
            <AlertCircle size={17} className="mt-0.5 flex-shrink-0" />
            <span>{erros.geral}</span>
          </div>
        )}

        <button type="submit" disabled={salvando} className="btn-primario mt-1">
          {salvando && <Loader2 size={17} className="animate-spin" />}
          {salvando ? 'Salvando...' : 'Salvar nova senha'}
        </button>
      </form>
    </MolduraAuth>
  )
}
