import React, { useEffect, useState } from 'react'

type League = 'NFL' | 'NBA' | 'MLB'
type Score = { league: League; home: string; away: string; homeScore: string; awayScore: string; status: string; date: string; live: boolean }
type Response = Partial<Record<League, Score | null>> & { errors?: Partial<Record<League, string>>; checkedAt?: string }
const leagues: { id: League; emoji: string }[] = [
  { id: 'NFL', emoji: '🏈' }, { id: 'NBA', emoji: '🏀' }, { id: 'MLB', emoji: '⚾' }
]
export default function LatestSportsScores() {
  const [scores, setScores] = useState<Partial<Record<League, Score | null>>>({})
  const [errors, setErrors] = useState<Partial<Record<League, string>>>({})
  const [loading, setLoading] = useState(true)
  const [requestError, setRequestError] = useState<string | null>(null)
  useEffect(() => {
    let active = true
    const refresh = async () => {
      try {
        const response = await fetch('/api/sports', { cache: 'no-cache' })
        if (!response.ok) throw new Error(`Sports API HTTP ${response.status}`)
        const data = await response.json() as Response
        if (active) {
          setScores(previous => ({ ...previous, NFL: data.NFL ?? previous.NFL ?? null, NBA: data.NBA ?? previous.NBA ?? null, MLB: data.MLB ?? previous.MLB ?? null }))
          setErrors(data.errors || {})
          setRequestError(null)
        }
      } catch (error) {
        if (active) setRequestError(error instanceof Error ? error.message : 'Sports API unavailable')
      } finally { if (active) setLoading(false) }
    }
    void refresh()
    const timer = window.setInterval(() => void refresh(), 300000)
    return () => { active = false; window.clearInterval(timer) }
  }, [])
  return (
    <section aria-label="Latest US sports scores" className="w-full rounded-xl border border-white/15 bg-black/20 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/75">Sports</span>
        <div className="grid grid-cols-3 gap-1.5 flex-1 min-w-0">
          {leagues.map(({ id, emoji }) => {
            const score = scores[id]
            const problem = requestError || errors[id]
            return <div key={id} className="min-w-0 rounded-lg bg-black/25 px-1.5 py-2 text-center">
              <div className="text-[10px] font-bold text-white">{emoji} {id}</div>
              {score ? <>
                <div className="text-[10px] sm:text-xs font-semibold text-white tabular-nums break-words">{score.away} {score.awayScore}–{score.homeScore} {score.home}</div>
                <div className="text-[9px] text-gray-300" title={new Date(score.date).toLocaleString('en-US', { timeZone: 'America/Chicago' })}>{score.live ? '● LIVE' : 'FINAL'} · {new Date(score.date).toLocaleDateString('en-US', { timeZone: 'America/Chicago', month: 'short', day: 'numeric' })}</div>
              </> : <div className="text-[10px] text-gray-300" title={problem || undefined}>
                {loading ? 'Loading…' : problem ? 'API error' : 'No recent final'}
              </div>}
            </div>
          })}
        </div>
      </div>
      {requestError && <p className="px-3 pb-2 text-[10px] text-orange-300">Sports unavailable: {requestError}</p>}
    </section>
  )
}
