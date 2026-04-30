'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function EsqueceuSenhaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) { setError('Digite seu e-mail'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('E-mail inválido'); return }
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    })
    setLoading(false)
    if (err) setError(err.message)
    else setSent(true)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 50%, #4F46E5 100%)' }}>

      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)' }}>
          <Lock size={32} color="#fff" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Redefinir Senha</h1>
        <p className="text-sm mt-2 text-center" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {sent ? 'E-mail enviado com sucesso!' : 'Digite seu e-mail e enviaremos\num link para redefinir sua senha.'}
        </p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl p-7 shadow-2xl">
        {!sent ? (
          <form onSubmit={handleSend} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail cadastrado</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                className="w-full border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ borderColor: error ? '#EF4444' : '#E5E7EB' }}
                autoComplete="email"
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60"
              style={{ backgroundColor: '#4F46E5' }}>
              {loading ? 'Enviando...' : 'Enviar link de redefinição'}
            </button>

            <Link href="/login" className="text-center text-sm font-semibold text-primary">
              Voltar ao login
            </Link>
          </form>
        ) : (
          <div className="flex flex-col items-center text-center gap-4">
            <CheckCircle size={56} className="text-green-500" />
            <h3 className="text-xl font-bold text-gray-800">E-mail enviado!</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Verifique sua caixa de entrada em{' '}
              <span className="font-bold text-primary">{email}</span>.
              {'\n\n'}Não esqueça de verificar a pasta de spam.
            </p>
            <Link href="/login"
              className="w-full py-3 rounded-xl font-bold text-white text-sm text-center block"
              style={{ backgroundColor: '#4F46E5' }}>
              Voltar ao login
            </Link>
            <button onClick={() => { setSent(false); setEmail('') }}
              className="text-sm font-semibold text-primary">
              Reenviar e-mail
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
