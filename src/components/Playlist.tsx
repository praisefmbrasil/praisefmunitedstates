import React, { useState, useRef, useEffect, useMemo } from 'react'
import {
  Play,
  Music,
  Heart,
  Info,
  ExternalLink,
  Pause,
  Loader2,
  X,
  Calendar,
} from 'lucide-react'

const MASTER_ARTISTS = [
  'Brandon Lake',
  'Elevation Worship',
  'Chris Tomlin',
  'Tauren Wells',
  'Lauren Daigle',
  'Forrest Frank',
  'Phil Wickham',
  'Anne Wilson',
  'Matthew West',
  'Cory Asbury',
  'Casting Crowns',
  'MercyMe',
  'Maverick City Music',
  'CeCe Winans',
  'Tasha Cobbs Leonard',
  'TobyMac',
  'Jeremy Camp',
  'Hillsong Worship',
  'Kari Jobe',
  'Crowder',
]

const ARCHIVE_DATA = [
  { date: 'Oct 24', artists: ['Brandon Lake', 'Phil Wickham', 'CeCe Winans'] },
  { date: 'Oct 23', artists: ['Elevation Worship', 'Tauren Wells', 'Lauren Daigle'] },
  { date: 'Oct 22', artists: ['Chris Tomlin', 'Forrest Frank', 'Tasha Cobbs'] },
  { date: 'Oct 21', artists: ['Maverick City', 'TobyMac', 'Anne Wilson'] },
]

type Track = {
  trackId: number
  trackName: string
  artistName: string
  artworkUrl100: string
  previewUrl?: string
}

const getRotationSeed = () => {
  const oneDayInMs = 24 * 60 * 60 * 1000
  return Math.floor(Date.now() / oneDayInMs)
}

const shuffleWithSeed = (array: any[], seed: number) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (seed * (i + 1)) % shuffled.length
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const PlaylistCard: React.FC<{
  track: Track
  isPlaying: boolean
  onTogglePlay: () => void
}> = ({ track, isPlaying, onTogglePlay }) => {
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Favoritos ainda não implementados.
  }

  return (
    <div className="group relative bg-white/5 backdrop-blur border border-white/10 hover:border-[#ff6600]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/30">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={track.artworkUrl100.replace('100x100', '600x600')}
          alt={track.trackName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(
              track.artistName
            )}/600/600`
          }}
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onTogglePlay()
            }}
            className="w-14 h-14 bg-[#ff6600] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all shadow-2xl"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>
        </div>

        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all bg-black/20 text-white hover:bg-[#ff6600] opacity-0 group-hover:opacity-100"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-white leading-tight truncate uppercase tracking-tighter">
          {track.trackName}
        </h3>
        <p className="text-white/60 text-[10px] font-normal uppercase tracking-[0.2em] mt-1 truncate">
          {track.artistName}
        </p>
      </div>
    </div>
  )
}

const Playlist: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [activePreview, setActivePreview] = useState<number | null>(null)
  const [showArchive, setShowArchive] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentArtists = useMemo(() => {
    const seed = getRotationSeed()
    return shuffleWithSeed(MASTER_ARTISTS, seed).slice(0, 12)
  }, [])

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true)
      try {
        const results: Track[] = []

        for (const artist of currentArtists) {
          const res = await fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(
              artist
            )}&media=music&entity=song&limit=1`
          )

          if (res.ok) {
            const text = await res.text()
            if (text && text.trim().length > 0) {
              try {
                const json = JSON.parse(text)
                if (json.results && json.results.length > 0) {
                  results.push(json.results[0])
                }
              } catch {
                console.debug('Playlist iTunes parse error for:', artist)
              }
            }
          }
        }

        setTracks(results)
      } catch {
        console.debug('Erro ao carregar playlist Praise FM - Rede instável')
      } finally {
        setLoading(false)
      }
    }

    fetchTracks()
  }, [currentArtists])

  // Para a prévia ao sair da página
  useEffect(() => {
    return () => {
      audioRef.current?.pause()
    }
  }, [])

  const togglePreview = (track: Track) => {
    if (!track.previewUrl || !audioRef.current) return

    if (activePreview === track.trackId) {
      audioRef.current.pause()
      setActivePreview(null)
    } else {
      audioRef.current.src = track.previewUrl
      audioRef.current.play().catch(() => setActivePreview(null))
      setActivePreview(track.trackId)
    }
  }

  const aList = tracks.slice(0, 4)
  const bList = tracks.slice(4, 8)
  const cList = tracks.slice(8, 12)

  return (
    // Sem fundo próprio: o fundo ambiente do App aparece por trás
    <div className="min-h-screen text-white">
      <audio ref={audioRef} onEnded={() => setActivePreview(null)} />

      {showArchive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-black/70 backdrop-blur-xl border border-white/10 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl rounded-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#ff6600] text-white">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5" />
                <h2 className="text-xl font-black uppercase tracking-tighter">Archive Selection</h2>
              </div>
              <button
                onClick={() => setShowArchive(false)}
                className="p-2 hover:bg-black/20 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {ARCHIVE_DATA.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 border border-white/10 bg-white/5 rounded-xl hover:border-[#ff6600]/60 transition-colors group cursor-default"
                >
                  <span className="text-[10px] font-black text-[#ff6600] uppercase tracking-[0.2em] mb-2 block">
                    {item.date}
                  </span>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight mb-3">
                    The A-List Artists
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.artists.map((artist, aIdx) => (
                      <span
                        key={aIdx}
                        className="bg-black/40 px-3 py-1 text-xs rounded-full border border-white/10 text-white/80"
                      >
                        {artist}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-white/10 text-center">
              <p className="text-xs text-white/50 uppercase tracking-widest">
                Showing last 4 daily editions
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-white/10 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-[#ff6600] mb-4">
            <Music className="w-4 h-4" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em]">
              Official Praise FM USA Selection
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 text-white leading-none">
            Playlist
          </h1>
          <p className="text-xl text-white/70 max-w-2xl font-normal leading-tight uppercase">
            Curated daily. The definitive sound of{' '}
            <span className="text-white font-bold">Praise FM USA</span>,
            featuring the world's most impactful worship hits.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-[#ff6600] animate-spin mb-4" />
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">
              Refreshing Daily Playlist...
            </p>
          </div>
        ) : (
          <>
            {aList.length > 0 && (
              <section className="mb-16 md:mb-24">
                <div className="flex items-baseline space-x-4 mb-8 border-b-2 border-[#ff6600] pb-4">
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
                    A List
                  </h2>
                  <span className="text-[#ff6600] text-sm font-medium uppercase tracking-widest">
                    Power Rotation
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {aList.map((track) => (
                    <PlaylistCard
                      key={track.trackId}
                      track={track}
                      isPlaying={activePreview === track.trackId}
                      onTogglePlay={() => togglePreview(track)}
                    />
                  ))}
                </div>
              </section>
            )}

            {bList.length > 0 && (
              <section className="mb-16 md:mb-24">
                <div className="flex items-baseline space-x-4 mb-8 border-b-2 border-white/30 pb-4">
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white/80">
                    B List
                  </h2>
                  <span className="text-white/50 text-sm font-medium uppercase tracking-widest">
                    On The Rise
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {bList.map((track) => (
                    <PlaylistCard
                      key={track.trackId}
                      track={track}
                      isPlaying={activePreview === track.trackId}
                      onTogglePlay={() => togglePreview(track)}
                    />
                  ))}
                </div>
              </section>
            )}

            {cList.length > 0 && (
              <section className="mb-16 md:mb-24">
                <div className="flex items-baseline space-x-4 mb-8 border-b-2 border-white/15 pb-4">
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white/60">
                    C List
                  </h2>
                  <span className="text-white/40 text-sm font-medium uppercase tracking-widest">
                    New & Next
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {cList.map((track) => (
                    <PlaylistCard
                      key={track.trackId}
                      track={track}
                      isPlaying={activePreview === track.trackId}
                      onTogglePlay={() => togglePreview(track)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 mt-12 md:mt-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex flex-col md:flex-row items-center md:space-x-8 text-center md:text-left gap-6 md:gap-0">
              <div className="w-16 h-16 bg-[#ff6600] rounded-full flex items-center justify-center text-white flex-shrink-0">
                <Info className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-2xl font-black uppercase tracking-tighter text-white">
                  Daily Rotation
                </h4>
                <p className="text-white/60 text-sm max-w-lg mt-2 uppercase font-normal tracking-tight leading-relaxed">
                  The <span className="text-[#ff6600] font-bold">Praise FM USA Playlist</span>{' '}
                  is updated every 24 hours. We select the most impactful songs from around the
                  world to inspire your faith journey daily.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowArchive(true)}
              className="bg-[#ff6600] hover:bg-orange-600 text-white rounded-xl px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center space-x-3 transition-all shadow-lg shadow-orange-500/20 active:scale-95 whitespace-nowrap"
            >
              <span>View Past Daily Lists</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Playlist