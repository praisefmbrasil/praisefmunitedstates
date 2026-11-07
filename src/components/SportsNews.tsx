
import { useCallback, useEffect, useState } from 'react'

type Story = {
  title: string
  link: string
  description: string
  image: string
  publishedAt: string
  league: string
}

type SportsNewsProps = {
  league?: 'NBA' | 'NFL' | 'MLB'
}

export default function SportsNews({ league }: SportsNewsProps) {
  const [news, setNews] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadNews = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setError(false)

    try {
      const response = await fetch('/api/sports-news', {
        cache: 'no-store',
        signal,
      })

      if (!response.ok) {
        throw new Error(`News request failed: ${response.status}`)
      }

      const data = await response.json()
      const stories: Story[] = Array.isArray(data.news) ? data.news : []

      const filtered = league
        ? stories.filter(
            (story) => story.league?.toUpperCase() === league
          )
        : stories

      setNews(filtered)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(true)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [league])

  useEffect(() => {
    const controller = new AbortController()

    void loadNews(controller.signal)

    return () => controller.abort()
  }, [loadNews])

  const formatDate = (date: string) => {
    if (!date || Number.isNaN(Date.parse(date))) return ''

    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 text-white md:px-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
          Latest updates
        </p>

        <h2 className="mt-1 text-3xl font-black">
          {league ? `${league} News` : 'Sports News'}
        </h2>

        <p className="mt-2 text-gray-400">
          The latest headlines from the world of sports.
        </p>
      </div>

      {loading && (
        <p className="py-8 text-gray-400">
          Loading latest sports news...
        </p>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-gray-300">
            News could not be loaded.
          </p>

          <button
            type="button"
            onClick={() => void loadNews()}
            className="mt-3 font-bold text-orange-400 hover:text-orange-300"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && news.length === 0 && (
        <p className="py-8 text-gray-400">
          No {league ? `${league} ` : ''}news is available right now.
        </p>
      )}

      {!loading && !error && news.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((story) => (
            <article
              key={`${story.league}-${story.link}`}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-colors hover:border-orange-500/50"
            >
              {story.image && (
                <a
                  href={story.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Read ${story.title}`}
                >
                  <img
                    src={story.image}
                    alt=""
                    loading="lazy"
                    className="h-48 w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                  />
                </a>
              )}

              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-black uppercase text-orange-400">
                    {story.league}
                  </span>

                  <span className="text-xs text-gray-500">
                    {formatDate(story.publishedAt)}
                  </span>
                </div>

                <h3 className="text-lg font-bold leading-snug">
                  {story.title}
                </h3>

                {story.description && (
                  <p className="mt-3 line-clamp-3 text-sm text-gray-400">
                    {story.description}
                  </p>
                )}

                <a
                  href={story.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block text-sm font-bold text-orange-400 hover:text-orange-300"
                >
                  Read full story →
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="mt-5 text-xs text-gray-500">
        News articles are provided by their original publishers.
        Select a headline to read the full story.
      </p>
    </section>
  )
}
