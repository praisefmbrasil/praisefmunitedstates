import { Link } from 'react-router-dom'
import LatestSportsScores from '../components/LatestSportsScores'

const leagues = [
  {
    id: 'nfl',
    name: 'NFL',
    fullName: 'National Football League',
    emoji: '🏈',
    description: 'American football scores and results.',
    path: '/sports/nfl',
  },
  {
    id: 'nba',
    name: 'NBA',
    fullName: 'National Basketball Association',
    emoji: '🏀',
    description: 'Basketball scores and results.',
    path: '/sports/nba',
  },
  {
    id: 'mlb',
    name: 'MLB',
    fullName: 'Major League Baseball',
    emoji: '⚾',
    description: 'Baseball scores and results.',
    path: '/sports/mlb',
  },
]

export default function SportsIndex() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 text-white">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
          Praise FM USA
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Sports Center
        </h1>
        <p className="mt-2 text-white/70">
          Latest scores, results and updates from American sports.
        </p>
      </header>

      <LatestSportsScores />

      <section>
        <h2 className="mb-4 text-xl font-bold">Explore the leagues</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leagues.map((league) => (
            <Link
              key={league.id}
              to={league.path}
              className="group block rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-orange-400/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl" aria-hidden="true">
                  {league.emoji}
                </span>
                <span className="text-sm font-semibold text-orange-400 transition group-hover:translate-x-1">
                  Explore →
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-bold">{league.name}</h3>
              <p className="mt-1 text-sm text-white/60">
                {league.fullName}
              </p>
              <p className="mt-4 text-sm text-white/80">
                {league.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
