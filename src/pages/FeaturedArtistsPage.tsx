import React from 'react'
import { Star, Music, Users, Play, ArrowRight, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Artist {
  id: string
  name: string
  genre: string
  image: string
  hits: string[]
}

const FEATURED_ARTISTS: Artist[] = [
  {
    id: 'art_1',
    name: 'Brandon Lake',
    genre: 'Contemporary Worship',
    image:
      'https://res.cloudinary.com/dtecypmsh/image/upload/v1769823362/BRANDON_LAKE_pirbp8.webp',
    hits: ['Gratitude', 'Trust In God', 'Praise'],
  },
  {
    id: 'art_2',
    name: 'Tauren Wells',
    genre: 'Christian Pop / R&B',
    image:
      'https://res.cloudinary.com/dtecypmsh/image/upload/v1769823979/TAUREN_WELLS_elfhyd.webp',
    hits: ['Known', 'Joy In The Morning', 'Take It All Back'],
  },
  {
    id: 'art_3',
    name: 'Forrest Frank',
    genre: 'Indie Pop',
    image:
      'https://res.cloudinary.com/dtecypmsh/image/upload/v1769824459/FORREST_FRANK_jolxny.webp',
    hits: ['Good Day', 'No Longer Bound', 'UP!'],
  },
  {
    id: 'art_4',
    name: 'Ben Fuller',
    genre: 'Country / Soul',
    image:
      'https://res.cloudinary.com/dtecypmsh/image/upload/v1769824684/BEN_FULLER_pulwau.webp',
    hits: ['Who I Am', 'If I Got Jesus', 'But the Cross'],
  },
  {
    id: 'art_5',
    name: 'Lauren Daigle',
    genre: 'Christian Pop',
    image:
      'https://res.cloudinary.com/dtecypmsh/image/upload/v1769823362/LAUREN_DAIGLE_cjqazt.webp',
    hits: ['You Say', 'Rescue', 'Thank God I Do'],
  },
  {
    id: 'art_6',
    name: 'Elevation Worship',
    genre: 'Modern Worship',
    image:
      'https://res.cloudinary.com/dtecypmsh/image/upload/v1769823362/ELEVATION_WORSHIP_hyuqfg.webp',
    hits: ['LION', 'Trust In God', 'More Than Able'],
  },
]

const FeaturedArtistsPage: React.FC = () => {
  const navigate = useNavigate()

  const handleArtistClick = (artistName: string) => {
    navigate(`/music?search=${encodeURIComponent(artistName)}`)
  }

  const handleSongClick = (
    e: React.MouseEvent,
    artistName: string,
    songName: string
  ) => {
    e.stopPropagation()

    navigate(
      `/music?search=${encodeURIComponent(
        `${artistName} ${songName}`
      )}`
    )
  }

  const handleFollowArtist = (e: React.MouseEvent) => {
    e.stopPropagation()

    console.log('Favorites not implemented yet')
  }

  return (
    // Sem fundo próprio: o fundo ambiente do App aparece por trás
    <div className="min-h-screen text-white font-sans">
      <div className="py-14 md:py-20 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#ff6600]/10 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center space-x-3 text-[#ff6600] mb-6">
            <Star className="w-5 h-5 fill-current" />

            <span className="text-[10px] font-medium uppercase tracking-[0.4em]">
              The Pulse of Praise FM USA
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
            Featured
            <br />
            Artists
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl font-normal uppercase tracking-tight leading-tight">
            The sounds defining a generation of faith. Exclusive sessions and
            deep dives into the artists behind the world's biggest worship
            anthems.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl text-white uppercase font-bold tracking-tight border-l-4 border-[#ff6600] pl-4">
          Current Rotation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {FEATURED_ARTISTS.map((artist) => {
            const followed = false

            return (
              <div
                key={artist.id}
                onClick={() => handleArtistClick(artist.name)}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/40 cursor-pointer transition-all duration-500 hover:border-[#ff6600]/60"
              >
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-100 group-hover:scale-105"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      `https://picsum.photos/seed/${encodeURIComponent(
                        artist.name
                      )}/800/800`
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full transform transition-transform duration-500">
                  <span className="text-[#ff6600] text-[10px] font-medium uppercase tracking-[0.3em] mb-3 block">
                    {artist.genre}
                  </span>

                  <h3 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tighter leading-none group-hover:text-[#ff6600] transition-colors duration-300">
                    {artist.name}
                  </h3>

                  <div className="mt-6 h-0 group-hover:h-auto overflow-hidden transition-all duration-700 opacity-0 group-hover:opacity-100">
                    <p className="text-white/60 text-[9px] font-medium uppercase tracking-widest mb-4 flex items-center">
                      <Music className="w-3 h-3 mr-2 text-[#ff6600]" />
                      Top Tracks
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {artist.hits.slice(0, 3).map((hit) => (
                        <button
                          key={hit}
                          onClick={(e) =>
                            handleSongClick(e, artist.name, hit)
                          }
                          className="bg-white/10 text-white text-[9px] px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md border border-white/10 hover:bg-[#ff6600] hover:text-white transition-all active:scale-95"
                        >
                          {hit}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute top-8 right-8 flex flex-col space-y-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  <button
                    onClick={handleFollowArtist}
                    className={`p-4 rounded-full shadow-2xl transition-all ${
                      followed
                        ? 'bg-white text-[#ff6600]'
                        : 'bg-[#ff6600] text-white hover:bg-white hover:text-black'
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        followed ? 'fill-current' : ''
                      }`}
                    />
                  </button>

                  <div className="bg-black/50 text-white p-4 rounded-full shadow-2xl backdrop-blur-md">
                    <Play className="w-6 h-6 fill-current" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-16 md:mt-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row items-center md:space-x-10 text-center md:text-left mb-10 md:mb-0">
            <div className="w-20 h-20 bg-[#ff6600] rounded-full flex items-center justify-center text-white shadow-xl mb-6 md:mb-0">
              <Users className="w-10 h-10" />
            </div>

            <div className="max-w-md">
              <h4 className="text-3xl font-bold uppercase tracking-tighter text-white leading-none mb-4">
                Artist Submissions
              </h4>

              <p className="text-white/60 text-sm font-normal uppercase tracking-tight leading-relaxed">
                We champion the next generation. If you're creating music that
                inspires, we want to hear your story and your sound for
                potential airplay.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/feedback?type=music')}
            className="bg-[#ff6600] text-white px-10 py-5 rounded-xl text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95 whitespace-nowrap flex items-center space-x-3"
          >
            <span>Upload Your Track</span>

            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeaturedArtistsPage