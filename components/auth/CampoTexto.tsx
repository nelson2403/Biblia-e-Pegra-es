'use client'
import { useState, useId } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface Props {
  rotulo: string
  tipo?: 'text' | 'email' | 'password'
  valor: string
  aoMudar: (v: string) => void
  erro?: string
  dica?: string
  placeholder?: string
  autoComplete?: string
  autoFocus?: boolean
}

export function CampoTexto({
  rotulo, tipo = 'text', valor, aoMudar, erro, dica, placeholder, autoComplete, autoFocus,
}: Props) {
  const id = useId()
  const [revelado, setRevelado] = useState(false)
  const ehSenha = tipo === 'password'

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-conteudo">
        {rotulo}
      </label>

      <div className="relative">
        <input
          id={id}
          type={ehSenha && revelado ? 'text' : tipo}
          value={valor}
          onChange={e => aoMudar(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-invalid={erro ? 'true' : undefined}
          aria-describedby={erro ? `${id}-erro` : dica ? `${id}-dica` : undefined}
          className="campo"
          style={ehSenha ? { paddingRight: '2.9rem' } : undefined}
        />
        {ehSenha && (
          <button
            type="button"
            onClick={() => setRevelado(v => !v)}
            aria-label={revelado ? 'Ocultar senha' : 'Mostrar senha'}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-conteudo-faint"
          >
            {revelado ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {erro ? (
        <p id={`${id}-erro`} role="alert" className="text-xs font-semibold text-perigo">{erro}</p>
      ) : dica ? (
        <p id={`${id}-dica`} className="text-xs text-conteudo-faint">{dica}</p>
      ) : null}
    </div>
  )
}
