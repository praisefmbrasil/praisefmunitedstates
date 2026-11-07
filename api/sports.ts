// Praise FM USA — /api/sports (Vercel)
// ESPN's public endpoints are unofficial. Cache successful responses for 5 minutes.
type League = 'NFL' | 'NBA' | 'MLB'
type Score = { league: League; home: string; away: string; homeScore: string; awayScore: string; status: string; date: string; live: false }
type Competitor = { homeAway?: string; score?: string | number; team?: { abbreviation?: string; shortDisplayName?: string; displayName?: string } }
type Game = { date?: string; status?: { type?: { completed?: boolean; state?: string; shortDetail?: string } }; competitions?: { competitors?: Competitor[] }[] }
const LEAGUES: { id: League; path: string }[] = [
  { id: 'NFL', path: 'football/nfl' }, { id: 'NBA', path: 'basketball/nba' }, { id: 'MLB', path: 'baseball/mlb' }
]
const DAY = 86400000
const fmt = (date: Date) => date.toISOString().slice(0, 10).replace(/-/g, '')

function parseGame(game: Game, league: League): Score | null {
  if (!(game.status?.type?.completed === true || game.status?.type?.state === 'post')) return null
  const date = game.date
  if (!date || !Number.isFinite(Date.parse(date)) || Date.parse(date) > Date.now()) return null
  const competitors = game.competitions?.[0]?.competitors || []
  const home = competitors.find(c => c.homeAway === 'home')
  const away = competitors.find(c => c.homeAway === 'away')
  if (!home || !away || home.score == null || away.score == null) return null
  const name = (c: Competitor) => c.team?.abbreviation || c.team?.shortDisplayName || c.team?.displayName || 'TEAM'
  return { league, home: name(home), away: name(away), homeScore: String(home.score), awayScore: String(away.score), status: game.status?.type?.shortDetail || 'Final', date, live: false }
}

async function getEvents(path: string, date: string): Promise<Game[]> {
  const url = `https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard?dates=${date}&limit=200`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5500)
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal })
    if (!response.ok) throw new Error(`ESPN HTTP ${response.status}`)
    const json = await response.json() as { events?: Game[] }
    if (!Array.isArray(json.events)) throw new Error('ESPN response missing events array')
    return json.events
  } finally { clearTimeout(timeout) }
}

async function latest(league: { id: League; path: string }): Promise<{ score: Score | null; error: string | null }> {
  let success = 0
  let lastError = ''
  const now = Date.now()
  // Recent daily queries, 5 at a time; stop on first day with completed games.
  for (let start = 0; start < 15; start += 5) {
    const days = Array.from({ length: 5 }, (_, j) => fmt(new Date(now - (start + j) * DAY)))
    const results = await Promise.allSettled(days.map(day => getEvents(league.path, day)))
    const games: Score[] = []
    results.forEach(result => {
      if (result.status === 'fulfilled') { success++; games.push(...result.value.map(g => parseGame(g, league.id)).filter((s): s is Score => s !== null)) }
      else lastError = String(result.reason instanceof Error ? result.reason.message : result.reason)
    })
    games.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    if (games.length) return { score: games[0], error: null }
  }
  // Older monthly queries help with offseason gaps. These may not be supported by ESPN.
  for (let i = 0; i < 12; i++) {
    const d = new Date(Date.UTC(new Date(now).getUTCFullYear(), new Date(now).getUTCMonth() - i, 1))
    const month = fmt(d).slice(0, 6)
    try {
      const events = await getEvents(league.path, month)
      success++
      const games = events.map(g => parseGame(g, league.id)).filter((s): s is Score => s !== null)
      games.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
      if (games.length) return { score: games[0], error: null }
    } catch (e) { lastError = e instanceof Error ? e.message : String(e) }
  }
  return { score: null, error: success === 0 ? `ESPN unavailable: ${lastError || 'no successful requests'}` : null }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const results = await Promise.all(LEAGUES.map(async l => {
    try { return [l.id, await latest(l)] as const }
    catch (e) { return [l.id, { score: null, error: e instanceof Error ? e.message : String(e) }] as const }
  }))
  const scores: Record<string, Score | null> = {}
  const errors: Record<string, string> = {}
  for (const [id, result] of results) {
    scores[id] = result.score
    if (result.error) errors[id] = result.error
  }
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
  return res.status(200).json({ ...scores, errors, checkedAt: new Date().toISOString() })
}
