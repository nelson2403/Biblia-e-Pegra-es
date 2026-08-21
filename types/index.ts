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

export interface PontoEstudo {
  titulo: string
  referencia: string
  conteudo: string
}

/** Versículo + estudo do dia. Uma linha por data, partilhada por todos os usuários. */
export interface ConteudoDiario {
  data: string
  versiculo_texto: string
  versiculo_ref: string
  reflexao: string
  oracao: string | null
  estudo_titulo: string
  estudo_subtitulo: string | null
  estudo_texto_base: string | null
  estudo_introducao: string | null
  estudo_pontos: PontoEstudo[]
  estudo_aplicacao: string | null
  estudo_conclusao: string | null
  /** Vídeo sugerido para o estudo (YouTube). Ausente quando não houve resultado. */
  video_id: string | null
  video_titulo: string | null
  video_canal: string | null
  video_canal_id: string | null
  video_oculto?: boolean
  gerado_por: string
  created_at?: string
}

export interface Preferencias {
  user_id: string
  notif_ativa: boolean
  notif_versiculo: boolean
  notif_estudo: boolean
  notif_hora: number
  tts_voz: string | null
  tts_velocidade: number
  /** Voz neural da Google escolhida (quando a voz natural está ativa). */
  tts_voz_nuvem: string | null
  /** Desligar cai para a voz do próprio aparelho. */
  voz_natural: boolean
  /** Completar downloads offline sozinho ao abrir com internet. */
  offline_auto: boolean
  fonte_grande: boolean
  alto_contraste: boolean
  updated_at?: string
}
