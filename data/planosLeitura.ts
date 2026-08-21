import { BIBLE_BOOKS } from '@/data/bibleBooks'

export interface TrechoLeitura {
  livroId: number
  livroPt: string
  livroEn: string
  capitulo: number
}

export interface DiaLeitura {
  dia: number
  trechos: TrechoLeitura[]
  /** "Gênesis 1–3" — pronto para exibir. */
  rotulo: string
}

export interface PlanoLeitura {
  id: string
  titulo: string
  subtitulo: string
  descricao: string
  dias: number
  categoria: 'completo' | 'tematico' | 'livro'
  fundo: string
  /** Minutos estimados de leitura por dia. */
  minutos: number
  /** Sequência de livros (ids) que compõem o plano. */
  livros: number[]
  /** Ordem alternativa de capítulos, quando o plano não é sequencial. */
  roteiro?: [number, number][]
}

const porId = new Map(BIBLE_BOOKS.map(b => [b.id, b]))

const AT = BIBLE_BOOKS.filter(b => b.testament === 'AT').map(b => b.id)
const NT = BIBLE_BOOKS.filter(b => b.testament === 'NT').map(b => b.id)
const EVANGELHOS = [40, 41, 42, 43]
const SALMOS_PROVERBIOS = [19, 20]

export const PLANOS: PlanoLeitura[] = [
  {
    id: 'biblia-1-ano',
    titulo: 'Bíblia em 1 ano',
    subtitulo: 'Do Gênesis ao Apocalipse, na ordem',
    descricao:
      'O plano clássico. Três a quatro capítulos por dia levam você pela Bíblia inteira em doze meses. Ideal para quem quer ver a história completa de Deus com a humanidade.',
    dias: 365,
    categoria: 'completo',
    fundo: 'trigo',
    minutos: 12,
    livros: [...AT, ...NT],
  },
  {
    id: 'biblia-6-meses',
    titulo: 'Bíblia em 6 meses',
    subtitulo: 'Ritmo intenso, visão panorâmica',
    descricao:
      'Para quem já leu a Bíblia antes e quer reler com fôlego. São cerca de sete capítulos por dia — exige compromisso, mas dá uma noção do conjunto que a leitura lenta não dá.',
    dias: 180,
    categoria: 'completo',
    fundo: 'brasa',
    minutos: 25,
    livros: [...AT, ...NT],
  },
  {
    id: 'novo-testamento-90',
    titulo: 'Novo Testamento em 90 dias',
    subtitulo: 'De Mateus ao Apocalipse em 3 meses',
    descricao:
      'Três capítulos por dia pelo Novo Testamento inteiro. Um bom primeiro plano para quem está começando a ler a Bíblia com regularidade.',
    dias: 90,
    categoria: 'completo',
    fundo: 'mar',
    minutos: 10,
    livros: NT,
  },
  {
    id: 'evangelhos-30',
    titulo: 'A vida de Jesus em 30 dias',
    subtitulo: 'Mateus, Marcos, Lucas e João',
    descricao:
      'Um mês acompanhando Jesus de perto: o que ele fez, o que ensinou, como tratou as pessoas. Se você só puder ler uma parte da Bíblia, comece por aqui.',
    dias: 30,
    categoria: 'tematico',
    fundo: 'alvorada',
    minutos: 12,
    livros: EVANGELHOS,
  },
  {
    id: 'salmos-proverbios',
    titulo: 'Salmos e Provérbios',
    subtitulo: 'Oração e sabedoria, 60 dias',
    descricao:
      'Os Salmos ensinam a falar com Deus em qualquer estado de alma; Provérbios ensina a viver bem no dia a dia. Dois capítulos diários que cabem em qualquer rotina.',
    dias: 60,
    categoria: 'tematico',
    fundo: 'oliveira',
    minutos: 8,
    livros: SALMOS_PROVERBIOS,
  },
  {
    id: 'joao-21',
    titulo: 'João em 21 dias',
    subtitulo: 'Um capítulo por dia',
    descricao:
      'O evangelho mais direto sobre quem Jesus é. Um capítulo por dia, com tempo de sobra para pensar. Perfeito para quem quer começar devagar e sem pressão.',
    dias: 21,
    categoria: 'livro',
    fundo: 'lavanda',
    minutos: 5,
    livros: [43],
  },
  {
    id: 'paulo-cartas',
    titulo: 'As cartas de Paulo',
    subtitulo: 'De Romanos a Filemom, 45 dias',
    descricao:
      'A teologia cristã explicada em cartas a igrejas reais, com problemas reais. Aqui está o coração da doutrina da graça.',
    dias: 45,
    categoria: 'tematico',
    fundo: 'noite',
    minutos: 9,
    livros: [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57],
  },
  {
    id: 'pentateuco',
    titulo: 'Os cinco livros de Moisés',
    subtitulo: 'A fundação de tudo, 60 dias',
    descricao:
      'Criação, aliança, êxodo e lei. Sem entender o Pentateuco, boa parte do restante da Bíblia fica no escuro.',
    dias: 60,
    categoria: 'tematico',
    fundo: 'deserto',
    minutos: 12,
    livros: [1, 2, 3, 4, 5],
  },
]

export function plano(id: string): PlanoLeitura | undefined {
  return PLANOS.find(p => p.id === id)
}

/** Total de capítulos de um plano. */
export function totalCapitulos(p: PlanoLeitura): number {
  if (p.roteiro) return p.roteiro.length
  return p.livros.reduce((s, id) => s + (porId.get(id)?.chapters ?? 0), 0)
}

function rotular(trechos: TrechoLeitura[]): string {
  if (!trechos.length) return ''

  // Agrupa capítulos seguidos do mesmo livro: "Gênesis 1–3, Mateus 1".
  const partes: string[] = []
  let inicio = trechos[0]
  let anterior = trechos[0]

  for (let i = 1; i <= trechos.length; i++) {
    const atual = trechos[i]
    const quebra =
      !atual || atual.livroId !== anterior.livroId || atual.capitulo !== anterior.capitulo + 1

    if (quebra) {
      partes.push(
        inicio.capitulo === anterior.capitulo
          ? `${inicio.livroPt} ${inicio.capitulo}`
          : `${inicio.livroPt} ${inicio.capitulo}–${anterior.capitulo}`
      )
      if (atual) inicio = atual
    }
    if (atual) anterior = atual
  }

  return partes.join(', ')
}

/**
 * Monta o cronograma dia a dia.
 *
 * Distribui os capítulos o mais uniformemente possível: em vez de dar 4
 * capítulos nos primeiros dias e 2 nos últimos, espalha a sobra ao longo do
 * plano, para o esforço diário ficar parecido do começo ao fim.
 */
export function cronograma(p: PlanoLeitura): DiaLeitura[] {
  const sequencia: TrechoLeitura[] = []

  if (p.roteiro) {
    for (const [livroId, capitulo] of p.roteiro) {
      const livro = porId.get(livroId)
      if (livro) sequencia.push({ livroId, livroPt: livro.pt, livroEn: livro.en, capitulo })
    }
  } else {
    for (const livroId of p.livros) {
      const livro = porId.get(livroId)
      if (!livro) continue
      for (let c = 1; c <= livro.chapters; c++) {
        sequencia.push({ livroId, livroPt: livro.pt, livroEn: livro.en, capitulo: c })
      }
    }
  }

  const total = sequencia.length
  const base = Math.floor(total / p.dias)
  const sobra = total % p.dias

  const dias: DiaLeitura[] = []
  let posicao = 0

  for (let d = 0; d < p.dias; d++) {
    // Os primeiros 'sobra' dias levam um capítulo a mais.
    const quantidade = base + (d < sobra ? 1 : 0)
    const trechos = sequencia.slice(posicao, posicao + quantidade)
    posicao += quantidade
    dias.push({ dia: d + 1, trechos, rotulo: rotular(trechos) })
  }

  return dias
}

/** Qual dia do plano corresponde a hoje, dado quando a pessoa começou. */
export function diaAtual(iniciadoEm: string, totalDias: number): number {
  const inicio = new Date(`${iniciadoEm}T00:00:00`)
  const hoje = new Date(new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }) + 'T00:00:00')
  const passados = Math.floor((hoje.getTime() - inicio.getTime()) / 86400000)
  return Math.min(totalDias, Math.max(1, passados + 1))
}
