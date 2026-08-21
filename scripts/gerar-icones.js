/**
 * Gera todos os PNG de ícone a partir dos SVG.
 * Rode com: npm run icones
 *
 * Saída em public/icons/ — usado pelo manifest, pelas notificações e pelo empacotamento
 * TWA (Bubblewrap) para a Play Store.
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const RAIZ = path.join(__dirname, '..')
const SAIDA = path.join(RAIZ, 'public', 'icons')

/** Arte principal — mesma identidade do public/icon.svg. */
const ARTE = `
  <rect x="110" y="80" width="292" height="352" rx="20" fill="#4F46E5"/>
  <rect x="110" y="80" width="146" height="352" rx="20" fill="#3730A3"/>
  <rect x="145" y="140" width="220" height="14" rx="7" fill="white" opacity="0.9"/>
  <rect x="145" y="175" width="220" height="14" rx="7" fill="white" opacity="0.9"/>
  <rect x="145" y="210" width="160" height="14" rx="7" fill="white" opacity="0.9"/>
  <rect x="145" y="270" width="220" height="8" rx="4" fill="#C7D2FE" opacity="0.8"/>
  <rect x="145" y="294" width="220" height="8" rx="4" fill="#C7D2FE" opacity="0.8"/>
  <rect x="145" y="318" width="220" height="8" rx="4" fill="#C7D2FE" opacity="0.8"/>
  <rect x="145" y="342" width="150" height="8" rx="4" fill="#C7D2FE" opacity="0.8"/>
  <line x1="256" y1="130" x2="256" y2="432" stroke="#6366F1" stroke-width="3" opacity="0.4"/>
  <circle cx="358" cy="358" r="64" fill="#F59E0B"/>
  <line x1="358" y1="330" x2="358" y2="386" stroke="white" stroke-width="12" stroke-linecap="round"/>
  <line x1="330" y1="358" x2="386" y2="358" stroke="white" stroke-width="12" stroke-linecap="round"/>
`

/**
 * Sem cantos arredondados e sem transparência: o Android aplica a própria
 * máscara por cima. Se o PNG já vier arredondado sobre fundo transparente,
 * sobra um contorno escuro em volta do ícone — que era o problema anterior.
 */
const svgPadrao = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="fundo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2A2270"/>
      <stop offset="55%" stop-color="#1E1B4B"/>
      <stop offset="100%" stop-color="#120F33"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.72" cy="0.74" r="0.5">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" fill="url(#fundo)"/>
  <rect width="512" height="512" fill="url(#halo)"/>
  ${ARTE}
</svg>`

/**
 * Maskable: o Android recorta o ícone em círculo/squircle. A zona segura é o
 * círculo central de 80% — por isso a arte entra reduzida a 72% e centralizada,
 * sobre um fundo que sangra até a borda.
 */
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="fundoM" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2A2270"/>
      <stop offset="55%" stop-color="#1E1B4B"/>
      <stop offset="100%" stop-color="#120F33"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#fundoM)"/>
  <g transform="translate(256,256) scale(0.72) translate(-256,-256)">
    ${ARTE}
  </g>
</svg>`

/** Badge da notificação: silhueta branca sobre fundo transparente (o Android tinge). */
const svgBadge = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
  <path d="M20 16h56a4 4 0 0 1 4 4v56a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4z"
        fill="none" stroke="#fff" stroke-width="7"/>
  <line x1="48" y1="16" x2="48" y2="80" stroke="#fff" stroke-width="6"/>
  <line x1="62" y1="36" x2="62" y2="62" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
  <line x1="50" y1="48" x2="74" y2="48" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
</svg>`

/** Banner 1024x500 exigido pela ficha da Play Store. */
const svgBanner = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1E1B4B"/>
      <stop offset="55%" stop-color="#3730A3"/>
      <stop offset="100%" stop-color="#4F46E5"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#g)"/>
  <g transform="translate(70,90) scale(0.62)">${ARTE}</g>
  <text x="420" y="215" font-family="Segoe UI, Roboto, sans-serif" font-size="62" font-weight="800" fill="#fff">
    Bíblia &amp; Pregações
  </text>
  <text x="422" y="272" font-family="Segoe UI, Roboto, sans-serif" font-size="30" fill="#C7D2FE">
    Palavra, estudo e ministério
  </text>
  <text x="422" y="330" font-family="Segoe UI, Roboto, sans-serif" font-size="25" fill="#F59E0B" font-weight="700">
    Versículo do dia · Estudos com IA · Bíblia em áudio
  </text>
</svg>`

const TAMANHOS = [48, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512]

async function main() {
  fs.mkdirSync(SAIDA, { recursive: true })

  for (const tamanho of TAMANHOS) {
    await sharp(Buffer.from(svgPadrao))
      .resize(tamanho, tamanho)
      .png()
      .toFile(path.join(SAIDA, `icon-${tamanho}.png`))
  }

  for (const tamanho of [192, 512]) {
    await sharp(Buffer.from(svgMaskable))
      .resize(tamanho, tamanho)
      .png()
      .toFile(path.join(SAIDA, `icon-maskable-${tamanho}.png`))
  }

  await sharp(Buffer.from(svgBadge)).resize(96, 96).png().toFile(path.join(SAIDA, 'badge-96.png'))

  await sharp(Buffer.from(svgBanner))
    .resize(1024, 500)
    .png()
    .toFile(path.join(SAIDA, 'playstore-banner-1024x500.png'))

  // A Play Store exige o ícone da ficha em 512x512 sem transparência.
  await sharp(Buffer.from(svgPadrao))
    .resize(512, 512)
    .png()
    .toFile(path.join(SAIDA, 'playstore-icon-512.png'))

  console.log(`Ícones gerados em ${SAIDA}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
