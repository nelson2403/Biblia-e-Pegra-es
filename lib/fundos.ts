/** Fundos abstratos gerados por scripts/gerar-fundos.js. */
export const FUNDOS = [
  'trigo',
  'alvorada',
  'oliveira',
  'deserto',
  'noite',
  'brasa',
  'lavanda',
  'mar',
] as const

/**
 * Escolhe o fundo do dia de forma determinística: o mesmo dia sempre traz a mesma
 * imagem, então a tela não "pisca" trocando de arte a cada recarregamento.
 */
export function fundoDoDia(dataISO?: string): string {
  const data = dataISO ?? new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
  const [ano, mes, dia] = data.split('-').map(Number)
  const indice = Math.abs((ano * 372 + mes * 31 + dia) % FUNDOS.length)
  return `/fundos/${FUNDOS[indice]}.jpg`
}
