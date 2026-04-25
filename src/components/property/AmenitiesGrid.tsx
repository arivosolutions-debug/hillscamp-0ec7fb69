import React, { useState } from 'react';
import {
  Waves, ChefHat, Flame, Sparkles, TreePine, Wifi, Droplet,
  Dumbbell, Coffee, Car, Leaf, ShieldCheck, Star,
  Wind, Umbrella, Fish, Bike, Camera, Music,
  Bath, UtensilsCrossed, Sunrise, Tent,
  Tv, Thermometer, Shirt, BedDouble, DoorOpen, Wine, GlassWater,
  Mountain, MountainSnow, Sailboat, Flower2, HandHeart, Droplets,
  ConciergeBell, Plane, PawPrint, Baby, Trees, Gamepad2,
  type LucideIcon,
} from 'lucide-react';
import type { Amenity } from '@/lib/types';

const ICON_MAP: Record<string, LucideIcon> = {
  pool: Waves, 'private chef': ChefHat, chef: ChefHat, kitchen: ChefHat, kitchenette: ChefHat,
  'fire pit': Flame, fireplace: Flame, spa: Sparkles,
  bonfire: Flame,
  'hand massage': HandHeart, massage: HandHeart,
  'nature walk': TreePine, hiking: TreePine,
  wifi: Wifi, 'high-speed': Wifi, gym: Dumbbell, fitness: Dumbbell,
  breakfast: Coffee, coffee: Coffee, parking: Car,
  lawn: Trees, garden: Leaf, organic: Leaf,
  security: ShieldCheck, premium: Star, ac: Wind,
  'air conditioning': Wind, 'pool deck': Umbrella, fishing: Fish,
  cycling: Bike, photography: Camera, music: Music,
  'hot water': Droplet, bath: Bath, jacuzzi: Bath, dining: UtensilsCrossed,
  restaurant: UtensilsCrossed, sunrise: Sunrise,
  glamping: Tent, camping: Tent,
  lunch: UtensilsCrossed, dinner: UtensilsCrossed,
  'mini bar': Wine, bar: Wine, 'welcome drink': GlassWater,
  tv: Tv, heater: Thermometer, laundry: Shirt,
  'king size': BedDouble, bed: BedDouble, safe: ShieldCheck,
  balcony: DoorOpen, veranda: DoorOpen,
  trekking: Mountain, 'mountain view': MountainSnow,
  kayak: Sailboat, yoga: Flower2,
  sauna: Droplets, steam: Droplets,
  ayurveda: Leaf, concierge: ConciergeBell,
  airport: Plane, pet: PawPrint, child: Baby, baby: Baby,
  'indoor game': Gamepad2, game: Gamepad2,
};

function getIcon(name: string): LucideIcon {
  const key = name.toLowerCase();
  for (const [k, Icon] of Object.entries(ICON_MAP)) {
    if (key.includes(k)) return Icon;
  }
  return Leaf;
}

interface AmenitiesGridProps {
  amenities: Amenity[];
}

export const AmenitiesGrid: React.FC<AmenitiesGridProps> = ({ amenities }) => {
  const [showAll, setShowAll] = useState(false);
  if (!amenities.length) return null;

  const visible = showAll ? amenities : amenities.slice(0, 10);
  const hasMore = amenities.length > 10;

  return (
    <div className="px-5 mt-10">
      <h2 className="font-headline text-[#17341e] text-2xl mb-4">Amenities</h2>
      <div className="bg-[#f5f3f3] rounded-2xl p-6">
        <div className="grid grid-cols-5 md:grid-cols-6 gap-4">
          {visible.map(a => {
            const Icon = getIcon(a.name);
            return (
              <div key={a.id} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Icon size={20} strokeWidth={1.5} className="text-[#424842]" />
                </div>
                <span className="text-[10px] text-[#424842] text-center mt-1 font-body leading-tight">
                  {a.name}
                </span>
              </div>
            );
          })}
        </div>
        {hasMore && (
          <button
            onClick={() => setShowAll(v => !v)}
            className="mt-4 text-sm text-[#924a29] font-bold font-body w-full text-center"
          >
            {showAll ? 'Show less' : `View all ${amenities.length}`}
          </button>
        )}
      </div>
    </div>
  );
};
