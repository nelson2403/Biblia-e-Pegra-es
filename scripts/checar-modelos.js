/**
 * Confere se os modelos usados pelo app ainda existem na conta Groq.
 * Rode com: npm run modelos
 *
 * A Groq desativa modelos antigos sem aviso prévio. Quando isso acontece, o app
 * quebra em produção com um erro em inglês pouco claro. Este script mostra em
 * segundos se foi isso, e o que há disponível para substituir.
 */
const fs = require('fs')
const path = require('path')

// Carrega o .env.local sem depender de biblioteca.
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  for (const linha of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const i = linha.indexOf('=')
    if (i > 0 && !linha.trimStart().startsWith('#')) {
      process.env[linha.slice(0, i).trim()] ||= linha.slice(i + 1).trim()
    }
  }
}

// Lê os modelos direto de lib/groq.ts para não duplicar a lista.
const fonte = fs.readFileSync(path.join(__dirname, '..', 'lib', 'groq.ts'), 'utf8')
const emUso = {}
for (const [, chave, valor] of fonte.matchAll(/^\s*(texto|rapido|audio):\s*'([^']+)'/gm)) {
  emUso[chave] = valor
}

async function main() {
  const chave = process.env.GROQ_API_KEY
  if (!chave || chave === 'sua_chave_aqui') {
    console.error('GROQ_API_KEY não configurada no .env.local')
    process.exit(1)
  }

  const res = await fetch('https://api.groq.com/openai/v1/models', {
    headers: { Authorization: `Bearer ${chave}` },
  })
  if (!res.ok) {
    console.error(`Erro ao consultar a Groq: HTTP ${res.status}`)
    process.exit(1)
  }

  const disponiveis = (await res.json()).data.map(m => m.id).sort()
  let quebrado = false

  console.log('MODELOS EM USO PELO APP\n')
  for (const [papel, modelo] of Object.entries(emUso)) {
    const ok = disponiveis.includes(modelo)
    if (!ok) quebrado = true
    console.log(`  ${ok ? '[ok]' : '[X] '} ${papel.padEnd(8)} ${modelo}${ok ? '' : '  <-- DESCONTINUADO'}`)
  }

  if (quebrado) {
    console.log('\nDISPONÍVEIS NA CONTA AGORA:\n')
    for (const m of disponiveis) console.log('  ' + m)
    console.log('\nAtualize GROQ_MODELS em lib/groq.ts com um dos acima.')
    process.exit(1)
  }

  console.log('\nTodos os modelos em uso continuam disponíveis.')
}

main().catch(e => {
  console.error(e.message)
  process.exit(1)
})
