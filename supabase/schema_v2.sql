-- ============================================
-- SCHEMA V2 - Notificações, Conteúdo Diário e Acessibilidade
-- Execute no SQL Editor do Supabase (depois do schema.sql)
-- É seguro rodar mais de uma vez.
-- ============================================

-- ============================================
-- 1. INSCRIÇÕES DE PUSH (Web Push / VAPID)
-- ============================================

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios gerenciam suas inscricoes push" ON public.push_subscriptions;
CREATE POLICY "Usuarios gerenciam suas inscricoes push" ON public.push_subscriptions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_push_user ON public.push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_ativo ON public.push_subscriptions(ativo) WHERE ativo = true;

-- ============================================
-- 2. CONTEÚDO DIÁRIO (versículo + estudo do dia)
-- Uma linha por dia, partilhada por todos os usuários.
-- Gerada uma única vez por dia pela IA (economiza créditos Groq).
-- ============================================

CREATE TABLE IF NOT EXISTS public.conteudo_diario (
  data DATE PRIMARY KEY,
  versiculo_texto TEXT NOT NULL,
  versiculo_ref TEXT NOT NULL,
  reflexao TEXT NOT NULL,
  oracao TEXT,
  estudo_titulo TEXT NOT NULL,
  estudo_subtitulo TEXT,
  estudo_texto_base TEXT,
  estudo_introducao TEXT,
  estudo_pontos JSONB NOT NULL DEFAULT '[]'::jsonb,
  estudo_aplicacao TEXT,
  estudo_conclusao TEXT,
  gerado_por TEXT NOT NULL DEFAULT 'ia',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.conteudo_diario ENABLE ROW LEVEL SECURITY;

-- Conteúdo diário é público para quem está logado (é o mesmo para todos).
DROP POLICY IF EXISTS "Autenticados leem conteudo diario" ON public.conteudo_diario;
CREATE POLICY "Autenticados leem conteudo diario" ON public.conteudo_diario
  FOR SELECT USING (auth.role() = 'authenticated');

-- A escrita acontece só no servidor (service role ignora RLS).

CREATE INDEX IF NOT EXISTS idx_conteudo_data ON public.conteudo_diario(data DESC);

-- ============================================
-- 3. PREFERÊNCIAS DO USUÁRIO
-- Notificações + acessibilidade (leitor de áudio)
-- ============================================

CREATE TABLE IF NOT EXISTS public.preferencias (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  notif_ativa BOOLEAN NOT NULL DEFAULT true,
  notif_versiculo BOOLEAN NOT NULL DEFAULT true,
  notif_estudo BOOLEAN NOT NULL DEFAULT true,
  notif_hora SMALLINT NOT NULL DEFAULT 7 CHECK (notif_hora BETWEEN 0 AND 23),
  tts_voz TEXT,
  tts_velocidade REAL NOT NULL DEFAULT 1.0 CHECK (tts_velocidade BETWEEN 0.5 AND 2.0),
  fonte_grande BOOLEAN NOT NULL DEFAULT false,
  alto_contraste BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.preferencias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios gerenciam suas preferencias" ON public.preferencias;
CREATE POLICY "Usuarios gerenciam suas preferencias" ON public.preferencias
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. HISTÓRICO DE DEVOCIONAIS LIDOS
-- Alimenta o "streak" devocional na tela inicial.
-- ============================================

CREATE TABLE IF NOT EXISTS public.devocionais_lidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, data)
);

ALTER TABLE public.devocionais_lidos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios gerenciam seus devocionais" ON public.devocionais_lidos;
CREATE POLICY "Usuarios gerenciam seus devocionais" ON public.devocionais_lidos
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_devocionais_user ON public.devocionais_lidos(user_id, data DESC);

-- ============================================
-- 5. Colunas extras nas anotações (áudio transcrito)
-- ============================================

ALTER TABLE public.anotacoes ADD COLUMN IF NOT EXISTS origem TEXT DEFAULT 'texto';
