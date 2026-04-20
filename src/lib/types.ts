export type PropertyType =
  | 'tree_house'
  | 'backwater_villa'
  | 'mountain_lookout'
  | 'tea_estate_cabin'
  | 'heritage_bungalow'
  | 'riverside_cottage';

export type District =
  | 'wayanad'
  | 'munnar'
  | 'alleppey'
  | 'thekkady'
  | 'vagamon'
  | 'kozhikode'
  | 'kannur';

export interface Property {
  id: string;
  name: string;
  slug: string;
  district: string;
  property_type: string;
  tagline: string | null;
  description: string | null;
  highlights: string[] | null;
  max_guests: number;
  price_per_night: number | null;
  latitude: number | null;
  longitude: number | null;
  location: string | null;
  terms_conditions: string[] | null;
  cover_image: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  nearest_airport: string | null;
  nearest_airport_distance: string | null;
  nearest_railway: string | null;
  nearest_railway_distance: string | null;
  travel_tips: string | null;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface RoomTypeImage {
  id: string;
  room_type_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number | null;
}

export interface RoomType {
  id: string;
  property_id: string;
  name: string;
  bed_type: string | null;
  max_guests: number;
  description: string | null;
  price_per_night: number | null;
  created_at: string;
  room_type_images?: RoomTypeImage[];
}

export const formatRoomPrice = (price: number | null | undefined): string | null => {
  if (price == null || price <= 0) return null;
  return `Price starting from ₹${new Intl.NumberFormat('en-IN').format(price)}/-`;
};

export interface Amenity {
  id: string;
  name: string;
  icon: string | null;
  category: string | null;
}

export interface NearbyAttraction {
  id: string;
  property_id: string;
  name: string;
  distance_km: number | null;
  description: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string[] | null;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  sort_order: number;
}

export interface Enquiry {
  name: string;
  email: string;
  phone?: string;
  message: string;
  property_id?: string;
}

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  tree_house:         'Canopy Retreat',
  backwater_villa:    'Floating Villa',
  mountain_lookout:   'High Range',
  tea_estate_cabin:   "Planter's Legacy",
  heritage_bungalow:  'Heritage Bungalow',
  riverside_cottage:  'Riverside Cottage',
};

export const DISTRICT_LABELS: Record<string, string> = {
  wayanad:   'Wayanad',
  munnar:    'Munnar',
  alleppey:  'Alleppey',
  thekkady:  'Thekkady',
  vagamon:   'Vagamon',
  kozhikode: 'Kozhikode',
  kannur:    'Kannur',
};
