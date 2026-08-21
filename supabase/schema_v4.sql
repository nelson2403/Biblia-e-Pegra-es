-- ============================================
-- SCHEMA V4 - Voz natural, devocionais e mural de oração
-- Execute no SQL Editor do Supabase (depois do schema_v3.sql)
-- É seguro rodar mais de uma vez.
-- ============================================

-- ── Voz natural (Google Cloud TTS) ──────────────────────────
ALTER TABLE public.preferencias ADD COLUMN IF NOT EXISTS tts_voz_nuvem TEXT DEFAULT 'pt-BR-Neural2-B';
ALTER TABLE public.preferencias ADD COLUMN IF NOT EXISTS voz_natural BOOLEAN NOT NULL DEFAULT true;

-- ── Devocionais em série ────────────────────────────────────
-- Diferente do devocional do dia (avulso), estes são jornadas de vários dias
-- sobre um tema: ansiedade, gratidão, perdão, casamento...

CREATE TABLE IF NOT EXISTS public.devocionais_progresso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  serie_id TEXT NOT NULL,
  dia SMALLINT NOT NULL DEFAULT 1,
  concluido BOOLEAN NOT NULL DEFAULT false,
  iniciado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, serie_id, dia)
);

ALTER TABLE public.devocionais_progresso ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios gerenciam seu progresso devocional" ON public.devocionais_progresso;
CREATE POLICY "Usuarios gerenciam seu progresso devocional" ON public.devocionais_progresso
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_devprog_user ON public.devocionais_progresso(user_id, serie_id);

-- ── Planos de leitura ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.planos_progresso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plano_id TEXT NOT NULL,
  dia SMALLINT NOT NULL,
  concluido_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, plano_id, dia)
);

ALTER TABLE public.planos_progresso ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios gerenciam seu progresso de plano" ON public.planos_progresso;
CREATE POLICY "Usuarios gerenciam seu progresso de plano" ON public.planos_progresso
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_planoprog_user ON public.planos_progresso(user_id, plano_id);

-- Qual plano a pessoa está seguindo agora.
CREATE TABLE IF NOT EXISTS public.plano_ativo (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plano_id TEXT NOT NULL,
  iniciado_em DATE NOT NULL DEFAULT CURRENT_DATE
);

ALTER TABLE public.plano_ativo ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios gerenciam seu plano ativo" ON public.plano_ativo;
CREATE POLICY "Usuarios gerenciam seu plano ativo" ON public.plano_ativo
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── Mural de oração: respostas e marcação de atendido ───────

ALTER TABLE public.pedidos_oracao ADD COLUMN IF NOT EXISTS categoria TEXT DEFAULT 'geral';
ALTER TABLE public.pedidos_oracao ADD COLUMN IF NOT EXISTS respondido BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.pedidos_oracao ADD COLUMN IF NOT EXISTS testemunho TEXT;

CREATE TABLE IF NOT EXISTS public.oracao_comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES public.pedidos_oracao(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  autor_nome TEXT NOT NULL DEFAULT 'Anônimo',
  texto TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.oracao_comentarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Autenticados veem comentarios" ON public.oracao_comentarios;
CREATE POLICY "Autenticados veem comentarios" ON public.oracao_comentarios
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuarios criam comentarios" ON public.oracao_comentarios;
CREATE POLICY "Usuarios criam comentarios" ON public.oracao_comentarios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios apagam seus comentarios" ON public.oracao_comentarios;
CREATE POLICY "Usuarios apagam seus comentarios" ON public.oracao_comentarios
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_comentarios_pedido ON public.oracao_comentarios(pedido_id, created_at);
