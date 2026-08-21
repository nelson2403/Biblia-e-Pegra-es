-- ============================================
-- SCHEMA V5 - Conteúdo offline
-- Execute no SQL Editor do Supabase (depois do schema_v4.sql)
-- É seguro rodar mais de uma vez.
-- ============================================

-- Se o app deve completar sozinho os downloads pendentes ao abrir com internet.
-- Quais traduções o usuário escolheu fica no próprio aparelho (localStorage),
-- porque é uma decisão por dispositivo: faz sentido baixar no celular e não
-- no computador.
ALTER TABLE public.preferencias
  ADD COLUMN IF NOT EXISTS offline_auto BOOLEAN NOT NULL DEFAULT true;
