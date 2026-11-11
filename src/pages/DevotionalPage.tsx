
import React, { useEffect, useState } from 'react'
import { Play, Radio, Youtube, BookOpen, ArrowUpRight } from 'lucide-react'
import DailyVerse from '../components/DailyVerse'

type Sermon = {
  id: string
  slug: string
  title: string
  description?: string
  thumbnail: string
  videoId: string
  channel: string
  channelName: string
  publishedAt?: string
  featured?: boolean
}

const CHANNELS = [
  { id: 'all', name: 'All Churches' },
  { id: 'elevation', name: 'Elevation Church' },
  { id: 'lifechurch', name: 'Life.Church' },
  { id: 'transformation', name: 'Transformation Church' },
  { id: 'highlands', name: 'Church of the Highlands' },
]

const DevotionalPage: React.FC = () => {
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [activeChannel, setActiveChannel] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadSermons = async () => {
      try {
        setLoading(true)
        setError(false)

        const response = await fetch('/api/sermons')

        if (!response.ok) {
          throw new Error('Unable to load sermons')
        }

        const data = await response.json()

        if (!cancelled) {
          setSermons(Array.isArray(data.sermons) ? data.sermons : [])
        }
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadSermons()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredSermons =
    activeChannel === 'all'
      ? sermons
      : sermons.filter((sermon) => sermon.channel === activeChannel)

  const featured =
    sermons.find((sermon) => sermon.featured) || sermons[0]

  const recentSermons = filteredSermons.filter(
    (sermon) => sermon.id !== featured?.id,
  )

  return (
    <div className="min-h-screen pb-20 text-white">

      {/* WATCH NOW HEADER */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1800&q=85"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#101010]/40 via-[#101010]/70 to-[#101010]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="flex items-center gap-2 text-[#ff6600] font-black text-sm tracking-[0.25em] mb-6">
            <Radio size={18} />
            PRAISE FM PRESENTS
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            WATCH <span className="text-[#ff6600]">NOW</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl">
            Powerful messages. Inspiring voices. Faith that moves you.
            Watch sermons from churches and pastors making an impact.
          </p>

          <div className="mt-8 flex items-center gap-3 text-sm text-white/50">
            <Youtube size={19} className="text-[#ff6600]" />
            <span>Watch directly on Praise FM USA</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* FEATURED SERMON */}
        {featured && (
          <section className="pt-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-7 bg-[#ff6600] rounded-full" />
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Featured Message
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center bg-white/[0.04] border border-white/10 rounded-3xl overflow-hidden">
              <a
                href={`/devotional/${featured.slug}`}
                className="relative block aspect-video group"
              >
                <img
                  src={featured.thumbnail}
                  alt={featured.title}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-20 h-20 rounded-full bg-[#ff6600] flex items-center justify-center shadow-2xl group-hover:scale-110 transition">
                    <Play size={32} fill="white" />
                  </span>
                </div>
              </a>

              <div className="p-6 md:p-10">
                <p className="text-[#ff6600] text-xs font-black uppercase tracking-[0.2em] mb-4">
                  {featured.channelName}
                </p>

                <h3 className="text-3xl md:text-4xl font-black leading-tight">
                  {featured.title}
                </h3>

                {featured.description && (
                  <p className="mt-4 text-white/60 leading-relaxed line-clamp-3">
                    {featured.description}
                  </p>
                )}

                <a
                  href={`/devotional/${featured.slug}`}
                  className="mt-8 inline-flex items-center gap-3 bg-[#ff6600] hover:bg-orange-600 text-white font-black uppercase tracking-wide px-7 py-4 rounded-xl transition"
                >
                  <Play size={18} fill="white" />
                  Watch Now
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* CHURCH FILTERS */}
        <section className="pt-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-7">
            <div>
              <p className="text-[#ff6600] text-xs font-black uppercase tracking-[0.2em] mb-2">
                Explore messages
              </p>
              <h2 className="text-3xl font-black uppercase tracking-tight">
                Watch & Be Inspired
              </h2>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4">
            {CHANNELS.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`shrink-0 px-5 py-3 rounded-full text-sm font-bold transition ${
                  activeChannel === channel.id
                    ? 'bg-[#ff6600] text-white'
                    : 'bg-white/[0.06] border border-white/10 text-white/65 hover:text-white hover:border-[#ff6600]/50'
                }`}
              >
                {channel.name}
              </button>
            ))}
          </div>
        </section>

        {/* SERMON GRID */}
        <section className="pt-5">
          {loading ? (
            <div className="py-20 text-center text-white/50">
              Loading the latest messages...
            </div>
          ) : error ? (
            <div className="py-16 text-center bg-white/[0.04] rounded-2xl border border-white/10">
              <Youtube className="mx-auto text-[#ff6600] mb-4" size={36} />
              <p className="font-bold text-lg">Messages are temporarily unavailable.</p>
              <p className="text-sm text-white/50 mt-2">
                Please check back soon.
              </p>
            </div>
          ) : recentSermons.length === 0 ? (
            <div className="py-16 text-center text-white/50">
              No messages available in this section yet.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentSermons.map((sermon) => (
                <a
                  key={sermon.id}
                  href={`/devotional/${sermon.slug}`}
                  className="group bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden hover:border-[#ff6600]/60 transition"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={sermon.thumbnail}
                      alt={sermon.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition" />
                    <div className="absolute bottom-3 right-3 bg-[#ff6600] p-3 rounded-full">
                      <Play size={17} fill="white" />
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-[#ff6600] text-[11px] font-black uppercase tracking-wider mb-2">
                      {sermon.channelName}
                    </p>
                    <h3 className="font-bold text-lg leading-snug group-hover:text-orange-400 transition line-clamp-2">
                      {sermon.title}
                    </h3>
                    <p className="text-xs text-white/40 mt-3">
                      {sermon.publishedAt || ''}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* DAILY VERSE */}
        <section className="mt-20 pt-12 border-t border-white/10">
          <div className="flex items-center gap-3 mb-7">
            <BookOpen className="text-[#ff6600]" size={25} />
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Daily Verse
            </h2>
          </div>
          <DailyVerse />
        </section>
      </div>
    </div>
  )
}

export default DevotionalPage
