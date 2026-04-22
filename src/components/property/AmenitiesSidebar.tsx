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
  pool:           Waves,
  'private chef': ChefHat,
  chef:           ChefHat,
  'fire pit':     Flame,
  fireplace:      Flame,
  bonfire:        Flame,
  spa:            Sparkles,
  'hand massage': HandHeart,
  massage:        HandHeart,
  'nature walk':  TreePine,
  hiking:         TreePine,
  wifi:           Wifi,
  'high-speed':   Wifi,
  gym:            Dumbbell,
  fitness:        Dumbbell,
  breakfast:      Coffee,
  coffee:         Coffee,
  parking:        Car,
  lawn:           Trees,
  garden:         Leaf,
  organic:        Leaf,
  security:       ShieldCheck,
  premium:        Star,
  ac:             Wind,
  'air conditioning': Wind,
  'pool deck':    Umbrella,
  fishing:        Fish,
  cycling:        Bike,
  photography:    Camera,
  music:          Music,
  bath:           Bath,
  'hot water':    Droplet,
  jacuzzi:        Bath,
  dining:         UtensilsCrossed,
  restaurant:     UtensilsCrossed,
  sunrise:        Sunrise,
  glamping:       Tent,
  camping:        Tent,
  lunch:          UtensilsCrossed,
  dinner:         UtensilsCrossed,
  'mini bar':     Wine,
  bar:            Wine,
  'welcome drink':GlassWater,
  tv:             Tv,
  heater:         Thermometer,
  laundry:        Shirt,
  'king size':    BedDouble,
  bed:            BedDouble,
  safe:           ShieldCheck,
  balcony:        DoorOpen,
  veranda:        DoorOpen,
  trekking:       Mountain,
  'mountain view':MountainSnow,
  kayak:          Sailboat,
  yoga:           Flower2,
  sauna:          Droplets,
  steam:          Droplets,
  ayurveda:       Leaf,
  concierge:      ConciergeBell,
  airport:        Plane,
  pet:            PawPrint,
  child:          Baby,
  baby:           Baby,
  'indoor game':  Gamepad2,
  game:           Gamepad2,
};

function getIcon(name: string): LucideIcon {
  const key = name.toLowerCase();
  for (const [k, Icon] of Object.entries(ICON_MAP)) {
    if (key.includes(k)) return Icon;
  }
  return Leaf;
}

const INITIAL_SHOW = 8;

interface AmenitiesSidebarProps {
  amenities: Amenity[];
}

export const AmenitiesSidebar: React.FC<AmenitiesSidebarProps> = ({ amenities }) => {
  const [showAll, setShowAll] = useState(false);
  if (!amenities.length) return null;

  const visible = showAll ? amenities : amenities.slice(0, INITIAL_SHOW);
  const hasMore = amenities.length > INITIAL_SHOW;

  return (
    <div className="mb-8">
      <h3 className="font-headline text-hc-primary text-xl mb-6">
        Estate Amenities
      </h3>

      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
        {visible.map(a => {
          const Icon = getIcon(a.name);
          return (
            <div key={a.id} className="text-center group">
              <div className="w-12 h-12 bg-hc-bg rounded-full flex items-center justify-center mx-auto mb-2 shadow-card group-hover:bg-hc-primary group-hover:shadow-none transition-all duration-200">
                <Icon size={18} strokeWidth={1.5} className="text-hc-primary group-hover:text-white transition-colors duration-200" />
              </div>
              <p className="text-xs text-hc-text font-body leading-tight px-1">{a.name}</p>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAll(v => !v)}
          className="mt-5 text-sm text-hc-secondary font-bold font-body hover:text-hc-primary transition-colors w-full text-center"
        >
          {showAll ? '− Show less' : `+ ${amenities.length - INITIAL_SHOW} more amenities`}
        </button>
      )}
    </div>
  );
};
