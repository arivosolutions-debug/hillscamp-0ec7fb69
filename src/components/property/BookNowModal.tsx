import React, { useState } from 'react';
import { MessageCircle, ChevronDown, ChevronUp, Calendar as CalendarIcon } from 'lucide-react';
import { format, differenceInCalendarDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { RoomType } from '@/lib/types';

interface BookNowModalProps {
  propertyName: string;
  phone: string;
  rooms?: RoomType[];
}

export const BookNowModal: React.FC<BookNowModalProps> = ({ propertyName, phone, rooms = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [guests, setGuests] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();

  const today = new Date();
  const fromYear = today.getFullYear();
  const toYear = fromYear + 3;

  const nights =
    checkIn && checkOut ? Math.max(0, differenceInCalendarDays(checkOut, checkIn)) : 0;

  const handleSubmit = () => {
    const roomLabel = selectedRoom || 'Not specified';
    const datesLine =
      checkIn && checkOut && nights > 0
        ? `Check-in: ${format(checkIn, 'EEE, d MMM yyyy')}\nCheck-out: ${format(checkOut, 'EEE, d MMM yyyy')}\nNights: ${nights}`
        : checkIn
        ? `Check-in: ${format(checkIn, 'EEE, d MMM yyyy')}\nCheck-out: Not specified\nDates: Flexible`
        : `Dates: Flexible`;
    const msg = encodeURIComponent(
      `Hi, I'd like to book ${propertyName}.\nRoom: ${roomLabel}\n${datesLine}\nName: ${name}\nPhone: ${phoneNum}\nGuests: ${guests}`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    setExpanded(false);
  };

  const dateBtnCls = (val?: Date) =>
    cn(
      'w-full bg-white rounded-xl px-4 py-3 text-sm font-body text-left flex items-center justify-between outline-none focus:ring-2 focus:ring-hc-primary/20',
      val ? 'text-hc-text' : 'text-hc-text/50'
    );

  return (
    <div className="px-5 mt-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full bg-[#496C4D] text-white rounded-full py-4 text-lg font-bold font-body hover:bg-[#496C4D]/90 transition-colors flex items-center justify-center gap-2"
      >
        Book Now {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {expanded && (
        <div className="mt-4 bg-surface-low rounded-2xl p-6 animate-accordion-down">
          <h2 className="font-headline text-2xl text-hc-primary mb-1">Book Your Stay</h2>
          <p className="font-headline italic text-hc-secondary text-sm mb-5">{propertyName}</p>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="bg-white rounded-xl px-4 py-3 text-sm font-body text-hc-text placeholder:text-hc-text/50 border-none outline-none focus:ring-2 focus:ring-hc-primary/20"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNum}
              onChange={e => setPhoneNum(e.target.value)}
              className="bg-white rounded-xl px-4 py-3 text-sm font-body text-hc-text placeholder:text-hc-text/50 border-none outline-none focus:ring-2 focus:ring-hc-primary/20"
            />

            {rooms.length > 0 && (
              <div className="relative">
                <select
                  value={selectedRoom}
                  onChange={e => setSelectedRoom(e.target.value)}
                  className="w-full bg-white rounded-xl px-4 py-3 text-sm font-body text-hc-text appearance-none border-none outline-none focus:ring-2 focus:ring-hc-primary/20 pr-10"
                >
                  <option value="">Select a Room</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-hc-text/50 pointer-events-none" />
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className={dateBtnCls(checkIn)}>
                    <span className="truncate">
                      {checkIn ? format(checkIn, 'd MMM yyyy') : 'Check-in'}
                    </span>
                    <CalendarIcon size={16} className="text-hc-text/50 shrink-0 ml-2" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    defaultMonth={checkIn ?? today}
                    captionLayout="dropdown-buttons"
                    fromYear={fromYear}
                    toYear={toYear}
                    onSelect={(d) => {
                      setCheckIn(d);
                      if (d && checkOut && differenceInCalendarDays(checkOut, d) <= 0) {
                        setCheckOut(undefined);
                      }
                    }}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className={cn('p-3 pointer-events-auto')}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className={dateBtnCls(checkOut)}>
                    <span className="truncate">
                      {checkOut ? format(checkOut, 'd MMM yyyy') : 'Check-out'}
                    </span>
                    <CalendarIcon size={16} className="text-hc-text/50 shrink-0 ml-2" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    defaultMonth={checkOut ?? checkIn ?? today}
                    captionLayout="dropdown-buttons"
                    fromYear={fromYear}
                    toYear={toYear}
                    onSelect={setCheckOut}
                    disabled={(d) =>
                      checkIn
                        ? d <= checkIn
                        : d < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                    className={cn('p-3 pointer-events-auto')}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {nights > 0 && (
              <p className="text-xs font-body text-hc-secondary -mt-1 px-1">
                {nights} {nights === 1 ? 'night' : 'nights'} selected
              </p>
            )}

            <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-body text-hc-text/50">Number of Guests</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests(g => Math.max(1, g - 1))}
                  className="w-8 h-8 rounded-full bg-surface-low flex items-center justify-center text-hc-primary font-bold"
                >
                  −
                </button>
                <span className="font-body font-bold text-hc-text w-6 text-center">{guests}</span>
                <button
                  onClick={() => setGuests(g => g + 1)}
                  className="w-8 h-8 rounded-full bg-surface-low flex items-center justify-center text-hc-primary font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-[#25D366] text-white rounded-full py-4 font-bold font-body mt-5 flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors"
          >
            <MessageCircle size={18} /> Book via WhatsApp
          </button>
        </div>
      )}
    </div>
  );
};
