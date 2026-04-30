'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function CadastroPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '', general: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Nome é obrigatório'
    if (!form.email.trim()) e.email = 'E-mail é obrigatório'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail inválido'
    if (!form.password) e.password = 'Senha é obrigatória'
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres'
    if (form.password !== form.confirm) e.confirm = 'As senhas não coincidem'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const { error } = await signUp(form.email.trim(), form.password, form.name.trim())
    setLoading(false)
    if (error) {
      setErrors({ general: error })
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 50%, #4F46E5 100%)' }}>
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Verifique seu e-mail!</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Enviamos um link de confirmação para <span className="font-bold text-primary">{form.email}</span>.
            Clique no link para ativar sua conta.
          </p>
          <Link href="/login"
            className="block w-full py-3 rounded-xl font-bold text-white text-sm text-center"
            style={{ backgroundColor: '#4F46E5' }}>
            Ir para o Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 50%, #4F46E5 100%)' }}>

      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)' }}>
          <BookOpen size={38} color="#fff" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Criar Conta</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Junte-se à comunidade</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl p-7 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { field: 'name', label: 'Nome completo', type: 'text', placeholder: 'Seu nome' },
            { field: 'email', label: 'E-mail', type: 'email', placeholder: 'seu@email.com' },
          ].map(({ field, label, type, placeholder }) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={(form as any)[field]}
                onChange={set(field)}
                className="w-full border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ borderColor: errors[field] ? '#EF4444' : '#E5E7EB' }}
              />
              {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
            </div>
          ))}

          {(['password', 'confirm'] as const).map(field => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {field === 'password' ? 'Senha' : 'Confirmar senha'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={field === 'password' ? 'Mínimo 6 caracteres' : 'Repita a senha'}
                  value={form[field]}
                  onChange={set(field)}
                  className="w-full border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-11"
                  style={{ borderColor: errors[field] ? '#EF4444' : '#E5E7EB' }}
                />
                {field === 'password' && (
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
              </div>
              {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
            </div>
          ))}

          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {errors.general}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60"
            style={{ backgroundColor: '#4F46E5' }}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Já tem conta?{' '}
            <Link href="/login" className="text-primary font-bold">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
