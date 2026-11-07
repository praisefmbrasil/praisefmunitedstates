import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, Zap, Flame, Heart,
  Loader2, RefreshCw, ExternalLink
} from 'lucide-react';

interface Release {
  id: string;
  artist: string;
  title: string;
  image: string;
  previewUrl: string;
  itunesUrl: string;
  releaseDate?: string;
  isHot?: boolean;
}

const ITUNES_RSS =
  'https://itunes.apple.com/us/rss/topalbums/limit=24/genre=22/json';

async function enrichWithPreview(item: Release): Promise<Release> {
  try {
    const q = encodeURIComponent(`${item.artist} ${item.title}`);
    const res = await fetch(
      `https://itunes.apple.com/search?term=${q}&media=music&entity=song&limit=5`
    );
    if (!res.ok) return item;

    const data = await res.json();
    const result = data.results?.find((r: any) => r.previewUrl) ?? data.results?.[0];
    if (!result) return item;

    return {
      ...item,
      image: result.artworkUrl100?.replace('100x100', '600x600') ?? item.image,
      previewUrl: result.previewUrl ?? '',
    };
  } catch {
    return item;
  }
}

function parseRSS(feed: any): Release[] {
  const entries: any[] = feed?.feed?.entry ?? [];
  return entries.map((e, i) => ({
    id: e.id?.attributes?.['im:id'] ?? String(i),
    artist: e['im:artist']?.label ?? 'Unknown Artist',
    title: e['im:name']?.label ?? 'Unknown Title',
    image: e['im:image']?.[2]?.label?.replace('170x170', '600x600') ?? '',
    previewUrl: '',
    itunesUrl: e?.link?.attributes?.href ?? '#',
    releaseDate: e['im:releaseDate']?.label,
    isHot: i < 3,
  }));
}

function isNew(dateStr?: string) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return (Date.now() - d.getTime()) / 86400000 <= 30;
}

interface CardProps {
  release: Release;
  activePreview: string | null;
  onTogglePlay: (id: string, url: string) => void;
  onFavorite: (e: React.MouseEvent, r: Release) => void;
  isFav: boolean;
}

const ReleaseCard: React.FC<CardProps> = ({
  release,
  activePreview,
  onTogglePlay,
  onFavorite,
  isFav
}) => {
  const isPlaying = activePreview === release.id;

  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 hover:border-[#ff6600]/60 rounded-2xl overflow-hidden group relative transition-colors">
      <div className="aspect-square relative overflow-hidden">
        {release.image ? (
          <img
            src={release.image}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            alt={release.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://picsum.photos/seed/${encodeURIComponent(release.artist)}/600/600`;
            }}
          />
        ) : (
          <div className="w-full h-full bg-black/40 flex items-center justify-center">
            <span className="text-white/20 text-6xl font-black uppercase tracking-tighter">
              {release.artist.charAt(0)}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />

        {isNew(release.releaseDate) && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
            <Zap className="w-3 h-3 fill-current" />
            <span className="text-[9px] font-black uppercase tracking-widest">New</span>
          </div>
        )}

        {release.isHot && !isNew(release.releaseDate) && (
          <div className="absolute top-4 left-4 bg-[#ff6600] text-white px-3 py-1 rounded-full flex items-center space-x-1">
            <Flame className="w-3 h-3 fill-current" />
            <span className="text-[9px] font-black uppercase tracking-widest">Hot</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-black/80 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => onTogglePlay(release.id, release.previewUrl)}
              disabled={!release.previewUrl}
              className="bg-[#ff6600] text-white p-4 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPlaying
                ? <Pause className="w-5 h-5 fill-current" />
                : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <div className="flex space-x-2">
              <button
                onClick={(e) => onFavorite(e, release)}
                className={`p-3 rounded-full border ${
                  isFav
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'border-white/20 text-white hover:bg-white hover:text-black'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
              </button>

              <a
                href={release.itunesUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <p className="text-[#ff6600] text-[10px] font-black uppercase tracking-[0.2em] mb-1 truncate">
            {release.artist}
          </p>

          <h4 className="text-white text-lg font-bold uppercase tracking-tight truncate">
            {release.title}
          </h4>
        </div>
      </div>

      <div className="p-6 group-hover:bg-[#ff6600] transition-colors duration-500">
        <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-1 group-hover:text-black/60 truncate">
          {release.artist}
        </p>
        <h4 className="text-white text-xl font-bold uppercase tracking-tighter truncate group-hover:text-black">
          {release.title}
        </h4>
      </div>
    </div>
  );
};

const NewReleasesPage: React.FC = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const load = async () => {
    setLoading(true);
    setError(false);

    try {
      const res = await fetch(ITUNES_RSS);
      if (!res.ok) throw new Error();

      const data = await res.json();
      const parsed = parseRSS(data);

      const enriched = await Promise.all(
        parsed.map((r, i) => (i < 12 ? enrichWithPreview(r) : Promise.resolve(r)))
      );

      setReleases(enriched);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Para a prévia ao sair da página
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const togglePlay = (id: string, url: string) => {
    if (!url || !audioRef.current) return;

    if (activePreview === id) {
      audioRef.current.pause();
      setActivePreview(null);
    } else {
      audioRef.current.src = url;
      audioRef.current.play().catch(() => setActivePreview(null));
      setActivePreview(id);
    }
  };

  const handleFavorite = (e: React.MouseEvent, _release: Release) => {
    e.stopPropagation();

    // Favoritos ainda não implementados.
  };

  const main = releases[0];
  const rest = releases.slice(1);

  return (
    // Sem fundo próprio: o fundo ambiente do App aparece por trás
    <div className="min-h-screen text-white">
      <audio ref={audioRef} onEnded={() => setActivePreview(null)} />

      <div className="relative overflow-hidden min-h-[60vh] flex items-center py-16 border-b border-white/10">
        <div className="absolute inset-0 opacity-30">
          {main && (
            <img
              src={main.image}
              className="w-full h-full object-cover grayscale"
              alt=""
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1514525253361-bee8718a300a?auto=format&fit=crop&q=80&w=1200';
              }}
            />
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="inline-flex items-center space-x-2 bg-[#ff6600] text-white rounded-full px-4 py-1.5 mb-8">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              #1 Gospel Right Now
            </span>
          </div>

          <h1 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter leading-[0.85] mb-8">
            The New<br />Wave
          </h1>

          {main && (
            <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-10">
              <div>
                <p className="text-[#ff6600] text-lg font-bold uppercase tracking-widest mb-2">
                  {main.artist}
                </p>
                <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">
                  {main.title}
                </h2>
              </div>

              {main.previewUrl && (
                <button
                  onClick={() => togglePlay(main.id, main.previewUrl)}
                  className="bg-white text-black h-20 w-20 rounded-full flex items-center justify-center hover:bg-[#ff6600] hover:text-white transition-all transform hover:scale-105 flex-shrink-0"
                >
                  {activePreview === main.id
                    ? <Pause className="w-8 h-8 fill-current" />
                    : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 md:mb-14 border-b border-white/10 pb-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6 md:mb-0 text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
              Top Gospel Right Now
            </h3>
            <span className="text-white/50 text-sm uppercase tracking-widest md:pt-1">
              iTunes Charts · US
            </span>
          </div>

          <button
            onClick={load}
            disabled={loading}
            className="flex items-center space-x-2 bg-white/5 text-white/70 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-[#ff6600] hover:text-[#ff6600] transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-[#ff6600] animate-spin mb-4" />
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">
              Loading from iTunes...
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-32">
            <p className="text-white/60 mb-4 text-sm uppercase tracking-widest">
              Could not load releases.
            </p>
            <button
              onClick={load}
              className="bg-[#ff6600] hover:bg-orange-600 text-white rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((release) => (
              <ReleaseCard
                key={release.id}
                release={release}
                activePreview={activePreview}
                onTogglePlay={togglePlay}
                onFavorite={handleFavorite}
                isFav={false}
              />
            ))}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-16 md:mt-24 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-start gap-10 md:gap-16">
            <div className="w-full md:w-1/3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff6600] mb-6">
                About This Chart
              </h4>
              <p className="text-white/60 text-sm leading-relaxed uppercase tracking-tight mb-4">
                Real-time Gospel & Christian music chart pulled directly from iTunes US. Updated daily. No editorial bias — just what listeners are playing right now.
              </p>
              <div className="flex items-center space-x-2 text-[9px] font-medium uppercase tracking-widest text-white/50">
                <RefreshCw className="w-3 h-3" />
                <span>Powered by iTunes RSS · Updated daily</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-grow">
              {[
                { v: releases.length, l: 'Albums Tracked' },
                { v: '100%', l: 'Faith Focused' },
                { v: 'Daily', l: 'Update Cycle' },
                { v: '24/7', l: 'Global Discovery' },
              ].map(({ v, l }) => (
                <div key={l} className="space-y-2">
                  <p className="text-3xl font-black uppercase tracking-tighter text-white">{v}</p>
                  <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">{l}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewReleasesPage;