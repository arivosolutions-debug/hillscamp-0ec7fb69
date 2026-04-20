CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Locations are publicly readable"
ON public.locations FOR SELECT
USING (true);

CREATE POLICY "Admin full access to locations"
ON public.locations FOR ALL
USING (true)
WITH CHECK (true);