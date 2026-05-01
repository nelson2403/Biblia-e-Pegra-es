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
  tags TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABELA: anotacoes
CREATE TABLE IF NOT EXISTS public.anotacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  tags TEXT,
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
  pontos_principais TEXT,
  ilustracao TEXT,
  aplicacao_pratica TEXT,
  conclusao TEXT,
  apelo_final TEXT,
  pregacao_completa TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABELA: favoritos
CREATE TABLE IF NOT EXISTS public.favoritos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  livro_pt TEXT NOT NULL,
  livro_en TEXT NOT NULL,
  capitulo INTEGER NOT NULL,
  versiculo INTEGER NOT NULL,
  texto TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, livro_en, capitulo, versiculo)
);

-- 5. TABELA: historico_leitura
CREATE TABLE IF NOT EXISTS public.historico_leitura (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  livro_en TEXT NOT NULL,
  livro_pt TEXT NOT NULL,
  capitulo INTEGER NOT NULL,
  lido_em DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(user_id, livro_en, capitulo)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.estudos_biblicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anotacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pregacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_leitura ENABLE ROW LEVEL SECURITY;

-- Políticas: cada usuário só acessa seus próprios dados

CREATE POLICY "Usuários gerenciam seus estudos" ON public.estudos_biblicos
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários gerenciam suas anotações" ON public.anotacoes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários gerenciam suas pregações" ON public.pregacoes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários gerenciam seus favoritos" ON public.favoritos
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários gerenciam seu histórico" ON public.historico_leitura
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Colunas adicionais (caso as tabelas já existam)
-- ============================================

ALTER TABLE public.anotacoes ADD COLUMN IF NOT EXISTS tags TEXT;
ALTER TABLE public.estudos_biblicos ADD COLUMN IF NOT EXISTS tags TEXT;

-- ============================================
-- ÍNDICES para performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_estudos_user ON public.estudos_biblicos(user_id);
CREATE INDEX IF NOT EXISTS idx_anotacoes_user ON public.anotacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_pregacoes_user ON public.pregacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_user ON public.favoritos(user_id);
CREATE INDEX IF NOT EXISTS idx_historico_user ON public.historico_leitura(user_id);
CREATE INDEX IF NOT EXISTS idx_historico_data ON public.historico_leitura(user_id, lido_em);
