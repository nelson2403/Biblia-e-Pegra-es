'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  User, Mail, Calendar, BookOpen, Shield, HelpCircle, LogOut,
  Star, Layers, PenLine, Mic, Camera, Edit2, Check, X, Lock,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { ConfiguracoesApp } from '@/components/ConfiguracoesApp'

export default function PerfilPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [stats, setStats] = useState({ estudos: 0, anotacoes: 0, pregacoes: 0 })
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)

  const userName = user?.user_metadata?.name || 'Servo de Deus'
  const userEmail = user?.email ?? ''
  const initials = userName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : ''

  useEffect(() => {
    const url = user?.user_metadata?.avatar_url
    if (url) setAvatarUrl(url)
  }, [user])

  const fetchStats = useCallback(async () => {
    if (!user) return
    const [e, a, p] = await Promise.all([
      supabase.from('estudos_biblicos').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('anotacoes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('pregacoes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    ])
    setStats({ estudos: e.count ?? 0, anotacoes: a.count ?? 0, pregacoes: p.count ?? 0 })
  }, [user])

  useEffect(() => { fetchStats() }, [fetchStats])

  const startEdit = () => {
    setNewName(userName)
    setNewEmail(userEmail)
    setNewPassword('')
    setFeedback(null)
    setEditing(true)
  }

  const cancelEdit = () => { setEditing(false); setFeedback(null) }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploadingPhoto(true)
    try {
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${user.id}/avatar.${ext}`
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true })
      if (upErr) throw upErr
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const url = `${data.publicUrl}?t=${Date.now()}`
      await supabase.auth.updateUser({ data: { avatar_url: url } })
      setAvatarUrl(url)
    } catch {
      setFeedback({ type: 'err', msg: 'Erro ao enviar foto. Crie o bucket "avatars" no Supabase Storage (público).' })
    }
    setUploadingPhoto(false)
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setFeedback(null)
    try {
      const updates: Record<string, any> = {}
      if (newName.trim() && newName.trim() !== userName) updates.data = { name: newName.trim() }
      if (newEmail.trim() && newEmail.trim() !== userEmail) updates.email = newEmail.trim()
      if (newPassword.trim()) updates.password = newPassword.trim()

      if (Object.keys(updates).length > 0) {
        const { error } = await supabase.auth.updateUser(updates)
        if (error) throw error
      }

      setFeedback({ type: 'ok', msg: newEmail.trim() !== userEmail && newEmail.trim() ? 'Salvo! Confirme o novo e-mail na sua caixa de entrada.' : 'Perfil atualizado com sucesso!' })
      setEditing(false)
      router.refresh()
    } catch (err: any) {
      setFeedback({ type: 'err', msg: err?.message ?? 'Erro ao salvar.' })
    }
    setSaving(false)
  }

  const handleSignOut = async () => {
    if (!confirm('Tem certeza que deseja sair?')) return
    await signOut()
    router.replace('/login')
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="p-6 flex flex-col gap-5 pb-10">

        {/* Feedback banner */}
        {feedback && (
          <div className="rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2"
            style={{
              backgroundColor: feedback.type === 'ok' ? '#D1FAE5' : '#FEE2E2',
              color: feedback.type === 'ok' ? '#065F46' : '#991B1B',
            }}>
            {feedback.type === 'ok' ? <Check size={16} /> : <X size={16} />}
            {feedback.msg}
          </div>
        )}

        {/* Profile header */}
        <div className="flex flex-col items-center py-6">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-extrabold overflow-hidden"
              style={{ backgroundColor: '#3730A3' }}>
              {avatarUrl
                ? <img src={avatarUrl} alt="foto de perfil" className="w-full h-full object-cover" />
                : uploadingPhoto ? <span className="text-xs">...</span> : initials}
            </div>
            {editing && (
              <button onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg disabled:opacity-50"
                style={{ backgroundColor: '#4F46E5' }}>
                <Camera size={15} color="#fff" />
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>

          {!editing && <h1 className="text-xl font-extrabold text-gray-800 mb-1">{userName}</h1>}
          {!editing && <p className="text-sm text-gray-500 mb-3">{userEmail}</p>}

          <div className="flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: '#FEF3C7' }}>
            <Star size={13} color="#D97706" />
            <span className="text-xs font-semibold" style={{ color: '#92400E' }}>Membro desde {memberSince}</span>
          </div>

          {editing ? (
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-white text-sm font-bold disabled:opacity-60"
                style={{ backgroundColor: '#4F46E5' }}>
                <Check size={15} /> {saving ? 'Salvando...' : 'Salvar'}
              </button>
              <button onClick={cancelEdit}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold"
                style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                <X size={15} /> Cancelar
              </button>
            </div>
          ) : (
            <button onClick={startEdit}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold"
              style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
              <Edit2 size={14} /> Editar perfil
            </button>
          )}
        </div>

        {/* Edit form */}
        {editing && (
          <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Editar informações</p>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                <User size={13} /> Nome
              </label>
              <input value={newName} onChange={e => setNewName(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Seu nome completo" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                <Mail size={13} /> E-mail
              </label>
              <input value={newEmail} onChange={e => setNewEmail(e.target.value)}
                type="email"
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="seu@email.com" />
              <span className="text-[11px] text-gray-400">Será enviado um e-mail de confirmação para o novo endereço.</span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                <Lock size={13} /> Nova senha
              </label>
              <input value={newPassword} onChange={e => setNewPassword(e.target.value)}
                type="password"
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Deixe em branco para não alterar" />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-sm flex divide-x divide-gray-100">
          {[
            { value: stats.estudos, label: 'Estudos', Icon: Layers, color: '#4F46E5' },
            { value: stats.anotacoes, label: 'Anotações', Icon: PenLine, color: '#D97706' },
            { value: stats.pregacoes, label: 'Pregações', Icon: Mic, color: '#059669' },
          ].map(({ value, label, Icon, color }) => (
            <div key={label} className="flex-1 flex flex-col items-center py-4">
              <span className="text-2xl font-extrabold" style={{ color }}>{value}</span>
              <span className="text-xs text-gray-400 mt-1">{label}</span>
            </div>
          ))}
        </div>

        {/* Account info (read-only, shown when not editing) */}
        {!editing && (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Minha conta</p>
            {[
              { Icon: User, label: 'Nome', value: userName },
              { Icon: Mail, label: 'E-mail', value: userEmail },
              { Icon: Calendar, label: 'Membro desde', value: memberSince },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#EEF2FF' }}>
                  <Icon size={19} color="#4F46E5" />
                </div>
                <span className="flex-1 text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm text-gray-400 max-w-[140px] text-right truncate">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Notificações e acessibilidade */}
        <ConfiguracoesApp />

        {/* Info menu */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Informações</p>
          {[
            { Icon: BookOpen, label: 'Sobre o App' },
            { Icon: Shield, label: 'Privacidade' },
            { Icon: HelpCircle, label: 'Suporte' },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#F3F4F6' }}>
                <Icon size={19} color="#6B7280" />
              </div>
              <span className="flex-1 text-sm font-medium text-gray-700">{label}</span>
            </div>
          ))}
        </div>

        {/* Inspirational */}
        <div className="rounded-2xl p-4 flex flex-col items-center gap-2 text-center"
          style={{ backgroundColor: '#FFF7ED', border: '1px solid #FED7AA' }}>
          <p className="text-sm italic" style={{ color: '#92400E' }}>"Posso tudo naquele que me fortalece."</p>
          <p className="text-xs font-bold" style={{ color: '#D97706' }}>Filipenses 4:13</p>
        </div>

        {/* Sign out */}
        <button onClick={handleSignOut}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-red-600 text-sm"
          style={{ backgroundColor: '#FEE2E2' }}>
          <LogOut size={19} />
          Sair da conta
        </button>

        <p className="text-center text-xs text-gray-400">Bíblia &amp; Pregações v1.0.0</p>
      </div>
    </div>
  )
}
