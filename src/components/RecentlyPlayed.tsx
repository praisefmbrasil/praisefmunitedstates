import React, { useState, useEffect } from 'react'

interface Track {
  artist: string
  title: string
  artwork?: string
  playedAt?: Date
  isMusic?: boolean
}

interface RecentlyPlayedProps {
  tracks: Track[]
}

const RecentlyPlayed: React.FC<RecentlyPlayedProps> = ({ tracks }) => {
  const [artworks, setArtworks] = useState<Record<string, string>>({})

  const blockedKeywords = [
    'commercial',
    'promo',
    'sweeper',
    'station id',
    'ident',
    'program',
    'show',
    'radio',
    'live',
    'talk',
    'news',
    'interview',
    'announcement',
    'prayer',
    'devotional',
    'worship flow',
    'grace hour',
    'faith talks',
    'drive with',
    'voices of praise',
    'night encounter',
    'daily devotional',
  ]

  const isValidMusic = (track: Track) => {
    const text = `${track.artist} ${track.title}`.toLowerCase()

    if (blockedKeywords.some((word) => text.includes(word))) {
      return false
    }

    if (!track.artist || !track.title) return false

    if (track.artist.length < 2 || track.title.length < 2) return false

    if (track.artist === track.title) return false

    return true
  }

  const displayedTracks = Array.isArray(tracks)
    ? tracks.filter(isValidMusic).slice(0, 4)
    : []

  useEffect(() => {
    const fetchArtworks = async () => {
      const newArtworks = { ...artworks }
      let changed = false

      await Promise.all(
        displayedTracks.map(async (track) => {
          const key = `${track.artist}-${track.title}`

          if (newArtworks[key] || track.artwork) return

          try {
            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
              `${track.artist} ${track.title}`
            )}&media=music&limit=1`

            const res = await fetch(url)

            let image = ''

            if (res.ok) {
              const data = await res.json()

              if (data.results?.length) {
                image =
                  data.results[0].artworkUrl100?.replace(
                    '100x100bb',
                    '300x300bb'
                  ) || ''
              }
            }

            if (!image) {
              image = `https://picsum.photos/seed/${encodeURIComponent(
                key
              )}/300/300`
            }

            newArtworks[key] = image
            changed = true
          } catch {
            newArtworks[key] = `https://picsum.photos/seed/${encodeURIComponent(
              key
            )}/300/300`
            changed = true
          }
        })
      )

      if (changed) {
        setArtworks(newArtworks)
      }
    }

    if (displayedTracks.length > 0) {
      fetchArtworks()
    }
  }, [displayedTracks])

  return (
    <section className="bg-white dark:bg-[#121212] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Recent Tracks
          </h2>

          <span className="text-sm text-gray-400">
            Last {displayedTracks.length} songs
          </span>
        </div>

        {displayedTracks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Waiting for music...
          </p>
        ) : (
          <div className="flex flex-col rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#121212]">
            {displayedTracks.map((track, idx) => {
              const key = `${track.artist}-${track.title}`

              const artwork =
                artworks[key] ||
                track.artwork ||
                `https://picsum.photos/seed/${encodeURIComponent(
                  key
                )}/300/300`

              return (
                <div
                  key={key}
                  className="flex items-center justify-between py-4 px-4 border-b border-gray-100 dark:border-white/5 transition"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-sm text-gray-400 w-5 font-medium">
                      {idx + 1}
                    </span>

                    <img
                      src={artwork}
                      alt={track.title}
                      loading="lazy"
                      className="w-14 h-14 object-cover rounded-xl shadow-sm"
                    />

                    <div className="flex flex-col min-w-0">
                      <span className="text-sm md:text-base font-semibold text-black dark:text-white truncate">
                        {track.title}
                      </span>

                      <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                        {track.artist}
                      </span>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-orange-500">
                      Played
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default RecentlyPlayed