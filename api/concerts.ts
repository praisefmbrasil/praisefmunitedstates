type VercelRequest = {
  method?: string
  query: Record<string, string | string[] | undefined>
}

type VercelResponse = {
  setHeader: (name: string, value: string) => void
  status: (code: number) => {
    json: (body: unknown) => unknown
  }
}

type Concert = {
  id: string
  name: string
  date: string
  venue: string
  city: string
  region: string
  country: string
}

const cleanArtist = (value: string) => value.trim().replace(/\s+/g, ' ').slice(0, 100)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=1800')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const artist = cleanArtist(typeof req.query.artist === 'string' ? req.query.artist : '')
  if (!artist || artist.length < 2) return res.status(400).json({ error: 'Artist required' })

  const key = process.env.TICKETMASTER_API_KEY
  if (!key) return res.status(503).json({ error: 'Concert service not configured' })

  try {
    const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json')
    url.searchParams.set('apikey', key)
    url.searchParams.set('keyword', artist)
    url.searchParams.set('size', '50')
    url.searchParams.set('sort', 'date,asc')
    url.searchParams.set('startDateTime', new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'))

    const upstream = await fetch(url.toString(), { signal: AbortSignal.timeout(8000) })
    if (!upstream.ok) return res.status(502).json({ error: 'Event provider unavailable' })
    const payload = await upstream.json()
    const events: any[] = Array.isArray(payload?._embedded?.events) ? payload._embedded.events : []
    const normalizedArtist = artist.toLocaleLowerCase('en-US')
    const concerts: Concert[] = events
      .filter((event) => {
        const attractions = event?._embedded?.attractions
        return Array.isArray(attractions) && attractions.some((a: any) =>
          typeof a?.name === 'string' && a.name.trim().toLocaleLowerCase('en-US') === normalizedArtist
        )
      })
      .map((event) => {
        const venue = event?._embedded?.venues?.[0] || {}
        return {
          id: String(event.id || ''),
          name: String(event.name || ''),
          date: String(event.dates?.start?.localDate || ''),
          venue: String(venue.name || ''),
          city: String(venue.city?.name || ''),
          region: String(venue.state?.stateCode || venue.state?.name || ''),
          country: String(venue.country?.countryCode || '')
        }
      })
      .filter((event) => event.id && event.date && event.venue && event.city)
      .slice(0, 3)

    return res.status(200).json({ artist, concerts })
  } catch {
    return res.status(502).json({ error: 'Could not load concerts' })
  }
}
