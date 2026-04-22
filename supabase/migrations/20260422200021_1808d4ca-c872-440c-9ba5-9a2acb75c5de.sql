-- Fix the 4 incomplete rows
UPDATE public.amenities SET category = 'Meals',      icon = 'utensils-crossed', sort_order = 11, name = 'Lunch'              WHERE name = 'Lunch';
UPDATE public.amenities SET category = 'Meals',      icon = 'utensils-crossed', sort_order = 12, name = 'Dinner'             WHERE name = 'Dinner';
UPDATE public.amenities SET category = 'Wellness',   icon = 'bath',             sort_order = 13                              WHERE name = 'Jacuzzi';
UPDATE public.amenities SET category = 'Recreation', icon = 'gamepad-2',        sort_order = 14, name = 'Indoor Game Area'   WHERE name = 'Indoor game area';

-- Insert new amenities (skip if name already exists)
INSERT INTO public.amenities (name, category, icon, sort_order) VALUES
  ('Tea & Coffee Maker',  'Meals',      'coffee',         15),
  ('Mini Bar',            'Meals',      'wine',           16),
  ('Welcome Drink',       'Meals',      'glass-water',    17),

  ('Smart TV',            'Comfort',    'tv',             20),
  ('Fireplace',           'Comfort',    'flame',          21),
  ('Room Heater',         'Comfort',    'thermometer',    22),
  ('Laundry Service',     'Comfort',    'shirt',          23),
  ('King Size Bed',       'Comfort',    'bed-double',     24),
  ('In-Room Safe',        'Comfort',    'shield-check',   25),
  ('Balcony / Veranda',   'Comfort',    'door-open',      26),

  ('Cycling',             'Recreation', 'bike',           30),
  ('Fishing',             'Recreation', 'fish',           31),
  ('Trekking',            'Recreation', 'mountain',       32),
  ('Sunrise Deck',        'Recreation', 'sunrise',        33),
  ('Camping / Glamping',  'Recreation', 'tent',           34),
  ('Kayaking',            'Recreation', 'sailboat',       35),
  ('Yoga Deck',           'Recreation', 'flower-2',       36),

  ('Massage',             'Wellness',   'hand-heart',     40),
  ('Steam / Sauna',       'Wellness',   'droplets',       41),
  ('Ayurveda Treatment',  'Wellness',   'leaf',           42),

  ('24/7 Concierge',      'Facilities', 'concierge-bell', 50),
  ('Airport Pickup',      'Facilities', 'plane',          51),
  ('Pet Friendly',        'Facilities', 'paw-print',      52),
  ('Child Friendly',      'Facilities', 'baby',           53),
  ('Garden / Lawn',       'Facilities', 'trees',          54),
  ('Mountain View',       'Facilities', 'mountain-snow',  55)
ON CONFLICT DO NOTHING;