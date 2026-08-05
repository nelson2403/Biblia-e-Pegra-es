/**
 * Gera os fundos abstratos dos cartões de versículo.
 * Rode com: npm run fundos
 *
 * São imagens procedurais (gradiente + camadas de luz), não fotos: pesam poucos KB,
 * funcionam offline e não dependem de banco de imagens nem de licença de terceiros.
 * O texto sempre entra sobre um véu escuro, garantindo contraste de leitura.
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const SAIDA = path.join(__dirname, '..', 'public', 'fundos')
const L = 1200
const A = 1500

/** Paletas com clima próprio — a do dia é escolhida pela data. */
const PALETAS = [
  { nome: 'trigo', de: '#8a5a1e', para: '#2b1c08', brilho: '#f0b64d' },
  { nome: 'alvorada', de: '#7a3b52', para: '#1d1020', brilho: '#f28e7a' },
  { nome: 'oliveira', de: '#2f5340', para: '#0f1c16', brilho: '#8fd0a4' },
  { nome: 'deserto', de: '#8f6440', para: '#2a1a10', brilho: '#f5c68c' },
  { nome: 'noite', de: '#26304f', para: '#0a0d18', brilho: '#8fa8e8' },
  { nome: 'brasa', de: '#7c3320', para: '#25100a', brilho: '#f2a05c' },
  { nome: 'lavanda', de: '#4b3a6b', para: '#150f22', brilho: '#b9a3ee' },
  { nome: 'mar', de: '#1f4a56', para: '#08171c', brilho: '#7fd2de' },
]

function svg({ de, para, brilho }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${A}" viewBox="0 0 ${L} ${A}">
  <defs>
    <linearGradient id="base" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="${de}"/>
      <stop offset="100%" stop-color="${para}"/>
    </linearGradient>
    <radialGradient id="luz" cx="0.72" cy="0.22" r="0.75">
      <stop offset="0%" stop-color="${brilho}" stop-opacity="0.55"/>
      <stop offset="55%" stop-color="${brilho}" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="${brilho}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="sombra" cx="0.2" cy="0.9" r="0.85">
      <stop offset="0%" stop-color="#000" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${L}" height="${A}" fill="url(#base)"/>

  <!-- Faixas diagonais suaves dão textura sem virar poluição visual -->
  <g opacity="0.16">
    <path d="M-100 ${A * 0.55} Q ${L * 0.4} ${A * 0.3} ${L + 100} ${A * 0.62} L ${L + 100} ${A} L -100 ${A} Z" fill="${brilho}"/>
    <path d="M-100 ${A * 0.74} Q ${L * 0.55} ${A * 0.52} ${L + 100} ${A * 0.8} L ${L + 100} ${A} L -100 ${A} Z" fill="${de}"/>
  </g>

  <rect width="${L}" height="${A}" fill="url(#luz)"/>
  <rect width="${L}" height="${A}" fill="url(#sombra)"/>

  <!-- Véu final: garante contraste do texto branco por cima -->
  <rect width="${L}" height="${A}" fill="#000" opacity="0.22"/>
</svg>`
}

async function main() {
  fs.mkdirSync(SAIDA, { recursive: true })

  for (const p of PALETAS) {
    await sharp(Buffer.from(svg(p)))
      // O desfoque tira a aparência "vetorial" e aproxima de uma foto desfocada.
      .blur(18)
      .jpeg({ quality: 72, mozjpeg: true })
      .toFile(path.join(SAIDA, `${p.nome}.jpg`))
  }

  const total = fs.readdirSync(SAIDA).reduce((s, f) => s + fs.statSync(path.join(SAIDA, f)).size, 0)
  console.log(`${PALETAS.length} fundos gerados em ${SAIDA} (${Math.round(total / 1024)} KB no total)`)
}

main().catch(e => { console.error(e); process.exit(1) })
