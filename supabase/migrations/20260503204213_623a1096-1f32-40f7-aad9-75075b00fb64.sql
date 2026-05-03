ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS whats_included text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS highlights text[] DEFAULT '{}'::text[];