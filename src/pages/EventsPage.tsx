import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar, MapPin, ExternalLink, Music2,
  Ticket, Loader2, RefreshCw, Search, AlertCircle
} from 'lucide-react';

// ─── ⚙️  Config ───────────────────────────────────────────────────────────────
// A chave do Ticketmaster vem SOMENTE da variável de ambiente.
// 1. Local: coloque no .env  →  VITE_TICKETMASTER_KEY=sua_consumer_key
// 2. Produção: Vercel → Project Settings → Environment Variables
const TM_API_KEY = import.meta.env.VITE_TICKETMASTER_KEY;
// Artistas Gospel/CCM monitorados — adicione ou remova à vontade
const GOSPEL_KEYWORDS = [
  'Kirk Franklin',
  'Maverick City Music',
  'Elevation Worship',
  'Tasha Cobbs Leonard',
  'Chris Tomlin',
  'Hillsong',
  'Bethel Music',
  'Phil Wickham',
  'Lauren Daigle',
  'for KING & COUNTRY',
  'TobyMac',
  'CeCe Winans',
  'Travis Greene',
  'Todd Dulaney',
  'Lecrae',
];

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface TMVenue {
  name: string;
  city?: { name: string };
  state?: { stateCode: string; name: string };
  country?: { countryCode: string; name: string };
}

interface TMEvent {
  id: string;
  name: string;
  url: string;
  dates: {
    start: { localDate: string; localTime?: string };
    status?: { code: string };
  };
  images?: { url: string; width: number; height: number }[];
  priceRanges?: { min: number; max: number; currency: string }[];
  _embedded?: { venues?: TMVenue[] };
  _keyword: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getVenue(e: TMEvent): TMVenue | null {
  return e._embedded?.venues?.[0] ?? null;
}

function formatDate(localDate: string) {
  const d = new Date(localDate + 'T12:00:00');
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    day: d.getDate(),
    year: d.getFullYear(),
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
    full: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  };
}

function daysUntil(localDate: string) {
  return Math.ceil((new Date(localDate + 'T12:00:00').getTime() - Date.now()) / 86400000);
}

function getBestImage(e: TMEvent) {
  if (!e.images?.length) return null;
  const sorted = [...e.images].sort((a, b) => b.width - a.width);
  return (sorted.find(i => i.width / (i.height || 1) > 1.5) ?? sorted[0]).url;
}

function formatPrice(e: TMEvent) {
  const r = e.priceRanges?.[0];
  if (!r) return null;
  return r.min === r.max ? `$${Math.round(r.min)}` : `$${Math.round(r.min)}–$${Math.round(r.max)}`;
}

async function fetchForKeyword(keyword: string): Promise<TMEvent[]> {
  const params = new URLSearchParams({
    apikey: TM_API_KEY,
    keyword,
    classificationName: 'Music',
    size: '5',
    sort: 'date,asc',
  });
  const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${params}`);
  if (!res.ok) throw new Error(`TM ${res.status}`);
  const data = await res.json();
  return (data._embedded?.events ?? []).map((ev: TMEvent) => ({ ...ev, _keyword: keyword }));
}

// ─── Card ─────────────────────────────────────────────────────────────────────
const EventCard: React.FC<{ event: TMEvent }> = ({ event }) => {
  const venue = getVenue(event);
  const d = formatDate(event.dates.start.localDate);
  const days = daysUntil(event.dates.start.localDate);
  const image = getBestImage(event);
  const price = formatPrice(event);
  const cancelled = event.dates.status?.code === 'cancelled';
  const location = [
    venue?.city?.name,
    venue?.state?.stateCode,
    venue?.country?.countryCode !== 'US' ? venue?.country?.name : undefined,
  ].filter(Boolean).join(', ');

  return (
    <div className={`group flex flex-col bg-white/5 backdrop-blur border rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 ${
      cancelled ? 'border-red-500/40 opacity-60' : 'border-white/10 hover:border-orange-500/60'
    }`}>

      {/* Imagem ou header laranja */}
      {image ? (
        <div className="relative h-36 overflow-hidden bg-white/5">
          <img src={image} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {!cancelled && days >= 0 && days <= 30 && (
            <span className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days}d`}
            </span>
          )}
          {cancelled && <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">Cancelled</span>}
          <span className="absolute bottom-3 left-3 bg-black/50 text-white text-[9px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-full backdrop-blur-sm">{event._keyword}</span>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music2 className="w-4 h-4 text-orange-100" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-100">{event._keyword}</span>
          </div>
          {!cancelled && days >= 0 && days <= 30 && (
            <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days}d`}
            </span>
          )}
        </div>
      )}

      {/* Corpo */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 uppercase tracking-tight">
          {event.name}
        </h3>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center justify-center bg-orange-500/10 border border-orange-500/20 rounded-lg w-12 h-12 flex-shrink-0">
            <span className="text-[9px] font-bold uppercase tracking-wider text-orange-400">{d.month}</span>
            <span className="text-lg font-black text-orange-500 leading-none">{d.day}</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/90">{d.weekday}, {d.full}</p>
            {event.dates.start.localTime && (
              <p className="text-[11px] text-white/50 mt-0.5">
                {new Date(`2000-01-01T${event.dates.start.localTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>

        {venue && (
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-white/90">{venue.name}</p>
              {location && <p className="text-[11px] text-white/50">{location}</p>}
            </div>
          </div>
        )}

        {price && (
          <p className="text-xs text-white/60">From <span className="font-semibold text-white/90">{price}</span></p>
        )}

        <div className="mt-auto pt-3">
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-[11px] font-black uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all"
          >
            <Ticket className="w-3.5 h-3.5" />
            Get Tickets
          </a>
        </div>
      </div>
    </div>
  );
};

// ─── Página ───────────────────────────────────────────────────────────────────
const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<TMEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'this-month' | 'next-3-months'>('all');

  const load = useCallback(async () => {
    if (!TM_API_KEY) { setError('missing_key'); setLoading(false); return; }
    setLoading(true); setError(null);
    try {
      const results = await Promise.allSettled(GOSPEL_KEYWORDS.map(fetchForKeyword));
      const seen = new Set<string>();
      const flat: TMEvent[] = [];
      results.forEach(r => {
        if (r.status === 'fulfilled') r.value.forEach(e => { if (!seen.has(e.id)) { seen.add(e.id); flat.push(e); } });
      });

      const gospelOnly = flat.filter((event) => {
        const eventName = event.name.toLowerCase();
        return GOSPEL_KEYWORDS.some((artist) => eventName.includes(artist.toLowerCase()));
      });

      gospelOnly.sort(
        (a, b) =>
          new Date(a.dates.start.localDate).getTime() -
          new Date(b.dates.start.localDate).getTime()
      );

      setEvents(gospelOnly);
    } catch {
      setError('Error loading events. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = events.filter(e => {
    const days = daysUntil(e.dates.start.localDate);
    if (filter === 'this-month' && !(days >= 0 && days <= 30)) return false;
    if (filter === 'next-3-months' && !(days >= 0 && days <= 90)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const v = getVenue(e);
      return e.name.toLowerCase().includes(q) || e._keyword.toLowerCase().includes(q) || !!v?.city?.name?.toLowerCase().includes(q);
    }
    return true;
  });

  const countries = new Set(events.map(e => getVenue(e)?.country?.countryCode).filter(Boolean));

  const FILTERS = [
    { key: 'all' as const, label: 'All Upcoming' },
    { key: 'this-month' as const, label: 'This Month' },
    { key: 'next-3-months' as const, label: 'Next 3 Months' },
  ];

  return (
    // Sem fundo próprio: o fundo ambiente do App aparece por trás
    <div className="min-h-screen text-white">

      {/* Header */}
      <div className="py-14 md:py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calendar className="w-14 h-14 mx-auto mb-4 text-[#ff6600]" />
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-3">Gospel Events</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">Real upcoming concerts & worship nights — powered by Ticketmaster.</p>
          {!loading && events.length > 0 && (
            <div className="flex justify-center gap-8 mt-8">
              {[{ v: events.length, l: 'Events' }, { v: GOSPEL_KEYWORDS.length, l: 'Artists' }, { v: countries.size, l: 'Countries' }].map(({ v, l }) => (
                <React.Fragment key={l}>
                  <div><p className="text-3xl font-black">{v}</p><p className="text-[#ff6600] text-xs uppercase tracking-widest mt-0.5">{l}</p></div>
                  {l !== 'Countries' && <div className="w-px bg-white/20" />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filtros (ficam abaixo do menu, que tem 4rem de altura) */}
      <div className="sticky top-16 z-30 bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === f.key ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'}`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-[180px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50" />
            <input type="text" placeholder="Search artist or city..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 text-sm bg-white/10 border border-transparent focus:border-orange-500/60 rounded-full outline-none text-white placeholder-white/40" />
          </div>
          <button onClick={load} disabled={loading} className="flex items-center gap-1.5 text-xs text-white/60 hover:text-[#ff6600] transition-colors disabled:opacity-40 ml-auto">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {error === 'missing_key' && (
          <div className="max-w-lg mx-auto text-center py-20">
            <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">API key not configured</h2>
            <p className="text-sm text-white/60 mb-4">Add this to your <code className="bg-white/10 px-1.5 py-0.5 rounded text-orange-400">.env</code> (and to the Vercel environment variables):</p>
            <pre className="bg-black/50 border border-white/10 text-green-400 text-xs text-left rounded-xl p-4 mb-6 overflow-x-auto">VITE_TICKETMASTER_KEY=your_consumer_key</pre>
            <a href="https://developer.ticketmaster.com" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors">
              <ExternalLink className="w-4 h-4" /> Get API Key (free)
            </a>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-white/60">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
            <p className="text-sm">Loading events from Ticketmaster...</p>
          </div>
        )}

        {error && error !== 'missing_key' && (
          <div className="text-center py-20">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 mb-4 text-sm">{error}</p>
            <button onClick={load} className="bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">Try Again</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-white/50">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No events found.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="text-xs text-white/50 mb-6">{filtered.length} event{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(event => <EventCard key={event.id} event={event} />)}
            </div>
          </>
        )}
      </div>

      {/* Submit */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Have a Gospel event to share?</h3>
          <p className="text-sm text-white/60 mb-5">Submit your concert or ministry event to be featured here.</p>
          <a href="mailto:events@praisefm.com?subject=Event Submission"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors">
            <Calendar className="w-4 h-4" /> Submit Event
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;