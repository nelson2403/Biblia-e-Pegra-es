'use client'
import { MuralOracao } from '@/components/MuralOracao'

export default function OracaoPage() {
  return (
    <div className="flex flex-col min-h-full bg-bg pb-24">
      <header className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-extrabold text-conteudo">Mural de oração</h1>
        <p className="text-sm text-conteudo-muted mt-1">
          Ninguém precisa carregar sozinho. Peça, ore pelos outros, celebre as respostas.
        </p>
      </header>

      <div className="px-5">
        <MuralOracao />
      </div>
    </div>
  )
}
