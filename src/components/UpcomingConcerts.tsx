import React, { useEffect, useState } from 'react'

type Concert = {
  id: string
  name: string
  date: string
  venue: string
  city: string
  region: string
  country: string
}

type ConcertResponse = { artist: string; concerts: Concert[] }

export default function UpcomingConcerts({ artist }: { artist?: string }) {
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [resolvedArtist, setResolvedArtist] = useState('')

  useEffect(() => {
    const name = artist?.trim() || ''
    setConcerts([])
    setResolvedArtist('')
    if (!name) return

    const controller = new AbortController()
    const load = async () => {
      try {
        const response = await fetch(`/api/concerts?artist=${encodeURIComponent(name)}`, {
          signal: controller.signal
        })
        if (!response.ok) return
        const data: ConcertResponse = await response.json()
        if (!controller.signal.aborted) {
          setConcerts(Array.isArray(data.concerts) ? data.concerts.slice(0, 3) : [])
          setResolvedArtist(name)
        }
      } catch {
        // Hide the panel when the service is unavailable.
      }
    }

    void load()
    return () => controller.abort()
  }, [artist])

  if (!concerts.length || resolvedArtist !== artist?.trim()) return null

  return (
    <section className="mt-6" aria-label={`Upcoming concerts for ${resolvedArtist}`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white text-lg font-bold">Upcoming Concerts</h2>
        <span className="text-sm text-slate-300 truncate ml-3">{resolvedArtist}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {concerts.map((concert) => {
          const [year, month, day] = concert.date.split('-').map(Number)
          const date = new Date(Date.UTC(year, month - 1, day))
          const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(date)
          return (
            <article key={concert.id} className="flex items-center gap-3 p-4 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md min-w-0">
              <div className="flex-shrink-0 rounded-xl bg-white/10 px-3 py-2 text-center min-w-[56px]">
                <div className="text-[11px] uppercase text-orange-400 font-bold">{monthLabel}</div>
                <div className="text-2xl text-white font-bold leading-tight">{day}</div>
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold leading-snug line-clamp-2">{concert.venue}</p>
                <p className="text-slate-300 text-xs mt-1 truncate">
                  {[concert.city, concert.region || concert.country].filter(Boolean).join(', ')}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
