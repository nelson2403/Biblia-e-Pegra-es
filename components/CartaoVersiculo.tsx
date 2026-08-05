'use client'
import Link from 'next/link'
import { Heart, Share2, MoreHorizontal, Check } from 'lucide-react'
import { fundoDoDia } from '@/lib/fundos'

interface Props {
  texto: string
  referencia: string
  /** Envolve o cartão num link quando informado. */
  href?: string
  data?: string
  /** Corta o versículo em N caracteres (usado na tela inicial). */
  limite?: number
  favoritado?: boolean
  copiado?: boolean
  aoFavoritar?: () => void
  aoPartilhar?: () => void
  aoCopiar?: () => void
}

/**
 * Cartão de destaque do versículo: capa de imagem, véu escuro e texto branco.
 * O véu é fixo no fundo (não depende do tema), então o contraste do texto
 * é o mesmo no claro e no escuro.
 */
export function CartaoVersiculo({
  texto, referencia, href, data, limite,
  favoritado, copiado, aoFavoritar, aoPartilhar, aoCopiar,
}: Props) {
  const fundo = fundoDoDia(data)
  const exibido = limite && texto.length > limite ? `${texto.slice(0, limite).trimEnd()}…` : texto
  const temAcoes = !!(aoFavoritar || aoPartilhar || aoCopiar)

  const miolo = (
    <>
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
        style={{ backgroundImage: `url(${fundo})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,.30) 0%, rgba(0,0,0,.60) 60%, rgba(0,0,0,.78) 100%)' }}
        aria-hidden="true"
      />

      <div className="relative px-5 pt-5 pb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,.62)' }}>
          Versículo do dia
        </p>
        <p className="text-lg font-extrabold text-white mt-0.5 mb-4">{referencia}</p>

        <p
          className="text-white leading-relaxed"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.12rem' }}
        >
          {exibido}
        </p>
      </div>
    </>
  )

  return (
    <div className="relative overflow-hidden rounded-xl2 shadow-alto">
      {href ? (
        <Link href={href} className="block active:scale-[0.995] transition-transform">
          {miolo}
        </Link>
      ) : (
        miolo
      )}

      {temAcoes && (
        <div
          className="relative flex items-center justify-around px-4 py-3"
          style={{ background: 'rgba(0,0,0,.78)', borderTop: '1px solid rgba(255,255,255,.10)' }}
        >
          {aoFavoritar && (
            <button
              onClick={aoFavoritar}
              aria-label={favoritado ? 'Salvo nos favoritos' : 'Salvar nos favoritos'}
              className="flex flex-col items-center gap-1 px-4 py-1"
            >
              <Heart size={19} color="#fff" fill={favoritado ? '#fff' : 'none'} />
              <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,.72)' }}>
                {favoritado ? 'Salvo' : 'Salvar'}
              </span>
            </button>
          )}

          {aoPartilhar && (
            <button onClick={aoPartilhar} aria-label="Partilhar versículo" className="flex flex-col items-center gap-1 px-4 py-1">
              <Share2 size={19} color="#fff" />
              <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,.72)' }}>Partilhar</span>
            </button>
          )}

          {aoCopiar && (
            <button onClick={aoCopiar} aria-label="Copiar versículo" className="flex flex-col items-center gap-1 px-4 py-1">
              {copiado ? <Check size={19} color="#fff" /> : <MoreHorizontal size={19} color="#fff" />}
              <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,.72)' }}>
                {copiado ? 'Copiado' : 'Copiar'}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
