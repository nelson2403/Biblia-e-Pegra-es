'use client'
import { useState } from 'react'
import { Play, ExternalLink, Info } from 'lucide-react'

interface Props {
  videoId: string
  titulo: string
  canal: string
}

/**
 * Player do vídeo do estudo.
 *
 * A miniatura é só uma imagem até a pessoa tocar em play — só então o iframe
 * do YouTube é montado. Isso evita carregar centenas de KB em toda visita e
 * impede que o YouTube receba dados de quem nem quis assistir.
 */
export function VideoEstudo({ videoId, titulo, canal }: Props) {
  const [tocando, setTocando] = useState(false)

  return (
    <section className="cartao overflow-hidden">
      <div className="relative aspect-video bg-black">
        {tocando ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&hl=pt-BR`}
            title={titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => setTocando(true)}
            aria-label={`Assistir: ${titulo}`}
            className="absolute inset-0 w-full h-full group"
          >
            <img
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,.15))' }}
              aria-hidden="true"
            />
            <span
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center shadow-alto transition-transform group-active:scale-95"
              style={{ backgroundColor: 'rgba(255,255,255,.94)' }}
              aria-hidden="true"
            >
              <Play size={26} fill="#111" color="#111" style={{ marginLeft: 3 }} />
            </span>
          </button>
        )}
      </div>

      <div className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-conteudo-faint mb-1">
          Vídeo sobre o tema
        </p>
        <p className="text-sm font-bold text-conteudo leading-snug">{titulo}</p>

        <div className="flex items-center justify-between gap-3 mt-2">
          {canal && <p className="text-xs text-conteudo-muted truncate">{canal}</p>}
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-bold text-primary flex-shrink-0"
          >
            YouTube <ExternalLink size={12} />
          </a>
        </div>

        <p className="flex items-start gap-1.5 text-[11px] text-conteudo-faint mt-3 leading-snug">
          <Info size={12} className="mt-0.5 flex-shrink-0" />
          Conteúdo de terceiros, sugerido automaticamente pelo tema do dia.
        </p>
      </div>
    </section>
  )
}
