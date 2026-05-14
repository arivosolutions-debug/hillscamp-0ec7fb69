CREATE TABLE public.property_type_assignments (
  property_id uuid NOT NULL,
  property_type_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (property_id, property_type_slug)
);

ALTER TABLE public.property_type_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Property type assignments are publicly readable"
  ON public.property_type_assignments FOR SELECT USING (true);

CREATE POLICY "Admin full access to property_type_assignments"
  ON public.property_type_assignments FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX idx_pta_property ON public.property_type_assignments(property_id);
CREATE INDEX idx_pta_slug ON public.property_type_assignments(property_type_slug);

-- Backfill: seed each property's existing primary type as an assignment
INSERT INTO public.property_type_assignments (property_id, property_type_slug)
SELECT id, property_type FROM public.properties
WHERE property_type IS NOT NULL AND property_type <> ''
ON CONFLICT DO NOTHING;