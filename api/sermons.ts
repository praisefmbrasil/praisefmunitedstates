
type VercelRequest = {
  method?: string
}

type VercelResponse = {
  setHeader: (name: string, value: string) => void
  status: (code: number) => VercelResponse
  json: (body: unknown) => VercelResponse
}

const CHANNELS = [
  {
    name: 'Elevation Church',
    handle: '@elevationchurch',
    pastor: 'Steven Furtick'
  },
  {
    name: 'Life.Church',
    handle: '@lifechurch',
    pastor: 'Life.Church Pastors'
  },
  {
    name: 'Transformation Church',
    handle: '@wearetransformation',
    pastor: 'Michael Todd'
  },
  {
    name: 'Church of the Highlands',
    handle: '@churchofthehighlands',
    pastor: 'Church of the Highlands Pastors'
  }
]

function decode(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}

function getTag(xml: string, tag: string) {
  const match = xml.match(
    new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i')
  )

  return match?.[1]
    ? decode(match[1].replace(/<[^>]*>/g, ''))
    : ''
}

async function getChannelId(handle: string) {
  const response = await fetch(
    `https://www.youtube.com/${handle}`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 PraiseFM/1.0'
      }
    }
  )

  if (!response.ok) {
    throw new Error(`Could not resolve ${handle}`)
  }

  const html = await response.text()

  const channelId =
    html.match(/"externalId":"(UC[\w-]{22})"/)?.[1] ??
    html.match(/<meta itemprop="channelId" content="(UC[\w-]{22})"/)?.[1]

  if (!channelId) {
    throw new Error(`Channel ID not found for ${handle}`)
  }

  return channelId
}

async function getChannelVideos(
  channel: typeof CHANNELS[number]
) {
  const channelId = await getChannelId(channel.handle)

  const response = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 PraiseFM/1.0'
      }
    }
  )

  if (!response.ok) {
    throw new Error(`RSS failed for ${channel.name}`)
  }

  const xml = await response.text()

  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/gi)]
    .map(([, entry]) => {
      const videoId = getTag(entry, 'yt:videoId')
      const title = getTag(entry, 'title')
      const publishedAt = getTag(entry, 'published')

      const link = `https://www.youtube.com/watch?v=${videoId}`

      return {
        id: videoId,
        videoId,
        slug: `${channel.handle.replace('@', '')}-${videoId}`,
        title,
        channel: channel.name,
        channelName: channel.name,
        pastor: channel.pastor,
        publishedAt,
        videoUrl: link,
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        featured: false
      }
    })
    .filter((video) => video.id && video.title)
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader(
    'Cache-Control',
    's-maxage=1800, stale-while-revalidate=3600'
  )

  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed'
    })
  }

  const results = await Promise.allSettled(
    CHANNELS.map((channel) => getChannelVideos(channel))
  )

  const sermons = results.flatMap((result) =>
    result.status === 'fulfilled'
      ? result.value
      : []
  )

  sermons.sort((a, b) =>
    Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  )

  return res.status(200).json({
    sermons: sermons.slice(0, 40),
    updatedAt: new Date().toISOString(),
    channelsWithErrors: results.filter(
      (result) => result.status === 'rejected'
    ).length
  })
}
