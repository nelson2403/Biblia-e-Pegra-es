'use client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { fundoDoDia } from '@/lib/fundos'

interface Props {
  titulo: string
  subtitulo: string
  children: React.ReactNode
  /** Mostra a seta de voltar para esta rota. */
  voltarPara?: string
  rodape?: React.ReactNode
}

/**
 * Moldura das telas de entrada: capa com imagem no topo e a folha de conteúdo
 * subindo por cima. Mesma linguagem visual do cartão de versículo.
 */
export function MolduraAuth({ titulo, subtitulo, children, voltarPara, rodape }: Props) {
  const fundo = fundoDoDia()

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Capa */}
      <div className="relative h-56 sm:h-64 flex-shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${fundo})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,.25), rgba(0,0,0,.72))' }}
          aria-hidden="true"
        />

        {voltarPara && (
          <Link
            href={voltarPara}
            aria-label="Voltar"
            className="absolute top-5 left-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,.35)', backdropFilter: 'blur(6px)' }}
          >
            <ArrowLeft size={20} color="#fff" />
          </Link>
        )}

        <div className="absolute inset-x-0 bottom-0 px-6 pb-10 text-center">
          <img src="/icons/icon-96.png" alt="" className="w-14 h-14 rounded-2xl mx-auto mb-3 shadow-alto" />
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{titulo}</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,.72)' }}>{subtitulo}</p>
        </div>
      </div>

      {/* Folha de conteúdo */}
      <main className="flex-1 -mt-6 rounded-t-[28px] bg-bg px-6 pt-7 pb-10">
        <div className="w-full max-w-sm mx-auto">{children}</div>
      </main>

      {rodape && (
        <div className="px-6 pb-8 text-center text-xs text-conteudo-faint">{rodape}</div>
      )}
    </div>
  )
}
