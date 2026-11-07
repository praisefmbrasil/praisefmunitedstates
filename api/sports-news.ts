
type VercelRequest = {
  method?: string
  query?: Record<string, unknown>
  body?: unknown
}

type VercelResponse = {
  setHeader: (name: string, value: string) => void
  status: (code: number) => VercelResponse
  json: (body: unknown) => VercelResponse
}

const FEEDS = [
  { league: 'NFL', url: 'https://www.nytimes.com/athletic/rss/nfl/' },
  { league: 'NBA', url: 'https://www.nytimes.com/athletic/rss/nba/' },
  { league: 'MLB', url: 'https://www.nytimes.com/athletic/rss/mlb/' }
]

function clean(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}

function tag(item: string, name: string) {
  const expression = new RegExp(
    `<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`,
    'i'
  )
  return item.match(expression)?.[1] ?? ''
}

function parseFeed(xml: string, league: string) {
  return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)]
    .map(([_, item]) => {
      const title = clean(tag(item, 'title'))
      const link = clean(tag(item, 'link'))
      const description = clean(tag(item, 'description'))
      const pubDate = clean(tag(item, 'pubDate'))

      const media =
        item.match(/<media:content[^>]+url=["']([^"']+)["']/i)?.[1] ??
        item.match(/<enclosure[^>]+url=["']([^"']+)["']/i)?.[1] ??
        ''

      return {
        title,
        link,
        description,
        image: media,
        publishedAt: pubDate,
        league
      }
    })
    .filter((story) => story.title && /^https?:\/\//i.test(story.link))
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1800')

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const results = await Promise.allSettled(
      FEEDS.map(async (feed) => {
        const response = await fetch(feed.url, {
          headers: { 'User-Agent': 'PraiseFM-Sports/1.0' }
        })

        if (!response.ok) {
          throw new Error(`Feed ${feed.league} returned ${response.status}`)
        }

        const xml = await response.text()
        return parseFeed(xml, feed.league)
      })
    )

    const news = results.flatMap((result) =>
      result.status === 'fulfilled' ? result.value : []
    )

    news.sort((a, b) => {
      const dateA = Date.parse(a.publishedAt) || 0
      const dateB = Date.parse(b.publishedAt) || 0
      return dateB - dateA
    })

    return res.status(200).json({
      news: news.slice(0, 18),
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Sports news error:', error)
    return res.status(500).json({ error: 'Could not load sports news', news: [] })
  }
}
