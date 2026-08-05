-- ============================================
-- SCHEMA V3 - Vídeo do estudo do dia
-- Execute no SQL Editor do Supabase (depois do schema_v2.sql)
-- É seguro rodar mais de uma vez.
-- ============================================

-- Vídeo sugerido para o estudo do dia, buscado uma vez por dia no YouTube
-- e guardado junto do conteúdo — assim todos veem o mesmo e não gastamos
-- cota da API a cada visita.
ALTER TABLE public.conteudo_diario ADD COLUMN IF NOT EXISTS video_id TEXT;
ALTER TABLE public.conteudo_diario ADD COLUMN IF NOT EXISTS video_titulo TEXT;
ALTER TABLE public.conteudo_diario ADD COLUMN IF NOT EXISTS video_canal TEXT;
ALTER TABLE public.conteudo_diario ADD COLUMN IF NOT EXISTS video_canal_id TEXT;

-- Permite esconder um vídeo específico sem apagar o conteúdo do dia,
-- caso ele não represente o que a igreja ensina.
ALTER TABLE public.conteudo_diario ADD COLUMN IF NOT EXISTS video_oculto BOOLEAN NOT NULL DEFAULT false;
