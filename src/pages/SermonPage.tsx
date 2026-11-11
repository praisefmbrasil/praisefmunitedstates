
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Play, Youtube, Calendar, Radio } from 'lucide-react'

type Sermon = {
  id: string
  videoId: string
  slug: string
  title: string
  channel: string
  channelName: string
  pastor: string
  publishedAt: string
  videoUrl: string
  embedUrl: string
  thumbnail: string
  featured?: boolean
}

const SermonPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  const [sermon, setSermon] = useState<Sermon | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadSermon() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch('/api/sermons')

        if (!response.ok) {
          throw new Error('Unable to load sermons.')
        }

        const data = await response.json()
        const found = (data.sermons || []).find(
          (item: Sermon) => item.slug === slug
        )

        if (active) {
          if (found) {
            setSermon(found)
          } else {
            setError('This sermon could not be found.')
          }
        }
      } catch {
        if (active) {
          setError('Unable to load this sermon. Please try again.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadSermon()

    return () => {
      active = false
    }
  }, [slug])

  const formattedDate = sermon?.publishedAt
    ? new Date(sermon.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : ''

  return (
    <main className="min-h-screen pb-20 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">

        <Link
          to="/devotional"
          className="inline-flex items-center gap-2 text-white/60 hover:text-[#ff6600] transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Back to Sermons
        </Link>

        {loading && (
          <div className="py-32 text-center">
            <div className="w-10 h-10 border-4 border-[#ff6600] border-t-transparent rounded-full animate-spin mx-auto mb-5" />
            <p className="text-white/60 uppercase tracking-widest text-sm">
              Loading sermon...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="py-24 text-center">
            <Radio className="mx-auto text-[#ff6600] mb-5" size={42} />
            <h1 className="text-3xl font-black uppercase mb-4">
              Sermon Not Found
            </h1>
            <p className="text-white/60 mb-8">{error}</p>
            <Link
              to="/devotional"
              className="inline-flex items-center gap-2 bg-[#ff6600] text-white font-bold px-7 py-3 rounded-lg hover:bg-orange-500 transition-colors"
            >
              <ArrowLeft size={18} />
              Explore Sermons
            </Link>
          </div>
        )}

        {!loading && sermon && (
          <>
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 text-[#ff6600] text-xs font-black uppercase tracking-[0.2em] mb-4">
                <Play size={14} fill="currentColor" />
                Praise FM Sermons
              </span>

              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight mb-5">
                {sermon.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <Radio size={16} className="text-[#ff6600]" />
                  {sermon.channelName || sermon.channel}
                </span>

                {sermon.pastor && (
                  <span>{sermon.pastor}</span>
                )}

                {formattedDate && (
                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    {formattedDate}
                  </span>
                )}
              </div>
            </div>

            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              <iframe
                src={sermon.embedUrl || `https://www.youtube-nocookie.com/embed/${sermon.videoId}`}
                title={sermon.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mt-8">
              <div>
                <p className="text-white font-bold text-lg">
                  Watch. Grow. Be Inspired.
                </p>
                <p className="text-white/50 text-sm mt-1">
                  Faith-filled messages selected by Praise FM USA.
                </p>
              </div>

              <a
                href={sermon.videoUrl || `https://www.youtube.com/watch?v=${sermon.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#ff6600] hover:bg-orange-500 text-white font-black uppercase tracking-wide px-7 py-4 rounded-lg transition-colors"
              >
                <Youtube size={20} />
                Watch on YouTube
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default SermonPage
