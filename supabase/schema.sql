-- ============================================
-- SCHEMA - Bíblia & Pregações
-- Execute no SQL Editor do Supabase
-- ============================================

-- 1. TABELA: estudos_biblicos
CREATE TABLE IF NOT EXISTS public.estudos_biblicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  livro TEXT NOT NULL,
  capitulo TEXT NOT NULL,
  versiculo TEXT NOT NULL,
  texto_biblico TEXT NOT NULL,
  contexto_historico TEXT,
  interpretacao TEXT,
  aplicacao TEXT,
  insights TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABELA: anotacoes
CREATE TABLE IF NOT EXISTS public.anotacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABELA: pregacoes
CREATE TABLE IF NOT EXISTS public.pregacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tema TEXT NOT NULL,
  texto_base TEXT NOT NULL,
  objetivo TEXT,
  publico TEXT,
  problema TEXT,
  mensagem_central TEXT,
  pontos_principais TEXT,       -- JSON array: ["ponto1", "ponto2", "ponto3"]
  ilustracao TEXT,
  aplicacao_pratica TEXT,
  conclusao TEXT,
  apelo_final TEXT,
  pregacao_completa TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.estudos_biblicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anotacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pregacoes ENABLE ROW LEVEL SECURITY;

-- Políticas: cada usuário só acessa seus próprios dados

CREATE POLICY "Usuários gerenciam seus estudos" ON public.estudos_biblicos
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários gerenciam suas anotações" ON public.anotacoes
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários gerenciam suas pregações" ON public.pregacoes
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- ÍNDICES para performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_estudos_user ON public.estudos_biblicos(user_id);
CREATE INDEX IF NOT EXISTS idx_anotacoes_user ON public.anotacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_pregacoes_user ON public.pregacoes(user_id);


