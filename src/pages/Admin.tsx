import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/shared/Logo';
import { Switch } from '@/components/ui/switch';
import { MarkdownEditor } from '@/components/admin/MarkdownEditor';
import {
  Plus, Trash2, Edit2, Eye, EyeOff, X, Save, LogOut,
  Home, Package, Star, Settings, ChevronUp, ChevronDown,
  FileText, Upload, GripVertical
} from 'lucide-react';

const MAX_FEATURED = 4;

async function checkFeaturedCap(
  table: 'properties' | 'packages',
  willBeFeatured: boolean,
  currentId?: string,
): Promise<string | null> {
  if (!willBeFeatured) return null;
  const { data, error } = await (supabase.from(table as any) as any)
    .select('id')
    .eq('is_featured', true);
  if (error) return null;
  const others = (data ?? []).filter((r: any) => r.id !== currentId);
  if (others.length >= MAX_FEATURED) {
    return `Maximum ${MAX_FEATURED} featured items allowed. Unfeature one first.`;
  }
  return null;
}

const ADMIN_PASSWORD = 'hillscamp2025';

// ─── Types ────────────────────────────────────────────────────────

interface RoomTypeForm {
  id?: string;
  name: string;
  bed_type: string;
  max_guests: number;
  price_per_night: string;
  description: string;
  sort_order: number;
  images: { id?: string; image_url: string; alt_text: string; sort_order: number; file?: File }[];
}

interface NearbyAttractionForm {
  id?: string;
  name: string;
  distance_km: string;
  description: string;
}

interface PropertyImageForm {
  id?: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  file?: File;
}

interface PropertyForm {
  id?: string;
  name: string;
  slug: string;
  district: string;
  property_type: string;
  tagline: string;
  description: string;
  highlights: string[];
  tags: string[];
  terms_conditions: string[];
  max_guests: number;
  price_per_night: string;
  latitude: string;
  longitude: string;
  cover_image: string;
  cover_image_file?: File;
  location: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  property_images: PropertyImageForm[];
  room_types: RoomTypeForm[];
  amenity_ids: string[];
  nearby_attractions: NearbyAttractionForm[];
}

interface ItineraryDay {
  day: number;
  title: string;
  subtitle: string;
  description: string;
  image?: string | null;
  imageFile?: File;
}

interface PackageGalleryForm {
  id?: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  file?: File;
}

interface PackageForm {
  id?: string;
  name: string;
  slug: string;
  location: string;
  region: string;
  price_inr: string;
  duration_days: string;
  duration_nights: string;
  distance_km: string;
  min_participants: string;
  max_participants: string;
  lat: string;
  lng: string;
  hero_images: { url: string; file?: File }[];
  instagram_hashtag: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  tags: string[];
  itinerary: ItineraryDay[];
  whats_not_included: string[];
  terms_conditions: string[];
  gallery: PackageGalleryForm[];
}

interface ReviewForm {
  id?: string;
  property_id: string;
  package_id: string;
  guest_name: string;
  guest_title: string;
  quote: string;
  initials: string;
  stayed_at: string;
  is_featured: boolean;
  is_approved: boolean;
  sort_order: number;
}

interface BlogForm {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  cover_image_file?: File;
  category: string;
  tags: string[];
  author_id: string;
  is_published: boolean;
  is_featured: boolean;
  read_time_minutes: string;
}

// ─── Helpers ──────────────────────────────────────────────────────

const toSlug = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const uploadFile = async (file: File, bucket: string, folder = ''): Promise<string> => {
  const ext = file.name.split('.').pop();
  const path = `${folder}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

// ─── UI Primitives ────────────────────────────────────────────────

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-hc-text uppercase tracking-wider font-body">{label}</label>
    <input {...props} className="border border-hc-text-light/30 rounded-xl px-4 py-2.5 text-sm font-body text-hc-text bg-white focus:outline-none focus:ring-2 focus:ring-hc-primary/20 placeholder:text-hc-text/40 w-full" />
  </div>
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-hc-text uppercase tracking-wider font-body">{label}</label>
    <textarea {...props} rows={4} className="border border-hc-text-light/30 rounded-xl px-4 py-2.5 text-sm font-body text-hc-text bg-white focus:outline-none focus:ring-2 focus:ring-hc-primary/20 resize-y w-full" />
  </div>
);

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between bg-hc-bg-alt rounded-xl px-4 py-3">
    <span className="text-sm font-body text-hc-text">{label}</span>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white border border-hc-text-light/15 rounded-2xl p-6">
    <h3 className="font-headline text-hc-primary text-lg mb-5">{title}</h3>
    {children}
  </div>
);

const Btn: React.FC<{
  onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md'; children: React.ReactNode; type?: 'button' | 'submit'; disabled?: boolean;
}> = ({ onClick, variant = 'primary', size = 'md', children, type = 'button', disabled }) => {
  const base = 'rounded-full font-semibold font-body transition-all flex items-center gap-2 disabled:opacity-50 whitespace-nowrap';
  const variants = {
    primary: 'bg-hc-primary text-white hover:bg-hc-primary-deep',
    secondary: 'bg-hc-bg-alt text-hc-primary border border-hc-text-light/20 hover:bg-hc-bg',
    danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
    ghost: 'text-hc-text-light hover:text-hc-primary',
  };
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm' };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${sizes[size]}`}>
      {children}
    </button>
  );
};

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg font-body text-sm
      ${type === 'success' ? 'bg-hc-primary text-white' : 'bg-red-500 text-white'}`}>
      {message}
      <button onClick={onClose}><X size={16} /></button>
    </div>
  );
};

// ─── Image Upload Field ───────────────────────────────────────────

const ImageUpload: React.FC<{
  label: string;
  value: string;
  onChange: (url: string, file?: File) => void;
  bucket?: string;
}> = ({ label, value, onChange, bucket = 'property-images' }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    onChange(localUrl, file);
  };

  useEffect(() => { setPreview(value); }, [value]);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-hc-text uppercase tracking-wider font-body">{label}</label>
      <div className="flex gap-3 items-start">
        <button type="button" onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-hc-text-light/40 rounded-xl text-sm font-body text-hc-text-light hover:border-hc-primary hover:text-hc-primary transition-colors">
          <Upload size={15} /> Choose Image
        </button>
        {preview && (
          <img src={preview} alt="" className="w-16 h-16 object-cover rounded-xl"
            onError={e => (e.currentTarget.style.display = 'none')} />
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
};

// ─── Multi-Image Upload ───────────────────────────────────────────

const MultiImageUpload: React.FC<{
  label: string;
  items: PropertyImageForm[];
  onChange: (items: PropertyImageForm[]) => void;
  bucket?: string;
}> = ({ label, items, onChange, bucket = 'property-images' }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newItems = files.map((file, i) => ({
      image_url: URL.createObjectURL(file),
      alt_text: '',
      sort_order: items.length + i,
      file,
    }));
    onChange([...items, ...newItems]);
  };

  const move = (i: number, dir: -1 | 1) => {
    const n = [...items];
    const j = i + dir;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n.map((img, idx) => ({ ...img, sort_order: idx })));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-hc-text uppercase tracking-wider font-body">{label}</label>
        <Btn onClick={() => inputRef.current?.click()} size="sm" variant="secondary">
          <Upload size={13} /> Upload Images
        </Btn>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((img, i) => (
            <div key={i} className="flex flex-col gap-1">
              {/* Image with hover controls — alt text is OUTSIDE this div */}
              <div className="relative group aspect-square">
                <img src={img.image_url} alt="" className="w-full h-full object-cover rounded-xl"
                  onError={e => (e.currentTarget.style.display = 'none')} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-1">
                  <button onClick={() => move(i, -1)} className="w-7 h-7 bg-white/80 rounded-full flex items-center justify-center text-hc-primary">
                    <ChevronUp size={14} />
                  </button>
                  <button onClick={() => move(i, 1)} className="w-7 h-7 bg-white/80 rounded-full flex items-center justify-center text-hc-primary">
                    <ChevronDown size={14} />
                  </button>
                  <button onClick={() => onChange(items.filter((_, j) => j !== i))}
                    className="w-7 h-7 bg-red-500/90 rounded-full flex items-center justify-center text-white">
                    <X size={14} />
                  </button>
                </div>
              </div>
              {/* Alt text below image — never covered by overlay */}
              <input placeholder="Alt text" value={img.alt_text}
                onChange={e => { const n = [...items]; n[i].alt_text = e.target.value; onChange(n); }}
                className="w-full border border-hc-text-light/30 rounded-lg px-2 py-1 text-xs font-body focus:outline-none" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── String List ──────────────────────────────────────────────────

const StringList: React.FC<{ label: string; placeholder: string; items: string[]; onChange: (items: string[]) => void }> = ({ label, placeholder, items, onChange }) => {
  const [input, setInput] = useState('');
  const add = () => { if (!input.trim()) return; onChange([...items, input.trim()]); setInput(''); };
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-hc-text uppercase tracking-wider font-body">{label}</label>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 border border-hc-text-light/30 rounded-xl px-4 py-2.5 text-sm font-body bg-white focus:outline-none" />
        <Btn onClick={add} size="sm"><Plus size={14} />Add</Btn>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5 bg-hc-bg-alt text-hc-text text-xs font-body px-3 py-1.5 rounded-full">
            {item}
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-hc-text-light hover:text-red-500">
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── Dynamic Dropdown (with add/delete) ───────────────────────────

const DynamicSelect: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  table: string;
  nameField?: string;
  valueField?: string;
  orderField?: string;
}> = ({ label, value, onChange, table, nameField = 'name', valueField = 'slug', orderField = 'sort_order' }) => {
  const [items, setItems] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const load = useCallback(() => {
    (supabase.from(table as any) as any).select('*').order(orderField).then(({ data }: any) => {
      if (data) setItems(data);
    });
  }, [table, orderField]);

  useEffect(() => { load(); }, [load]);

  const add = async () => {
    if (!newName.trim()) return;
    const payload: any = { name: newName.trim() };
    if (valueField === 'slug') payload.slug = toSlug(newName.trim());
    const { error } = await (supabase.from(table as any) as any).insert(payload);
    if (!error) { setNewName(''); setAdding(false); load(); }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await (supabase.from(table as any) as any).delete().eq('id', id);
    load();
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-hc-text uppercase tracking-wider font-body">{label}</label>
      <div className="flex gap-2">
        <select value={value} onChange={e => onChange(e.target.value)}
          className="flex-1 border border-hc-text-light/30 rounded-xl px-4 py-2.5 text-sm font-body text-hc-text bg-white focus:outline-none">
          <option value="">Select {label}</option>
          {items.map(item => (
            <option key={item.id} value={item[valueField]}>{item[nameField]}</option>
          ))}
        </select>
        <Btn onClick={() => setAdding(v => !v)} size="sm" variant="secondary"><Plus size={14} /></Btn>
      </div>
      {adding && (
        <div className="flex gap-2">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder={`New ${label}`}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
            className="flex-1 border border-hc-text-light/30 rounded-xl px-4 py-2 text-sm font-body bg-white focus:outline-none" />
          <Btn onClick={add} size="sm">Add</Btn>
          <Btn onClick={() => setAdding(false)} size="sm" variant="secondary">Cancel</Btn>
        </div>
      )}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {items.map(item => (
            <span key={item.id} className="flex items-center gap-1 bg-hc-bg-alt text-hc-text text-xs px-2.5 py-1 rounded-full font-body">
              {item[nameField]}
              <button onClick={() => del(item.id)} className="text-hc-text-light hover:text-red-500 ml-0.5"><X size={10} /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Amenity Selector ─────────────────────────────────────────────

const AmenitySelector: React.FC<{ selected: string[]; onChange: (ids: string[]) => void }> = ({ selected, onChange }) => {
  const [amenities, setAmenities] = useState<any[]>([]);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  const load = () => {
    supabase.from('amenities').select('*').order('sort_order').then(({ data }) => {
      if (data) setAmenities(data);
    });
  };

  useEffect(() => { load(); }, []);

  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);

  const add = async () => {
    if (!newName.trim()) return;
    const { data } = await supabase.from('amenities').insert({ name: newName.trim() }).select().single();
    if (data) { setAmenities(prev => [...prev, data]); setNewName(''); setAdding(false); }
  };

  const del = async (id: string, name: string) => {
    if (!confirm(`Delete amenity "${name}"?`)) return;
    await supabase.from('amenities').delete().eq('id', id);
    onChange(selected.filter(s => s !== id));
    load();
  };

  const grouped = amenities.reduce((acc, a) => {
    const cat = a.category ?? 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(a);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-hc-text uppercase tracking-wider font-body">Amenities</label>
        <Btn onClick={() => setAdding(v => !v)} size="sm" variant="secondary"><Plus size={14} />New</Btn>
      </div>
      {adding && (
        <div className="flex gap-2">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Amenity name"
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
            className="flex-1 border border-hc-text-light/30 rounded-xl px-4 py-2 text-sm font-body bg-white focus:outline-none" />
          <Btn onClick={add} size="sm">Save</Btn>
        </div>
      )}
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat}>
          <p className="text-[10px] uppercase tracking-widest text-hc-text-light font-body mb-2">{cat}</p>
          <div className="flex flex-wrap gap-2">
            {(items as any[]).map(a => (
              <div key={a.id} className="flex items-center gap-0.5">
                <button type="button" onClick={() => toggle(a.id)}
                  className={`px-3 py-1.5 rounded-l-full text-xs font-body border transition-all ${
                    selected.includes(a.id)
                      ? 'bg-hc-primary text-white border-hc-primary'
                      : 'bg-white text-hc-text border-hc-text-light/30 hover:border-hc-primary'
                  }`}>
                  {a.name}
                </button>
                <button onClick={() => del(a.id, a.name)}
                  className="px-1.5 py-1.5 rounded-r-full border border-l-0 border-hc-text-light/30 text-hc-text-light hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Room Type Editor ─────────────────────────────────────────────

const RoomTypeEditor: React.FC<{ rooms: RoomTypeForm[]; onChange: (rooms: RoomTypeForm[]) => void }> = ({ rooms, onChange }) => {
  const add = () => onChange([...rooms, { name: '', bed_type: '', max_guests: 2, price_per_night: '', description: '', sort_order: rooms.length, images: [] }]);

  const update = (i: number, field: keyof RoomTypeForm, val: any) => {
    const n = [...rooms]; (n[i] as any)[field] = val; onChange(n);
  };

  const move = (i: number, dir: -1 | 1) => {
    const n = [...rooms];
    const j = i + dir;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-hc-text uppercase tracking-wider font-body">Room Types</label>
        <Btn onClick={add} size="sm" variant="secondary"><Plus size={14} />Add Room</Btn>
      </div>
      {rooms.map((room, i) => (
        <div key={i} className="bg-hc-bg-alt rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex items-start gap-2">
            <div className="flex flex-col gap-1 pt-1">
              <button onClick={() => move(i, -1)} className="p-1 hover:text-hc-primary text-hc-text-light"><ChevronUp size={14} /></button>
              <button onClick={() => move(i, 1)} className="p-1 hover:text-hc-primary text-hc-text-light"><ChevronDown size={14} /></button>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input placeholder="Room name" value={room.name} onChange={e => update(i, 'name', e.target.value)}
                  className="border border-hc-text-light/30 rounded-xl px-3 py-2 text-sm font-body bg-white focus:outline-none" />
                <input placeholder="Bed type (e.g. King)" value={room.bed_type} onChange={e => update(i, 'bed_type', e.target.value)}
                  className="border border-hc-text-light/30 rounded-xl px-3 py-2 text-sm font-body bg-white focus:outline-none" />
                <input type="number" placeholder="Max guests" value={room.max_guests} onChange={e => update(i, 'max_guests', parseInt(e.target.value) || 1)}
                  className="border border-hc-text-light/30 rounded-xl px-3 py-2 text-sm font-body bg-white focus:outline-none" />
                <input type="number" placeholder="Price / night (₹)" value={room.price_per_night} onChange={e => update(i, 'price_per_night', e.target.value)}
                  className="border border-hc-text-light/30 rounded-xl px-3 py-2 text-sm font-body bg-white focus:outline-none" />
              </div>
              <MarkdownEditor
                value={room.description}
                onChange={(v) => update(i, 'description', v)}
                placeholder="Short description (shown under bed type & guests)"
                rows={3}
              />
            </div>
            <button onClick={() => onChange(rooms.filter((_, j) => j !== i))} className="text-hc-text-light hover:text-red-500 shrink-0">
              <Trash2 size={16} />
            </button>
          </div>
          <MultiImageUpload
            label="Room Images"
            items={room.images}
            onChange={imgs => update(i, 'images', imgs)}
            bucket="room-images"
          />
        </div>
      ))}
    </div>
  );
};

// ─── Nearby Attractions ───────────────────────────────────────────

const AttractionEditor: React.FC<{ items: NearbyAttractionForm[]; onChange: (items: NearbyAttractionForm[]) => void }> = ({ items, onChange }) => {
  const add = () => onChange([...items, { name: '', distance_km: '', description: '' }]);
  const update = (i: number, field: keyof NearbyAttractionForm, val: string) => {
    const n = [...items]; (n[i] as any)[field] = val; onChange(n);
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-hc-text uppercase tracking-wider font-body">Nearby Attractions</label>
        <Btn onClick={add} size="sm" variant="secondary"><Plus size={14} />Add</Btn>
      </div>
      {items.map((a, i) => (
        <div key={i} className="bg-hc-bg-alt rounded-xl p-3 flex gap-2 items-start">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
            <input placeholder="Name" value={a.name} onChange={e => update(i, 'name', e.target.value)}
              className="border border-hc-text-light/30 rounded-lg px-3 py-2 text-sm font-body bg-white focus:outline-none" />
            <input placeholder="Distance (km)" value={a.distance_km} onChange={e => update(i, 'distance_km', e.target.value)}
              className="border border-hc-text-light/30 rounded-lg px-3 py-2 text-sm font-body bg-white focus:outline-none" />
            <input placeholder="Description" value={a.description} onChange={e => update(i, 'description', e.target.value)}
              className="border border-hc-text-light/30 rounded-lg px-3 py-2 text-sm font-body bg-white focus:outline-none" />
          </div>
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-hc-text-light hover:text-red-500 mt-2"><Trash2 size={16} /></button>
        </div>
      ))}
    </div>
  );
};

// ─── Itinerary Editor ─────────────────────────────────────────────

const ItineraryEditor: React.FC<{ days: ItineraryDay[]; onChange: (days: ItineraryDay[]) => void }> = ({ days, onChange }) => {
  const add = () => onChange([...days, { day: days.length + 1, title: '', subtitle: '', description: '', image: null }]);
  const update = (i: number, field: keyof ItineraryDay, val: string | number | File | null) => {
    const n = [...days]; (n[i] as any)[field] = val; onChange(n);
  };
  const handleImage = (i: number, file: File | undefined) => {
    if (!file) return;
    const n = [...days];
    n[i] = { ...n[i], image: URL.createObjectURL(file), imageFile: file };
    onChange(n);
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-hc-text uppercase tracking-wider font-body">Itinerary</label>
        <Btn onClick={add} size="sm" variant="secondary"><Plus size={14} />Add Day</Btn>
      </div>
      {days.map((day, i) => (
        <div key={i} className="bg-hc-bg-alt rounded-2xl p-4 flex flex-col gap-3 border-l-4 border-hc-secondary">
          <div className="flex items-center gap-2">
            <span className="font-headline text-hc-secondary text-2xl w-10 shrink-0">{String(day.day).padStart(2, '0')}</span>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
              <input placeholder="Day title" value={day.title} onChange={e => update(i, 'title', e.target.value)}
                className="border border-hc-text-light/30 rounded-lg px-3 py-2 text-sm font-body bg-white focus:outline-none" />
              <input placeholder="Subtitle" value={day.subtitle} onChange={e => update(i, 'subtitle', e.target.value)}
                className="border border-hc-text-light/30 rounded-lg px-3 py-2 text-sm font-body bg-white focus:outline-none" />
            </div>
            <button onClick={() => onChange(days.filter((_, j) => j !== i))} className="text-hc-text-light hover:text-red-500 shrink-0"><Trash2 size={16} /></button>
          </div>
          <MarkdownEditor
            value={day.description}
            onChange={(v) => update(i, 'description', v)}
            placeholder="Day description"
            rows={4}
          />
          <div className="flex items-center gap-3">
            {day.image ? (
              <div className="relative">
                <img src={day.image} alt="" className="w-24 h-24 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => { const n = [...days]; n[i] = { ...n[i], image: null, imageFile: undefined }; onChange(n); }}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow border border-hc-text-light/20 text-hc-text-light hover:text-red-500"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-lg bg-white border border-dashed border-hc-text-light/30 flex items-center justify-center text-hc-text-light text-xs">No photo</div>
            )}
            <label className="cursor-pointer inline-flex items-center gap-2 text-xs font-semibold text-hc-secondary font-body">
              <Upload size={13} />
              {day.image ? 'Replace photo' : 'Upload photo'}
              <input type="file" accept="image/*" className="hidden" onChange={e => handleImage(i, e.target.files?.[0])} />
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Package Gallery Editor ───────────────────────────────────────

const PackageGalleryEditor: React.FC<{ items: PackageGalleryForm[]; onChange: (items: PackageGalleryForm[]) => void }> = ({ items, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newItems = files.map((file, i) => ({
      image_url: URL.createObjectURL(file),
      alt_text: '',
      display_order: items.length + i,
      file,
    }));
    onChange([...items, ...newItems]);
  };

  const move = (i: number, dir: -1 | 1) => {
    const n = [...items];
    const j = i + dir;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n.map((img, idx) => ({ ...img, display_order: idx })));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-hc-text uppercase tracking-wider font-body">Package Gallery</label>
        <Btn onClick={() => inputRef.current?.click()} size="sm" variant="secondary"><Upload size={13} />Upload</Btn>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((img, i) => (
            <div key={i} className="relative group">
              <img src={img.image_url} alt="" className="w-full aspect-square object-cover rounded-xl" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-1">
                <button onClick={() => move(i, -1)} className="w-7 h-7 bg-white/80 rounded-full flex items-center justify-center"><ChevronUp size={14} /></button>
                <button onClick={() => move(i, 1)} className="w-7 h-7 bg-white/80 rounded-full flex items-center justify-center"><ChevronDown size={14} /></button>
                <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="w-7 h-7 bg-red-500/90 rounded-full flex items-center justify-center text-white"><X size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Hero Images Editor ───────────────────────────────────────────

const HeroImagesEditor: React.FC<{ items: { url: string; file?: File }[]; onChange: (items: { url: string; file?: File }[]) => void }> = ({ items, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newItems = files.map(file => ({ url: URL.createObjectURL(file), file }));
    onChange([...items, ...newItems]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-hc-text uppercase tracking-wider font-body">Hero Images</label>
        <Btn onClick={() => inputRef.current?.click()} size="sm" variant="secondary"><Upload size={13} />Upload</Btn>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((img, i) => (
            <div key={i} className="relative group">
              <img src={img.url} alt="" className="w-full aspect-square object-cover rounded-xl" />
              <button onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500/90 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Property Form ────────────────────────────────────────────────

const emptyProperty = (): PropertyForm => ({
  name: '', slug: '', district: '', property_type: '', tagline: '', description: '',
  highlights: [], tags: [], terms_conditions: [], max_guests: 2, price_per_night: '',
  latitude: '', longitude: '', cover_image: '', location: '', is_featured: false, is_published: false,
  sort_order: 0, property_images: [], room_types: [], amenity_ids: [], nearby_attractions: [],
});

const PropertyFormPage: React.FC<{
  initial?: PropertyForm | null;
  onSave: () => void;
  onCancel: () => void;
  onToast: (msg: string, type: 'success' | 'error') => void;
}> = ({ initial, onSave, onCancel, onToast }) => {
  const [form, setForm] = useState<PropertyForm>(initial ?? emptyProperty());
  const [saving, setSaving] = useState(false);
  const isEdit = !!form.id;

  const set = <K extends keyof PropertyForm>(key: K, val: PropertyForm[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleNameChange = (val: string) =>
    setForm(prev => ({ ...prev, name: val, slug: toSlug(val) }));

  const handleSubmit = async () => {
    if (!form.name || !form.slug) { onToast('Name and slug are required', 'error'); return; }
    if (form.is_featured) {
      const capError = await checkFeaturedCap('properties', true, form.id);
      if (capError) { onToast(capError, 'error'); return; }
    }
    setSaving(true);
    try {
      // Upload cover image if file selected
      let coverImageUrl = form.cover_image;
      if (form.cover_image_file) {
        coverImageUrl = await uploadFile(form.cover_image_file, 'property-images', 'covers/');
      }

      const payload = {
        name: form.name, slug: form.slug, district: form.district, property_type: form.property_type,
        tagline: form.tagline || null, description: form.description || null,
        location: form.location || null,
        highlights: form.highlights.length ? form.highlights : null,
        tags: form.tags.length ? form.tags : null,
        terms_conditions: form.terms_conditions.length ? form.terms_conditions : null,
        max_guests: form.max_guests,
        price_per_night: form.price_per_night ? parseFloat(form.price_per_night) : null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        cover_image: coverImageUrl || null,
        is_featured: form.is_featured, is_published: form.is_published,
        sort_order: form.sort_order,
      };

      let propertyId = form.id;
      if (isEdit) {
        const { error } = await supabase.from('properties').update(payload).eq('id', form.id!);
        if (error) throw error;
      } else {
        // Auto-assign next highest sort_order if not explicitly set
        let nextSortOrder = payload.sort_order;
        if (!nextSortOrder || nextSortOrder === 0) {
          const { data: maxRow } = await supabase
            .from('properties')
            .select('sort_order')
            .order('sort_order', { ascending: false })
            .limit(1)
            .maybeSingle();
          nextSortOrder = ((maxRow?.sort_order ?? 0) as number) + 1;
        }
        const { data, error } = await supabase
          .from('properties')
          .insert({ ...payload, sort_order: nextSortOrder })
          .select()
          .single();
        if (error) throw error;
        propertyId = (data as any).id;
      }

      // Upload and save property images
      if (isEdit) await supabase.from('property_images').delete().eq('property_id', propertyId!);
      const validImages = form.property_images.filter(img => img.image_url || img.file);
      if (validImages.length) {
        const uploaded = await Promise.all(validImages.map(async (img, i) => {
          const url = img.file ? await uploadFile(img.file, 'property-images', 'gallery/') : img.image_url;
          return { property_id: propertyId!, image_url: url, alt_text: img.alt_text || null, sort_order: i };
        }));
        await supabase.from('property_images').insert(uploaded);
      }

      // Save room types with images
      if (isEdit) {
        const { data: oldRooms } = await supabase.from('room_types').select('id').eq('property_id', propertyId!);
        if (oldRooms?.length) {
          await supabase.from('room_type_images').delete().in('room_type_id', oldRooms.map((r: any) => r.id));
        }
        await supabase.from('room_types').delete().eq('property_id', propertyId!);
      }
      const validRooms = form.room_types.filter(r => r.name.trim());
      for (let i = 0; i < validRooms.length; i++) {
        const r = validRooms[i];
        const { data: roomData } = await supabase.from('room_types').insert({
          property_id: propertyId!, name: r.name, bed_type: r.bed_type || null,
          max_guests: r.max_guests, sort_order: i,
          price_per_night: r.price_per_night ? parseFloat(r.price_per_night) : null,
          description: r.description || null,
        }).select().single();
        if (roomData && r.images.length) {
          const roomImgs = await Promise.all(r.images.map(async (img, j) => {
            const url = img.file ? await uploadFile(img.file, 'room-images', `${propertyId}/`) : img.image_url;
            return { room_type_id: (roomData as any).id, image_url: url, alt_text: img.alt_text || null, sort_order: j };
          }));
          await supabase.from('room_type_images').insert(roomImgs);
        }
      }

      // Save amenities
      if (isEdit) await supabase.from('property_amenities').delete().eq('property_id', propertyId!);
      if (form.amenity_ids.length) {
        await supabase.from('property_amenities').insert(
          form.amenity_ids.map(amenity_id => ({ property_id: propertyId!, amenity_id }))
        );
      }

      // Save nearby attractions
      if (isEdit) await supabase.from('nearby_attractions').delete().eq('property_id', propertyId!);
      const validAttractions = form.nearby_attractions.filter(a => a.name.trim());
      if (validAttractions.length) {
        await supabase.from('nearby_attractions').insert(
          validAttractions.map(a => ({
            property_id: propertyId!, name: a.name,
            distance_km: a.distance_km ? parseFloat(a.distance_km) : null,
            description: a.description || null,
          }))
        );
      }

      onToast(isEdit ? 'Property updated!' : 'Property created!', 'success');
      onSave();
    } catch (err: any) {
      onToast(err.message ?? 'Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-headline text-hc-primary text-2xl">{isEdit ? 'Edit Property' : 'Add New Property'}</h2>
          <p className="text-sm text-hc-text-light font-body mt-1">Saved data appears on the live site instantly</p>
        </div>
        <div className="flex gap-3">
          <Btn onClick={onCancel} variant="secondary">Cancel</Btn>
          <Btn onClick={handleSubmit} disabled={saving}><Save size={16} />{saving ? 'Saving...' : 'Save Property'}</Btn>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <SectionCard title="Basic Info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Property Name *" value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Mist Valley Treehouse" />
            <Input label="Slug (URL) *" value={form.slug} onChange={e => set('slug', e.target.value)} />
            <DynamicSelect label="District *" value={form.district} onChange={v => set('district', v)} table="districts" valueField="slug" />
            <DynamicSelect label="Property Type *" value={form.property_type} onChange={v => set('property_type', v)} table="property_types" valueField="slug" />
            <Input label="Tagline" value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Nature meets comfort above the clouds" />
            <Input label="Location" value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Vythiri Village, Wayanad" />
            <Input label="Max Guests" type="number" value={form.max_guests} onChange={e => set('max_guests', parseInt(e.target.value) || 1)} />
            <Input label="Price Per Night (₹)" type="number" value={form.price_per_night} onChange={e => set('price_per_night', e.target.value)} placeholder="Leave blank = Contact for Pricing" />
            <Input label="Sort Order" type="number" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
          </div>
          <div className="mt-4">
            <MarkdownEditor label="Description" value={form.description} onChange={(v) => set('description', v)} placeholder="Describe this property..." />
          </div>
        </SectionCard>

        <SectionCard title="Cover Image">
          <ImageUpload label="Cover Photo" value={form.cover_image} onChange={(url, file) => setForm(p => ({ ...p, cover_image: url, cover_image_file: file }))} bucket="property-images" />
        </SectionCard>

        <SectionCard title="Gallery Images">
          <MultiImageUpload label="Property Photos" items={form.property_images} onChange={imgs => set('property_images', imgs)} bucket="property-images" />
        </SectionCard>

        <SectionCard title="Location">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Latitude" type="number" step="any" value={form.latitude} onChange={e => set('latitude', e.target.value)} placeholder="e.g. 11.6854" />
            <Input label="Longitude" type="number" step="any" value={form.longitude} onChange={e => set('longitude', e.target.value)} placeholder="e.g. 76.1320" />
          </div>
          <p className="text-xs text-hc-text-light font-body mt-2">Right-click any location on Google Maps → "What's here?"</p>
        </SectionCard>

        <SectionCard title="Tags">
          <StringList label="Tags (shown on listing card)" placeholder="e.g. Treehouse, Romantic, Family" items={form.tags} onChange={t => set('tags', t)} />
        </SectionCard>

        <SectionCard title="Highlights">
          <StringList label="Highlights" placeholder="e.g. Private infinity pool overlooking the valley" items={form.highlights} onChange={h => set('highlights', h)} />
        </SectionCard>

        <SectionCard title="Terms & Conditions">
          <StringList label="Terms" placeholder="e.g. Check-in at 2PM, Check-out at 11AM" items={form.terms_conditions} onChange={t => set('terms_conditions', t)} />
        </SectionCard>

        <SectionCard title="Amenities">
          <AmenitySelector selected={form.amenity_ids} onChange={ids => set('amenity_ids', ids)} />
        </SectionCard>

        <SectionCard title="Room Types">
          <RoomTypeEditor rooms={form.room_types} onChange={r => set('room_types', r)} />
        </SectionCard>

        <SectionCard title="Nearby Attractions">
          <AttractionEditor items={form.nearby_attractions} onChange={a => set('nearby_attractions', a)} />
        </SectionCard>

        <SectionCard title="Visibility">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Toggle label="Featured (show on homepage)" checked={form.is_featured} onChange={v => set('is_featured', v)} />
            <Toggle label="Published (visible on site)" checked={form.is_published} onChange={v => set('is_published', v)} />
          </div>
        </SectionCard>

        <div className="flex gap-3 justify-end pb-10">
          <Btn onClick={onCancel} variant="secondary">Cancel</Btn>
          <Btn onClick={handleSubmit} disabled={saving}><Save size={16} />{saving ? 'Saving...' : 'Save Property'}</Btn>
        </div>
      </div>
    </div>
  );
};

// ─── Package Form ─────────────────────────────────────────────────

const emptyPackage = (): PackageForm => ({
  name: '', slug: '', location: '', region: '', price_inr: '', duration_days: '',
  duration_nights: '', distance_km: '', min_participants: '', max_participants: '',
  lat: '', lng: '', hero_images: [], instagram_hashtag: '', is_featured: false,
  is_published: false, sort_order: 0, tags: [], itinerary: [],
  whats_not_included: [], terms_conditions: [], gallery: [],
});

const PackageFormPage: React.FC<{
  initial?: PackageForm | null;
  onSave: () => void;
  onCancel: () => void;
  onToast: (msg: string, type: 'success' | 'error') => void;
}> = ({ initial, onSave, onCancel, onToast }) => {
  const [form, setForm] = useState<PackageForm>(initial ?? emptyPackage());
  const [saving, setSaving] = useState(false);
  const isEdit = !!form.id;

  const set = <K extends keyof PackageForm>(key: K, val: PackageForm[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleNameChange = (val: string) =>
    setForm(prev => ({ ...prev, name: val, slug: toSlug(val) }));

  const handleSubmit = async () => {
    if (!form.name || !form.slug) { onToast('Name and slug are required', 'error'); return; }
    if (form.is_featured) {
      const capError = await checkFeaturedCap('packages', true, form.id);
      if (capError) { onToast(capError, 'error'); return; }
    }
    setSaving(true);
    try {
      // Upload hero images
      const uploadedHeroes = await Promise.all(
        form.hero_images.map(img =>
          img.file ? uploadFile(img.file, 'package-images', 'hero/') : Promise.resolve(img.url)
        )
      );

      // Upload itinerary day images
      const uploadedItinerary = await Promise.all(
        form.itinerary.map(async (day) => {
          let imageUrl: string | null = day.image ?? null;
          if (day.imageFile) {
            imageUrl = await uploadFile(day.imageFile, 'package-images', 'itinerary/');
          } else if (imageUrl && imageUrl.startsWith('blob:')) {
            imageUrl = null;
          }
          return {
            day: day.day,
            title: day.title,
            subtitle: day.subtitle,
            description: day.description,
            image: imageUrl,
          };
        })
      );

      const payload = {
        name: form.name, slug: form.slug, location: form.location || null, region: form.region || null,
        price_inr: form.price_inr ? parseFloat(form.price_inr) : null,
        duration_days: form.duration_days ? parseInt(form.duration_days) : null,
        duration_nights: form.duration_nights ? parseInt(form.duration_nights) : null,
        distance_km: form.distance_km ? parseFloat(form.distance_km) : null,
        min_participants: form.min_participants ? parseInt(form.min_participants) : null,
        max_participants: form.max_participants ? parseInt(form.max_participants) : null,
        coordinates: form.lat && form.lng ? { lat: parseFloat(form.lat), lng: parseFloat(form.lng) } : null,
        hero_images: uploadedHeroes.filter(Boolean),
        instagram_hashtag: form.instagram_hashtag || null,
        is_featured: form.is_featured, is_published: form.is_published,
        sort_order: form.sort_order,
        tags: form.tags.length ? form.tags : null,
        itinerary: uploadedItinerary.length ? uploadedItinerary : null,
        whats_not_included: form.whats_not_included.length ? form.whats_not_included : null,
        terms_conditions: form.terms_conditions.length ? form.terms_conditions : null,
      };

      let packageId = form.id;
      if (isEdit) {
        const { error } = await (supabase.from('packages' as any) as any).update(payload).eq('id', form.id!);
        if (error) throw error;
      } else {
        const { data, error } = await (supabase.from('packages' as any) as any).insert(payload).select().single();
        if (error) throw error;
        packageId = (data as any).id;
      }

      // Save gallery
      if (isEdit) await (supabase.from('package_gallery' as any) as any).delete().eq('package_id', packageId!);
      const validGallery = form.gallery.filter(g => g.image_url || g.file);
      if (validGallery.length) {
        const uploaded = await Promise.all(validGallery.map(async (g, i) => {
          const url = g.file ? await uploadFile(g.file, 'package-images', 'gallery/') : g.image_url;
          return { package_id: packageId!, image_url: url, alt_text: g.alt_text || null, display_order: i };
        }));
        await (supabase.from('package_gallery' as any) as any).insert(uploaded);
      }

      onToast(isEdit ? 'Package updated!' : 'Package created!', 'success');
      onSave();
    } catch (err: any) {
      onToast(err.message ?? 'Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-headline text-hc-primary text-2xl">{isEdit ? 'Edit Package' : 'Add New Package'}</h2>
          <p className="text-sm text-hc-text-light font-body mt-1">Saved data appears on the live site instantly</p>
        </div>
        <div className="flex gap-3">
          <Btn onClick={onCancel} variant="secondary">Cancel</Btn>
          <Btn onClick={handleSubmit} disabled={saving}><Save size={16} />{saving ? 'Saving...' : 'Save Package'}</Btn>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <SectionCard title="Basic Info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Package Name *" value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Wayanad Wildlife Trail" />
            <Input label="Slug *" value={form.slug} onChange={e => set('slug', e.target.value)} />
            <Input label="Location" value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Wayanad, Kerala" />
            <DynamicSelect label="Region" value={form.region} onChange={v => set('region', v)} table="regions" valueField="name" orderField="sort_order" />
            <Input label="Price (₹ per person)" type="number" value={form.price_inr} onChange={e => set('price_inr', e.target.value)} />
            <Input label="Instagram Hashtag" value={form.instagram_hashtag} onChange={e => set('instagram_hashtag', e.target.value)} placeholder="hillscampwayanad (no #)" />
            <Input label="Sort Order" type="number" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
          </div>
        </SectionCard>

        <SectionCard title="Duration, Distance & Participants">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input label="Days" type="number" value={form.duration_days} onChange={e => set('duration_days', e.target.value)} placeholder="3" />
            <Input label="Nights" type="number" value={form.duration_nights} onChange={e => set('duration_nights', e.target.value)} placeholder="2" />
            <Input label="Distance (km)" type="number" value={form.distance_km} onChange={e => set('distance_km', e.target.value)} />
            <div />
            <Input label="Min Participants" type="number" value={form.min_participants} onChange={e => set('min_participants', e.target.value)} placeholder="4" />
            <Input label="Max Participants" type="number" value={form.max_participants} onChange={e => set('max_participants', e.target.value)} placeholder="12" />
          </div>
        </SectionCard>

        <SectionCard title="Hero Images">
          <HeroImagesEditor items={form.hero_images} onChange={imgs => set('hero_images', imgs)} />
        </SectionCard>

        <SectionCard title="Gallery">
          <PackageGalleryEditor items={form.gallery} onChange={g => set('gallery', g)} />
        </SectionCard>

        <SectionCard title="Location Coordinates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Latitude" type="number" step="any" value={form.lat} onChange={e => set('lat', e.target.value)} placeholder="11.6854" />
            <Input label="Longitude" type="number" step="any" value={form.lng} onChange={e => set('lng', e.target.value)} placeholder="76.1320" />
          </div>
        </SectionCard>

        <SectionCard title="Tags">
          <StringList label="Tags" placeholder="e.g. adventure, wildlife, family" items={form.tags} onChange={t => set('tags', t)} />
        </SectionCard>

        <SectionCard title="Itinerary">
          <ItineraryEditor days={form.itinerary} onChange={d => set('itinerary', d)} />
        </SectionCard>

        <SectionCard title="What's Not Included">
          <StringList label="Items" placeholder="e.g. Airfare not included" items={form.whats_not_included} onChange={w => set('whats_not_included', w)} />
        </SectionCard>

        <SectionCard title="Terms & Conditions">
          <StringList label="Terms" placeholder="e.g. 50% advance required at booking" items={form.terms_conditions} onChange={t => set('terms_conditions', t)} />
        </SectionCard>

        <SectionCard title="Visibility">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Toggle label="Featured (show on homepage)" checked={form.is_featured} onChange={v => set('is_featured', v)} />
            <Toggle label="Published (visible on site)" checked={form.is_published} onChange={v => set('is_published', v)} />
          </div>
        </SectionCard>

        <div className="flex gap-3 justify-end pb-10">
          <Btn onClick={onCancel} variant="secondary">Cancel</Btn>
          <Btn onClick={handleSubmit} disabled={saving}><Save size={16} />{saving ? 'Saving...' : 'Save Package'}</Btn>
        </div>
      </div>
    </div>
  );
};

// ─── Properties Tab ───────────────────────────────────────────────

const PropertiesTab: React.FC<{ onToast: (msg: string, type: 'success' | 'error') => void }> = ({ onToast }) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [editing, setEditing] = useState<PropertyForm | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('properties').select('*').order('sort_order').order('created_at', { ascending: false });
    setProperties(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleEdit = async (prop: any) => {
    const [imagesRes, roomsRes, amenitiesRes, attractionsRes] = await Promise.all([
      supabase.from('property_images').select('*').eq('property_id', prop.id).order('sort_order'),
      supabase.from('room_types').select('*, room_type_images(*)').eq('property_id', prop.id).order('sort_order'),
      supabase.from('property_amenities').select('amenity_id').eq('property_id', prop.id),
      supabase.from('nearby_attractions').select('*').eq('property_id', prop.id),
    ]);
    const form: PropertyForm = {
      ...prop,
      price_per_night: prop.price_per_night?.toString() ?? '',
      latitude: prop.latitude?.toString() ?? '',
      longitude: prop.longitude?.toString() ?? '',
      location: prop.location ?? '',
      highlights: prop.highlights ?? [],
      tags: prop.tags ?? [],
      terms_conditions: prop.terms_conditions ?? [],
      property_images: (imagesRes.data ?? []).map((img: any) => ({
        id: img.id, image_url: img.image_url, alt_text: img.alt_text ?? '', sort_order: img.sort_order,
      })),
      room_types: (roomsRes.data ?? []).map((r: any) => ({
        id: r.id, name: r.name, bed_type: r.bed_type ?? '', max_guests: r.max_guests,
        price_per_night: r.price_per_night?.toString() ?? '',
        description: r.description ?? '',
        sort_order: r.sort_order ?? 0,
        images: (r.room_type_images ?? []).map((img: any) => ({
          id: img.id, image_url: img.image_url, alt_text: img.alt_text ?? '', sort_order: img.sort_order,
        })),
      })),
      amenity_ids: (amenitiesRes.data ?? []).map((a: any) => a.amenity_id),
      nearby_attractions: (attractionsRes.data ?? []).map((a: any) => ({
        id: a.id, name: a.name, distance_km: a.distance_km?.toString() ?? '', description: a.description ?? '',
      })),
    };
    setEditing(form);
    setView('edit');
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) { onToast(error.message, 'error'); return; }
    onToast('Property deleted', 'success');
    load();
  };

  const togglePublished = async (id: string, current: boolean) => {
    await supabase.from('properties').update({ is_published: !current }).eq('id', id);
    load();
  };

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= properties.length) return;
    const a = properties[i], b = properties[j];
    await Promise.all([
      supabase.from('properties').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('properties').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    load();
  };

  if (view === 'add') return <PropertyFormPage onSave={() => { load(); setView('list'); }} onCancel={() => setView('list')} onToast={onToast} />;
  if (view === 'edit' && editing) return <PropertyFormPage initial={editing} onSave={() => { load(); setView('list'); }} onCancel={() => setView('list')} onToast={onToast} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-headline text-hc-primary text-2xl">Properties</h2>
          <p className="text-sm text-hc-text-light font-body">{properties.length} total</p>
        </div>
        <Btn onClick={() => setView('add')}><Plus size={16} />Add Property</Btn>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-hc-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-headline text-hc-primary text-xl mb-2">No properties yet</p>
          <Btn onClick={() => setView('add')}><Plus size={16} />Add First Property</Btn>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {properties.map((prop, i) => (
            <div key={prop.id} className="bg-white border border-hc-text-light/15 rounded-2xl p-4 flex items-center gap-4">
              <div className="flex flex-col gap-1 shrink-0">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-hc-text-light hover:text-hc-primary disabled:opacity-30"><ChevronUp size={16} /></button>
                <button onClick={() => move(i, 1)} disabled={i === properties.length - 1} className="p-1 text-hc-text-light hover:text-hc-primary disabled:opacity-30"><ChevronDown size={16} /></button>
              </div>
              {prop.cover_image && (
                <img src={prop.cover_image} alt={prop.name} className="w-14 h-14 object-cover rounded-xl shrink-0"
                  onError={e => (e.currentTarget.style.display = 'none')} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-headline text-hc-primary text-base">{prop.name}</h3>
                  <span className={`text-[10px] font-body uppercase tracking-wider px-2 py-0.5 rounded-full ${prop.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {prop.is_published ? 'Live' : 'Draft'}
                  </span>
                  {prop.is_featured && <span className="text-[10px] font-body uppercase tracking-wider px-2 py-0.5 rounded-full bg-hc-accent-light text-hc-secondary">Featured</span>}
                </div>
                <p className="text-xs text-hc-text-light font-body mt-0.5">{prop.district} · {prop.property_type} · {prop.max_guests} guests</p>
                <p className="text-xs text-hc-text-light/60 font-body">/{prop.slug}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => togglePublished(prop.id, prop.is_published)} className="p-2 rounded-xl hover:bg-hc-bg-alt text-hc-text-light hover:text-hc-primary transition-colors">
                  {prop.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => handleEdit(prop)} className="p-2 rounded-xl hover:bg-hc-bg-alt text-hc-text-light hover:text-hc-primary transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(prop.id, prop.name)} className="p-2 rounded-xl hover:bg-red-50 text-hc-text-light hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Packages Tab ─────────────────────────────────────────────────

const PackagesTab: React.FC<{ onToast: (msg: string, type: 'success' | 'error') => void }> = ({ onToast }) => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [editing, setEditing] = useState<PackageForm | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase.from('packages' as any) as any).select('*').order('sort_order').order('created_at', { ascending: false });
    setPackages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleEdit = async (pkg: any) => {
    const { data: gallery } = await (supabase.from('package_gallery' as any) as any).select('*').eq('package_id', pkg.id).order('display_order');
    const coords = pkg.coordinates as { lat?: number; lng?: number } | null;
    const form: PackageForm = {
      ...pkg,
      price_inr: pkg.price_inr?.toString() ?? '',
      duration_days: pkg.duration_days?.toString() ?? '',
      duration_nights: pkg.duration_nights?.toString() ?? '',
      distance_km: pkg.distance_km?.toString() ?? '',
      min_participants: pkg.min_participants?.toString() ?? '',
      max_participants: pkg.max_participants?.toString() ?? '',
      lat: coords?.lat?.toString() ?? '',
      lng: coords?.lng?.toString() ?? '',
      hero_images: (pkg.hero_images ?? []).map((url: string) => ({ url })),
      tags: pkg.tags ?? [],
      itinerary: Array.isArray(pkg.itinerary) ? pkg.itinerary : [],
      whats_not_included: pkg.whats_not_included ?? [],
      terms_conditions: pkg.terms_conditions ?? [],
      instagram_hashtag: pkg.instagram_hashtag ?? '',
      is_featured: pkg.is_featured ?? false,
      is_published: pkg.is_published ?? true,
      sort_order: pkg.sort_order ?? 0,
      gallery: (gallery ?? []).map((g: any) => ({
        id: g.id, image_url: g.image_url, alt_text: g.alt_text ?? '', display_order: g.display_order ?? 0,
      })),
    };
    setEditing(form);
    setView('edit');
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const { error } = await (supabase.from('packages' as any) as any).delete().eq('id', id);
    if (error) { onToast(error.message, 'error'); return; }
    onToast('Package deleted', 'success');
    load();
  };

  const togglePublished = async (id: string, current: boolean) => {
    await (supabase.from('packages' as any) as any).update({ is_published: !current }).eq('id', id);
    load();
  };

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= packages.length) return;
    const a = packages[i], b = packages[j];
    await Promise.all([
      (supabase.from('packages' as any) as any).update({ sort_order: b.sort_order }).eq('id', a.id),
      (supabase.from('packages' as any) as any).update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    load();
  };

  if (view === 'add') return <PackageFormPage onSave={() => { load(); setView('list'); }} onCancel={() => setView('list')} onToast={onToast} />;
  if (view === 'edit' && editing) return <PackageFormPage initial={editing} onSave={() => { load(); setView('list'); }} onCancel={() => setView('list')} onToast={onToast} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-headline text-hc-primary text-2xl">Experience Packages</h2>
          <p className="text-sm text-hc-text-light font-body">{packages.length} total</p>
        </div>
        <Btn onClick={() => setView('add')}><Plus size={16} />Add Package</Btn>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-hc-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-headline text-hc-primary text-xl mb-2">No packages yet</p>
          <Btn onClick={() => setView('add')}><Plus size={16} />Add First Package</Btn>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {packages.map((pkg, i) => (
            <div key={pkg.id} className="bg-white border border-hc-text-light/15 rounded-2xl p-4 flex items-center gap-4">
              <div className="flex flex-col gap-1 shrink-0">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-hc-text-light hover:text-hc-primary disabled:opacity-30"><ChevronUp size={16} /></button>
                <button onClick={() => move(i, 1)} disabled={i === packages.length - 1} className="p-1 text-hc-text-light hover:text-hc-primary disabled:opacity-30"><ChevronDown size={16} /></button>
              </div>
              {pkg.hero_images?.[0] && (
                <img src={pkg.hero_images[0]} alt={pkg.name} className="w-14 h-14 object-cover rounded-xl shrink-0"
                  onError={e => (e.currentTarget.style.display = 'none')} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-headline text-hc-primary text-base">{pkg.name}</h3>
                  <span className={`text-[10px] font-body uppercase tracking-wider px-2 py-0.5 rounded-full ${pkg.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {pkg.is_published ? 'Live' : 'Draft'}
                  </span>
                  {pkg.is_featured && <span className="text-[10px] font-body uppercase tracking-wider px-2 py-0.5 rounded-full bg-hc-accent-light text-hc-secondary">Featured</span>}
                </div>
                <p className="text-xs text-hc-text-light font-body mt-0.5">
                  {pkg.location ?? '—'} · {pkg.duration_days ?? '?'}D/{pkg.duration_nights ?? '?'}N
                  {pkg.price_inr ? ` · ₹${Number(pkg.price_inr).toLocaleString('en-IN')}` : ''}
                </p>
                <p className="text-xs text-hc-text-light/60 font-body">/{pkg.slug}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => togglePublished(pkg.id, pkg.is_published)} className="p-2 rounded-xl hover:bg-hc-bg-alt text-hc-text-light hover:text-hc-primary transition-colors">
                  {pkg.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => handleEdit(pkg)} className="p-2 rounded-xl hover:bg-hc-bg-alt text-hc-text-light hover:text-hc-primary transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(pkg.id, pkg.name)} className="p-2 rounded-xl hover:bg-red-50 text-hc-text-light hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Reviews Tab ──────────────────────────────────────────────────

const ReviewsTab: React.FC<{ onToast: (msg: string, type: 'success' | 'error') => void }> = ({ onToast }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ReviewForm | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const emptyReview = (): ReviewForm => ({
    property_id: '', package_id: '', guest_name: '', guest_title: '', quote: '',
    initials: '', stayed_at: '', is_featured: false, is_approved: true, sort_order: 0,
  });

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase.from('reviews' as any) as any).select('*').order('sort_order').order('created_at', { ascending: false });
    setReviews(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    supabase.from('properties').select('id, name').then(({ data }) => { if (data) setProperties(data); });
    (supabase.from('packages' as any) as any).select('id, name').then(({ data }: any) => { if (data) setPackages(data); });
  }, []);

  const save = async () => {
    if (!editing || !editing.guest_name || !editing.quote) { onToast('Name and quote are required', 'error'); return; }
    setSaving(true);
    try {
      const payload = {
        ...editing,
        property_id: editing.property_id || null,
        package_id: editing.package_id || null,
      };
      if (editing.id) {
        await (supabase.from('reviews' as any) as any).update(payload).eq('id', editing.id);
      } else {
        await (supabase.from('reviews' as any) as any).insert(payload);
      }
      onToast(editing.id ? 'Review updated!' : 'Review added!', 'success');
      setEditing(null);
      load();
    } catch (err: any) {
      onToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await (supabase.from('reviews' as any) as any).delete().eq('id', id);
    onToast('Review deleted', 'success');
    load();
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    await (supabase.from('reviews' as any) as any).update({ is_featured: !current }).eq('id', id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-headline text-hc-primary text-2xl">Reviews & Testimonials</h2>
          <p className="text-sm text-hc-text-light font-body">Featured reviews appear on the homepage</p>
        </div>
        <Btn onClick={() => setEditing(emptyReview())}><Plus size={16} />Add Review</Btn>
      </div>

      {editing && (
        <div className="bg-white border border-hc-text-light/15 rounded-2xl p-6 mb-6">
          <h3 className="font-headline text-hc-primary text-lg mb-4">{editing.id ? 'Edit Review' : 'New Review'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input label="Guest Name *" value={editing.guest_name} onChange={e => setEditing(p => p ? { ...p, guest_name: e.target.value } : p)} />
            <Input label="Guest Title" value={editing.guest_title} onChange={e => setEditing(p => p ? { ...p, guest_title: e.target.value } : p)} placeholder="e.g. Architect, Mumbai" />
            <Input label="Stayed At" value={editing.stayed_at} onChange={e => setEditing(p => p ? { ...p, stayed_at: e.target.value } : p)} placeholder="e.g. Canopy at Vythiri" />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-hc-text uppercase tracking-wider font-body">Linked Property</label>
              <select value={editing.property_id} onChange={e => setEditing(p => p ? { ...p, property_id: e.target.value } : p)}
                className="border border-hc-text-light/30 rounded-xl px-4 py-2.5 text-sm font-body bg-white focus:outline-none">
                <option value="">None</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-hc-text uppercase tracking-wider font-body">Linked Package</label>
              <select value={editing.package_id} onChange={e => setEditing(p => p ? { ...p, package_id: e.target.value } : p)}
                className="border border-hc-text-light/30 rounded-xl px-4 py-2.5 text-sm font-body bg-white focus:outline-none">
                <option value="">None</option>
                {packages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <Textarea label="Quote *" value={editing.quote} onChange={e => setEditing(p => p ? { ...p, quote: e.target.value } : p)} placeholder="Guest review quote..." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <Toggle label="Featured (show on homepage)" checked={editing.is_featured} onChange={v => setEditing(p => p ? { ...p, is_featured: v } : p)} />
            <Toggle label="Approved (visible)" checked={editing.is_approved} onChange={v => setEditing(p => p ? { ...p, is_approved: v } : p)} />
          </div>
          <div className="flex gap-3 mt-4">
            <Btn onClick={() => setEditing(null)} variant="secondary">Cancel</Btn>
            <Btn onClick={save} disabled={saving}><Save size={16} />{saving ? 'Saving...' : 'Save Review'}</Btn>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-hc-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map(r => (
            <div key={r.id} className="bg-white border border-hc-text-light/15 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-headline text-hc-primary text-base">{r.guest_name}</span>
                    {r.guest_title && <span className="text-xs text-hc-text-light font-body">{r.guest_title}</span>}
                    {r.is_featured && <span className="text-[10px] font-body uppercase tracking-wider px-2 py-0.5 rounded-full bg-hc-accent-light text-hc-secondary">Featured</span>}
                    {!r.is_approved && <span className="text-[10px] font-body uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Hidden</span>}
                  </div>
                  <p className="text-sm text-hc-text font-body italic line-clamp-2">"{r.quote}"</p>
                  {r.stayed_at && <p className="text-xs text-hc-text-light font-body mt-1">Stayed at: {r.stayed_at}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleFeatured(r.id, r.is_featured)} title={r.is_featured ? 'Unfeature' : 'Feature on homepage'}
                    className={`p-2 rounded-xl transition-colors ${r.is_featured ? 'text-hc-secondary bg-hc-accent-light' : 'text-hc-text-light hover:text-hc-secondary hover:bg-hc-bg-alt'}`}>
                    <Star size={16} fill={r.is_featured ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={() => setEditing({ ...r, property_id: r.property_id ?? '', package_id: r.package_id ?? '', guest_title: r.guest_title ?? '', initials: r.initials ?? '', stayed_at: r.stayed_at ?? '' })}
                    className="p-2 rounded-xl hover:bg-hc-bg-alt text-hc-text-light hover:text-hc-primary transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => del(r.id)} className="p-2 rounded-xl hover:bg-red-50 text-hc-text-light hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {reviews.length === 0 && (
            <div className="text-center py-20">
              <p className="font-headline text-hc-primary text-xl mb-2">No reviews yet</p>
              <Btn onClick={() => setEditing(emptyReview())}><Plus size={16} />Add First Review</Btn>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Blog Tab ─────────────────────────────────────────────────────

const BlogTab: React.FC<{ onToast: (msg: string, type: 'success' | 'error') => void }> = ({ onToast }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogForm | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const emptyBlog = (): BlogForm => ({
    title: '', slug: '', excerpt: '', content: '', cover_image: '', category: '',
    tags: [], author_id: '', is_published: false, is_featured: false, read_time_minutes: '',
  });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    supabase.from('team_members').select('id, name').order('sort_order').then(({ data }) => {
      if (data) setTeamMembers(data);
    });
  }, []);

  const save = async () => {
    if (!editing || !editing.title || !editing.slug) { onToast('Title and slug are required', 'error'); return; }
    setSaving(true);
    try {
      let coverUrl = editing.cover_image;
      if (editing.cover_image_file) {
        coverUrl = await uploadFile(editing.cover_image_file, 'blog-images', 'covers/');
      }
      const payload = {
        title: editing.title, slug: editing.slug, excerpt: editing.excerpt || null,
        content: editing.content || null, cover_image: coverUrl || null,
        category: editing.category || null, tags: editing.tags.length ? editing.tags : null,
        author_id: editing.author_id || null,
        is_published: editing.is_published, is_featured: editing.is_featured,
        read_time_minutes: editing.read_time_minutes ? parseInt(editing.read_time_minutes) : null,
      };
      if (editing.id) {
        await supabase.from('blog_posts').update(payload).eq('id', editing.id);
      } else {
        await supabase.from('blog_posts').insert(payload);
      }
      onToast(editing.id ? 'Post updated!' : 'Post created!', 'success');
      setEditing(null);
      load();
    } catch (err: any) {
      onToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    onToast('Post deleted', 'success');
    load();
  };

  const set = (field: keyof BlogForm, val: any) =>
    setEditing(p => p ? { ...p, [field]: val } : p);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-headline text-hc-primary text-2xl">Blog Posts</h2>
          <p className="text-sm text-hc-text-light font-body">{posts.length} posts</p>
        </div>
        <Btn onClick={() => setEditing(emptyBlog())}><Plus size={16} />New Post</Btn>
      </div>

      {editing && (
        <div className="bg-white border border-hc-text-light/15 rounded-2xl p-6 mb-6">
          <h3 className="font-headline text-hc-primary text-lg mb-4">{editing.id ? 'Edit Post' : 'New Post'}</h3>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Title *" value={editing.title} onChange={e => { set('title', e.target.value); set('slug', toSlug(e.target.value)); }} />
              <Input label="Slug *" value={editing.slug} onChange={e => set('slug', e.target.value)} />
              <Input label="Category" value={editing.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Travel, Nature" />
              <Input label="Read Time (minutes)" type="number" value={editing.read_time_minutes} onChange={e => set('read_time_minutes', e.target.value)} />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-hc-text uppercase tracking-wider font-body">Author</label>
                <select value={editing.author_id} onChange={e => set('author_id', e.target.value)}
                  className="border border-hc-text-light/30 rounded-xl px-4 py-2.5 text-sm font-body bg-white focus:outline-none">
                  <option value="">No author</option>
                  {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            </div>
            <ImageUpload label="Cover Image" value={editing.cover_image}
              onChange={(url, file) => setEditing(p => p ? { ...p, cover_image: url, cover_image_file: file } : p)}
              bucket="blog-images" />
            <MarkdownEditor label="Excerpt" value={editing.excerpt} onChange={(v) => set('excerpt', v)} placeholder="Short description shown in blog listing..." rows={3} />
            <MarkdownEditor label="Content" value={editing.content} onChange={(v) => set('content', v)} placeholder="Full blog post content..." rows={12} />
            <StringList label="Tags" placeholder="e.g. wayanad, wildlife, travel" items={editing.tags} onChange={t => set('tags', t)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Toggle label="Published (visible on site)" checked={editing.is_published} onChange={v => set('is_published', v)} />
              <Toggle label="Featured (show prominently)" checked={editing.is_featured} onChange={v => set('is_featured', v)} />
            </div>
            <div className="flex gap-3">
              <Btn onClick={() => setEditing(null)} variant="secondary">Cancel</Btn>
              <Btn onClick={save} disabled={saving}><Save size={16} />{saving ? 'Saving...' : 'Save Post'}</Btn>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-hc-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map(post => (
            <div key={post.id} className="bg-white border border-hc-text-light/15 rounded-2xl p-4 flex items-center gap-4">
              {post.cover_image && (
                <img src={post.cover_image} alt={post.title} className="w-14 h-14 object-cover rounded-xl shrink-0"
                  onError={e => (e.currentTarget.style.display = 'none')} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-headline text-hc-primary text-base">{post.title}</h3>
                  <span className={`text-[10px] font-body uppercase tracking-wider px-2 py-0.5 rounded-full ${post.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                  {post.is_featured && <span className="text-[10px] font-body uppercase tracking-wider px-2 py-0.5 rounded-full bg-hc-accent-light text-hc-secondary">Featured</span>}
                </div>
                <p className="text-xs text-hc-text-light font-body mt-0.5">{post.category ?? 'Uncategorised'}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setEditing({ ...post, tags: post.tags ?? [], author_id: post.author_id ?? '', excerpt: post.excerpt ?? '', content: post.content ?? '', cover_image: post.cover_image ?? '', category: post.category ?? '', read_time_minutes: post.read_time_minutes?.toString() ?? '' })}
                  className="p-2 rounded-xl hover:bg-hc-bg-alt text-hc-text-light hover:text-hc-primary transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => del(post.id, post.title)} className="p-2 rounded-xl hover:bg-red-50 text-hc-text-light hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-20">
              <p className="font-headline text-hc-primary text-xl mb-2">No posts yet</p>
              <Btn onClick={() => setEditing(emptyBlog())}><Plus size={16} />Write First Post</Btn>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Collection Editor ────────────────────────────────────────────

const CollectionEditor: React.FC = () => {
  const [types, setTypes] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<{ name: string; collection: string; subtitle: string; cover_image: string; cover_image_file?: File }>({
    name: '', collection: '', subtitle: '', cover_image: '',
  });
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState('');

  const load = () => {
    (supabase.from('property_types' as any) as any).select('*').order('sort_order').then(({ data }: any) => {
      if (data) setTypes(data);
    });
  };

  useEffect(() => { load(); }, []);

  const startEdit = (type: any) => {
    setEditing(type.id);
    setForm({ name: type.name, collection: type.collection ?? '', subtitle: type.subtitle ?? '', cover_image: type.cover_image ?? '' });
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      let imageUrl = form.cover_image;
      if (form.cover_image_file) {
        imageUrl = await uploadFile(form.cover_image_file, 'general', 'collections/');
      }
      await (supabase.from('property_types' as any) as any).update({
        name: form.name, collection: form.collection || null,
        subtitle: form.subtitle || null, cover_image: imageUrl || null,
      }).eq('id', editing);
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const add = async () => {
    if (!newName.trim()) return;
    await (supabase.from('property_types' as any) as any).insert({ name: newName.trim(), slug: toSlug(newName.trim()) });
    setNewName('');
    load();
  };

  const del = async (id: string, name: string) => {
    if (!confirm(`Delete property type "${name}"? This may affect existing properties.`)) return;
    await (supabase.from('property_types' as any) as any).delete().eq('id', id);
    load();
  };

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= types.length) return;
    await Promise.all([
      (supabase.from('property_types' as any) as any).update({ sort_order: types[j].sort_order ?? j }).eq('id', types[i].id),
      (supabase.from('property_types' as any) as any).update({ sort_order: types[i].sort_order ?? i }).eq('id', types[j].id),
    ]);
    load();
  };

  return (
    <div className="bg-white border border-hc-text-light/15 rounded-2xl p-5">
      <h3 className="font-headline text-hc-primary text-base mb-4">Property Types & Collections</h3>
      <p className="text-xs text-hc-text-light font-body mb-4">The first 4 types (by sort order) appear in the homepage Collections grid. Set an image and subtitle for each.</p>

      <div className="flex gap-2 mb-4">
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Add new property type"
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          className="flex-1 border border-hc-text-light/30 rounded-xl px-3 py-2 text-sm font-body bg-white focus:outline-none" />
        <Btn onClick={add} size="sm"><Plus size={14} />Add</Btn>
      </div>

      <div className="flex flex-col gap-3">
        {types.map((type, i) => (
          <div key={type.id}>
            <div className="flex items-center gap-2 bg-hc-bg-alt rounded-xl px-3 py-2">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-hc-text-light hover:text-hc-primary disabled:opacity-30"><ChevronUp size={12} /></button>
                <button onClick={() => move(i, 1)} disabled={i === types.length - 1} className="text-hc-text-light hover:text-hc-primary disabled:opacity-30"><ChevronDown size={12} /></button>
              </div>
              {type.cover_image && (
                <img src={type.cover_image} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0"
                  onError={e => (e.currentTarget.style.display = 'none')} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body text-hc-text font-medium">{type.name}</p>
                {type.collection && <p className="text-xs font-body text-hc-text-light">{type.collection}</p>}
              </div>
              {i < 4 && <span className="text-[10px] font-body bg-hc-accent-light text-hc-secondary px-2 py-0.5 rounded-full">Homepage</span>}
              <button onClick={() => editing === type.id ? setEditing(null) : startEdit(type)}
                className="p-1.5 rounded-lg hover:bg-hc-bg text-hc-text-light hover:text-hc-primary transition-colors">
                <Edit2 size={14} />
              </button>
              <button onClick={() => del(type.id, type.name)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-hc-text-light hover:text-red-500 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>

            {editing === type.id && (
              <div className="border border-hc-text-light/15 rounded-xl p-4 mt-1 flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input label="Display Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                  <Input label="Collection Label" value={form.collection} onChange={e => setForm(p => ({ ...p, collection: e.target.value }))} placeholder="e.g. Canopy Retreats" />
                </div>
                <Input label="Subtitle (shown on hover)" value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} placeholder="e.g. Sleep 40 feet above the forest floor." />
                <ImageUpload label="Collection Cover Image" value={form.cover_image}
                  onChange={(url, file) => setForm(p => ({ ...p, cover_image: url, cover_image_file: file }))}
                  bucket="general" />
                <div className="flex gap-2">
                  <Btn onClick={() => setEditing(null)} variant="secondary" size="sm">Cancel</Btn>
                  <Btn onClick={save} disabled={saving} size="sm"><Save size={14} />{saving ? 'Saving...' : 'Save'}</Btn>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Settings Tab ─────────────────────────────────────────────────

const SettingsTab: React.FC<{ onToast: (msg: string, type: 'success' | 'error') => void }> = ({ onToast }) => {
  const LookupManager: React.FC<{ title: string; table: string; nameField?: string; extraField?: string; extraLabel?: string }> = ({
    title, table, nameField = 'name', extraField, extraLabel
  }) => {
    const [items, setItems] = useState<any[]>([]);
    const [newName, setNewName] = useState('');
    const [newExtra, setNewExtra] = useState('');

    const load = () => {
      (supabase.from(table as any) as any).select('*').order('sort_order').then(({ data }: any) => {
        if (data) setItems(data);
      });
    };

    useEffect(() => { load(); }, []);

    const add = async () => {
      if (!newName.trim()) return;
      const payload: any = { [nameField]: newName.trim() };
      if (table === 'districts' || table === 'property_types') payload.slug = toSlug(newName.trim());
      if (extraField && newExtra.trim()) payload[extraField] = newExtra.trim();
      const { error } = await (supabase.from(table as any) as any).insert(payload);
      if (error) { onToast(error.message, 'error'); return; }
      setNewName(''); setNewExtra(''); load();
    };

    const del = async (id: string) => {
      if (!confirm('Delete this item? This may affect existing properties/packages.')) return;
      await (supabase.from(table as any) as any).delete().eq('id', id);
      load();
    };

    const move = async (i: number, dir: -1 | 1) => {
      const j = i + dir;
      if (j < 0 || j >= items.length) return;
      const a = items[i], b = items[j];
      await Promise.all([
        (supabase.from(table as any) as any).update({ sort_order: b.sort_order ?? j }).eq('id', a.id),
        (supabase.from(table as any) as any).update({ sort_order: a.sort_order ?? i }).eq('id', b.id),
      ]);
      load();
    };

    return (
      <div className="bg-white border border-hc-text-light/15 rounded-2xl p-5">
        <h3 className="font-headline text-hc-primary text-base mb-4">{title}</h3>
        <div className="flex gap-2 mb-4">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder={`Add new ${title.toLowerCase()}`}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
            className="flex-1 border border-hc-text-light/30 rounded-xl px-3 py-2 text-sm font-body bg-white focus:outline-none" />
          {extraField && (
            <input value={newExtra} onChange={e => setNewExtra(e.target.value)} placeholder={extraLabel ?? extraField}
              className="flex-1 border border-hc-text-light/30 rounded-xl px-3 py-2 text-sm font-body bg-white focus:outline-none" />
          )}
          <Btn onClick={add} size="sm"><Plus size={14} />Add</Btn>
        </div>
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={item.id} className="flex items-center gap-2 bg-hc-bg-alt rounded-xl px-3 py-2">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-hc-text-light hover:text-hc-primary disabled:opacity-30"><ChevronUp size={12} /></button>
                <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-hc-text-light hover:text-hc-primary disabled:opacity-30"><ChevronDown size={12} /></button>
              </div>
              <span className="flex-1 text-sm font-body text-hc-text">{item[nameField]}</span>
              {extraField && item[extraField] && <span className="text-xs font-body text-hc-text-light">{item[extraField]}</span>}
              {'slug' in item && <span className="text-xs text-hc-text-light/60 font-body">/{item.slug}</span>}
              <button onClick={() => del(item.id)} className="text-hc-text-light hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-headline text-hc-primary text-2xl">Settings</h2>
        <p className="text-sm text-hc-text-light font-body">Manage dropdown options used across properties and packages</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LookupManager title="Locations" table="locations" />
        <LookupManager title="Districts" table="districts" />
        <CollectionEditor />
        <LookupManager title="Regions" table="regions" />
        <LookupManager title="Amenities" table="amenities" extraField="category" extraLabel="Category" />
      </div>
    </div>
  );
};

// ─── Password Gate ────────────────────────────────────────────────

const PasswordGate: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);

  const check = () => {
    if (pw === ADMIN_PASSWORD) { onUnlock(); }
    else { setError(true); setPw(''); setTimeout(() => setError(false), 2000); }
  };

  return (
    <div className="min-h-screen bg-hc-bg flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-sm border border-hc-text-light/10">
        <div className="text-center mb-8">
          <Logo variant="dark" className="h-16 mx-auto" />
          <p className="font-body text-hc-text-light text-sm mt-4">Admin Panel</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              placeholder="Enter admin password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && check()}
              className={`w-full border rounded-xl px-4 py-3 text-sm font-body focus:outline-none pr-10 transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-hc-text-light/30'}`}
            />
            <button type="button" onClick={() => setShow(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-hc-text-light text-xs">
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 font-body text-center">Incorrect password</p>}
          <button onClick={check} className="bg-hc-primary text-white rounded-xl py-3 font-semibold font-body hover:bg-hc-primary-deep transition-colors">
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Admin Page ──────────────────────────────────────────────

const Admin: React.FC = () => {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('hc_admin') === '1');
  const [activeTab, setActiveTab] = useState<'properties' | 'packages' | 'reviews' | 'blog' | 'settings'>('properties');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const unlock = () => { sessionStorage.setItem('hc_admin', '1'); setUnlocked(true); };
  const logout = () => { sessionStorage.removeItem('hc_admin'); setUnlocked(false); };
  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  if (!unlocked) return <PasswordGate onUnlock={unlock} />;

  const tabs = [
    { key: 'properties' as const, label: 'Properties', icon: <Home size={15} /> },
    { key: 'packages'   as const, label: 'Packages',   icon: <Package size={15} /> },
    { key: 'reviews'    as const, label: 'Reviews',     icon: <Star size={15} /> },
    { key: 'blog'       as const, label: 'Blog',        icon: <FileText size={15} /> },
    { key: 'settings'   as const, label: 'Settings',    icon: <Settings size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-hc-bg">
      <header className="bg-white border-b border-hc-text-light/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="dark" className="h-10" />
            <span className="text-xs font-body text-hc-text-light bg-hc-bg-alt px-2 py-1 rounded-full">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-body text-hc-text-light hover:text-hc-primary px-3 py-2 rounded-xl hover:bg-hc-bg-alt transition-colors">
              <Eye size={14} /> View Site
            </a>
            <button onClick={logout}
              className="flex items-center gap-1.5 text-xs font-body text-hc-text-light hover:text-hc-primary px-3 py-2 rounded-xl hover:bg-hc-bg-alt transition-colors">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-hc-text-light/10">
        <div className="max-w-6xl mx-auto px-6 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-body font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-hc-primary text-hc-primary'
                    : 'border-transparent text-hc-text-light hover:text-hc-text'
                }`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'properties' && <PropertiesTab onToast={showToast} />}
        {activeTab === 'packages'   && <PackagesTab onToast={showToast} />}
        {activeTab === 'reviews'    && <ReviewsTab onToast={showToast} />}
        {activeTab === 'blog'       && <BlogTab onToast={showToast} />}
        {activeTab === 'settings'   && <SettingsTab onToast={showToast} />}
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Admin;
