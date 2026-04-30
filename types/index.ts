export interface EstudoBiblico {
  id: string
  user_id: string
  livro: string
  capitulo: string
  versiculo: string
  texto_biblico: string
  contexto_historico: string
  interpretacao: string
  aplicacao: string
  insights: string
  tags?: string
  created_at: string
  updated_at: string
}

export interface Anotacao {
  id: string
  user_id: string
  titulo: string
  conteudo: string
  tags?: string
  created_at: string
  updated_at: string
}

export interface Pregacao {
  id: string
  user_id: string
  tema: string
  texto_base: string
  objetivo: string
  publico: string
  problema: string
  mensagem_central: string
  pontos_principais: string
  ilustracao: string
  aplicacao_pratica: string
  conclusao: string
  apelo_final: string
  pregacao_completa: string
  created_at: string
  updated_at: string
}

export interface PregacaoForm {
  tema: string
  texto_base: string
  objetivo: string
  publico: string
  problema: string
  mensagem_central: string
  ponto1: string
  ponto2: string
  ponto3: string
  ilustracao: string
  aplicacao_pratica: string
  conclusao: string
  apelo_final: string
}

export interface EstudoForm {
  livro: string
  capitulo: string
  versiculo: string
  texto_biblico: string
  contexto_historico: string
  interpretacao: string
  aplicacao: string
  insights: string
  tags?: string
}

export interface Favorito {
  id: string
  user_id: string
  livro_pt: string
  livro_en: string
  capitulo: number
  versiculo: number
  texto: string
  created_at: string
}

export interface HistoricoLeitura {
  id: string
  user_id: string
  livro_en: string
  livro_pt: string
  capitulo: number
  lido_em: string
}
