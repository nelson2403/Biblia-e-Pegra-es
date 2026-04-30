'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})

  const validate = () => {
    const e: typeof errors = {}
    if (!email.trim()) e.email = 'E-mail é obrigatório'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'E-mail inválido'
    if (!password) e.password = 'Senha é obrigatória'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const { error } = await signIn(email.trim(), password)
    setLoading(false)
    if (error) {
      setErrors({ general: 'E-mail ou senha incorretos. Verifique seus dados e tente novamente.' })
    } else {
      router.replace('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 50%, #4F46E5 100%)' }}>

      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)' }}>
          <BookOpen size={38} color="#fff" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Bíblia & Pregações</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Palavra, estudo e ministério</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl p-7 shadow-2xl">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-6">Entrar na conta</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors({}) }}
              className="w-full border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              style={{ borderColor: errors.email ? '#EF4444' : '#E5E7EB' }}
              autoComplete="email"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Sua senha"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors({}) }}
                className="w-full border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-11"
                style={{ borderColor: errors.password ? '#EF4444' : '#E5E7EB' }}
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div className="flex justify-end -mt-1">
            <Link href="/esqueceu-senha" className="text-sm font-semibold text-primary">Esqueceu a senha?</Link>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-opacity disabled:opacity-60"
            style={{ background: loading ? '#818CF8' : '#4F46E5' }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">ou</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-500">
            Não tem conta?{' '}
            <Link href="/cadastro" className="text-primary font-bold">Criar conta grátis</Link>
          </p>
        </form>
      </div>

      <p className="mt-8 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>✝ Que a Palavra ilumine seu caminho</p>
    </div>
  )
}
