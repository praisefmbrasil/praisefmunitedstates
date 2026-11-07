
import React, { useState, useRef, useEffect, useMemo } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { Play, Pause } from 'lucide-react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RecentlyPlayed from './components/RecentlyPlayed'
import LivePlayerBar from './components/LivePlayerBar'
import ProgramDetail from './components/ProgramDetail'
import Playlist from './components/Playlist'
import ScheduleList from './components/ScheduleList'
import SEO from './components/SEO'
import WeatherBar from './components/WeatherBar'
import LatestSportsScores from './components/LatestSportsScores'
import UpcomingConcerts from './components/UpcomingConcerts'
import AmbientBackground from './components/AmbientBackground'

import './praise-ambient-glow.css'

import DevotionalPage from './pages/DevotionalPage'
import NewReleasesPage from './pages/NewReleasesPage'
import FeaturedArtistsPage from './pages/FeaturedArtistsPage'
import PresentersPage from './pages/PresentersPage'
import HelpCenterPage from './pages/HelpCenterPage'
import FeedbackPage from './pages/FeedbackPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfUsePage from './pages/TermsOfUsePage'
import CookiesPolicyPage from './pages/CookiesPolicyPage'
import SportsIndex from './pages/SportsIndex'
import SportsLeaguePage from './pages/SportsLeaguePage'

import { SCHEDULES } from './constants'
import { Program } from './types'

const DEFAULT_COVER = '/icon-512.png'
const STREAM_URL = 'https://stream.zeno.fm/vku09lx2rkntv'
const METADATA_URL =
  'https://api.zeno.fm/mounts/metadata/subscribe/vku09lx2rkntv'

const STALL_RECONNECT_DELAY = 8000
const MAX_RETRY_DELAY = 30000

const BLOCKED_METADATA_KEYWORDS = [
  'praise fm',
  'praisefm',
  'commercial',
  'spot',
  'promo',
  'ident',
  'sweeper',
  'intro',
  'program',
  'announcement',
  'station id',
  'jingle',
  'bumper',
]

interface LiveMetadata {
  artist: string
  title: string
  playedAt?: Date
  isMusic?: boolean
}

type SEOPage = {
  title: string
  description: string
}

const updateMediaSessionMetadata = (
  title: string,
  artist: string,
) => {
  if (!('mediaSession' in navigator)) return

  navigator.mediaSession.metadata = new MediaMetadata({
    title,
    artist,
    album: 'Praise FM USA',
    artwork: [
      {
        src: DEFAULT_COVER,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  })
}

const formatToAmPm = (time?: string) => {
  if (!time) return ''

  const [hourRaw, minuteRaw] = time.split(':').map(Number)
  const hour =
    hourRaw === 0
      ? 12
      : hourRaw > 12
        ? hourRaw - 12
        : hourRaw

  const minute = String(minuteRaw || 0).padStart(2, '0')
  const period = hourRaw >= 12 ? 'PM' : 'AM'

  return `${hour}:${minute} ${period}`
}

const formatRangeToAmPm = (
  start?: string,
  end?: string,
) => {
  if (!start || !end) return '24/7'

  return `${formatToAmPm(start)} - ${formatToAmPm(end)}`
}

const getChicagoDayAndTotalMinutes = () => {
  const now = new Date()

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(now)

  const weekday =
    parts.find((part) => part.type === 'weekday')?.value || 'Mon'

  let hour = Number(
    parts.find((part) => part.type === 'hour')?.value || 0,
  )

  const minute = Number(
    parts.find((part) => part.type === 'minute')?.value || 0,
  )

  // Alguns ambientes podem representar meia-noite como 24.
  if (hour === 24) hour = 0

  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }

  return {
    day: dayMap[weekday] ?? 1,
    total: hour * 60 + minute,
  }
}

const getProgramProgress = (program?: Program) => {
  if (!program) return 0

  const { total } = getChicagoDayAndTotalMinutes()

  const [startHour, startMinute] = program.startTime
    .split(':')
    .map(Number)

  const [endHour, endMinute] = program.endTime
    .split(':')
    .map(Number)

  const start = startHour * 60 + startMinute
  let end = endHour * 60 + endMinute

  if (end === 0 || end <= start) {
    end = 24 * 60
  }

  if (total <= start) return 0
  if (total >= end) return 100

  return Math.round(((total - start) / (end - start)) * 100)
}

const getProgramImage = (program?: Program) => {
  const item = program as any

  return (
    item?.image ||
    item?.cover ||
    item?.presenterImage ||
    item?.presenter?.image ||
    DEFAULT_COVER
  )
}

// Gera URLs estáveis para páginas de programas.
const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Localiza os programas cadastrados na programação.
const getAllPrograms = (): Program[] =>
  Object.values(SCHEDULES).flat() as Program[]

const findProgramBySlug = (
  slug: string,
): Program | undefined =>
  getAllPrograms().find(
    (program) => slugify(program.title) === slug,
  )

const SEO_PAGES: Record<string, SEOPage> = {
  '/': {
    title: 'Praise FM USA | Live Christian Radio, Gospel & Worship',
    description:
      'Listen live to Praise FM USA for gospel music, Christian hits, worship, devotionals and uplifting programs 24/7.',
  },
  '/music': {
    title: 'Gospel & Worship Music | Praise FM USA',
    description:
      'Discover gospel music, Christian hits and worship songs on Praise FM USA.',
  },
  '/schedule': {
    title: 'Radio Schedule & Programs | Praise FM USA',
    description:
      'Explore the Praise FM USA radio schedule, shows, presenters and broadcast times.',
  },
  '/devotional': {
    title: 'Christian Devotionals | Praise FM USA',
    description:
      'Find Christian encouragement and faith-centered devotionals with Praise FM USA.',
  },
  '/new-releases': {
    title: 'New Christian Music Releases | Praise FM USA',
    description:
      'Discover new gospel releases and Christian worship music featured by Praise FM USA.',
  },
  '/artists': {
    title: 'Gospel Artists & Christian Singers | Praise FM USA',
    description:
      'Discover gospel artists, Christian singers and worship music featured by Praise FM USA.',
  },
  '/presenters': {
    title: 'Radio Hosts & Presenters | Praise FM USA',
    description:
      'Meet the hosts and presenters behind Praise FM USA radio programs.',
  },
  '/sports': {
    title: 'Sports Updates & Scores | Praise FM USA',
    description:
      'Follow sports updates, scores and highlights with Praise FM USA.',
  },
  '/help': {
    title: 'Listening Help & Support | Praise FM USA',
    description:
      'Get help listening to Praise FM USA and find answers to common questions.',
  },
  '/feedback': {
    title: 'Contact & Feedback | Praise FM USA',
    description:
      'Send feedback and get in touch with the Praise FM USA team.',
  },
  '/privacy': {
    title: 'Privacy Policy | Praise FM USA',
    description:
      'Read the privacy policy for the Praise FM USA website.',
  },
  '/terms': {
    title: 'Terms of Use | Praise FM USA',
    description:
      'Read the terms of use for the Praise FM USA website.',
  },
  '/cookies': {
    title: 'Cookie Policy | Praise FM USA',
    description:
      'Learn about cookies used on the Praise FM USA website.',
  },
}

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

interface HomeBBCProps {
  isPlaying: boolean
  liveMetadata: LiveMetadata | null
  currentProgram?: Program
  queue: Program[]
  onListenClick: () => void
  onNavigateToProgram: (program: Program) => void
  trackHistory: LiveMetadata[]
}

const HomeBBC = ({
  isPlaying,
  liveMetadata,
  currentProgram,
  queue,
  onListenClick,
  onNavigateToProgram,
  trackHistory,
}: HomeBBCProps) => {
  const nextPrograms = queue.slice(0, 3)
  const presenterImage = getProgramImage(currentProgram)
  const progress = getProgramProgress(currentProgram)

  const size = 190
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  return (
    <section className="bg-transparent text-gray-950 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="flex flex-col md:grid md:grid-cols-[220px_1fr] gap-8 md:gap-10 items-center pb-8 md:pb-10">
          <button
            type="button"
            aria-label={
              currentProgram
                ? `View ${currentProgram.title}`
                : 'Praise FM'
            }
            onClick={() =>
              currentProgram && onNavigateToProgram(currentProgram)
            }
            className="relative w-[190px] h-[190px] mx-auto md:mx-0 flex-shrink-0 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 rounded-full"
          >
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox={`0 0 ${size} ${size}`}
              aria-hidden="true"
            >
              <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="none"
                className="text-gray-300 dark:text-gray-700"
                opacity={0.3}
              />
              <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#f97316"
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={
                  circumference * (1 - progress / 100)
                }
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute inset-[14px] rounded-full overflow-hidden bg-gray-200 shadow-lg">
              <img
                src={presenterImage}
                alt={currentProgram?.title || 'Praise FM'}
                className="w-full h-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = DEFAULT_COVER
                }}
              />
            </div>

            <div className="absolute -right-3 bottom-1 w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-4xl font-black border-4 border-white dark:border-[#121212] shadow-lg pointer-events-none">
              1
            </div>
          </button>

          <div className="text-center md:text-left w-full">
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm mb-2">
              <span className="text-white font-bold">LIVE</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500">
                {currentProgram
                  ? formatRangeToAmPm(
                      currentProgram.startTime,
                      currentProgram.endTime,
                    )
                  : '24/7'}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                currentProgram && onNavigateToProgram(currentProgram)
              }
              className="group text-center md:text-left w-full md:w-auto"
            >
              <h1 className="text-3xl md:text-4xl font-black leading-tight">
                {currentProgram?.title || 'Praise FM Live'}
                <span className="text-orange-500 ml-2 group-hover:ml-3 transition-all">
                  ›
                </span>
              </h1>
            </button>

            {currentProgram?.host && (
              <p className="text-white font-normal tracking-wide">
                {currentProgram.host}
              </p>
            )}

            <button
              type="button"
              onClick={onListenClick}
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-10 md:px-12 py-3 md:py-4 font-black text-lg transition active:scale-95 inline-flex items-center justify-center gap-3 mx-auto md:mx-0 rounded-xl shadow-lg shadow-orange-500/20"
            >
              {isPlaying ? (
                <Pause size={22} />
              ) : (
                <Play size={22} fill="currentColor" />
              )}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
          {nextPrograms.map((program) => (
            <div
              key={program.id || program.title}
              className="flex gap-4 text-left group items-center bg-gray-100 dark:bg-[#1A1A1A] p-4 rounded-2xl"
            >
              <button
                type="button"
                aria-label={`View ${program.title}`}
                onClick={() => onNavigateToProgram(program)}
                className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
              >
                <img
                  src={getProgramImage(program)}
                  alt={program.title}
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = DEFAULT_COVER
                  }}
                />
              </button>

              <button
                type="button"
                onClick={() => onNavigateToProgram(program)}
                className="min-w-0 text-left flex-1"
              >
                <p className="text-[11px] font-black text-orange-500 uppercase tracking-wide mb-0.5">
                  {formatRangeToAmPm(
                    program.startTime,
                    program.endTime,
                  )}
                </p>
                <h3 className="text-sm font-bold !text-white group-hover:!text-orange-400 leading-tight transition-colors truncate">
                  {program.title}
                </h3>
                <p className="text-xs !text-slate-300 mt-0.5 truncate">
                  {program.host}
                </p>
              </button>
            </div>
          ))}
        </div>

        <WeatherBar />
        <LatestSportsScores />
        <UpcomingConcerts
          artist={liveMetadata?.isMusic ? liveMetadata.artist : undefined}
        />

        <div className="mt-8 praise-recent-glass">
          <RecentlyPlayed tracks={trackHistory} />
        </div>
      </div>
    </section>
  )
}

interface ProgramRouteProps {
  liveMetadata: LiveMetadata | null
  trackHistory: LiveMetadata[]
  isPlaying: boolean
  onListenClick: () => void
  onBack: () => void
  onViewSchedule: () => void
}

const ProgramRoute = (props: ProgramRouteProps) => {
  const { slug = '' } = useParams()
  const program = findProgramBySlug(slug)

  if (!program) {
    return <Navigate to="/schedule" replace />
  }

  return <ProgramDetail program={program} {...props} />
}

const LegacyProgramRedirect = () => {
  const { slug = '' } = useParams()
  const program = findProgramBySlug(slug)

  if (!program) {
    return <Navigate to="/schedule" replace />
  }

  return <Navigate to={`/program/${slugify(program.title)}`} replace />
}

const AppContent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [liveMetadata, setLiveMetadata] =
    useState<LiveMetadata | null>(null)
  const [trackHistory, setTrackHistory] = useState<LiveMetadata[]>([])
  const [selectedProgram, setSelectedProgram] =
    useState<Program | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  const shouldBePlayingRef = useRef(false)
  const retryTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null)
  const stallTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryCountRef = useRef(0)
  const reconnectingRef = useRef(false)

  const location = useLocation()
  const navigate = useNavigate()

  const [clockTick, setClockTick] = useState(0)

  useEffect(() => {
    const id = window.setInterval(
      () => setClockTick((tick) => tick + 1),
      60000,
    )

    return () => window.clearInterval(id)
  }, [])

  const { day, total } = getChicagoDayAndTotalMinutes()
  void clockTick

  const { currentProgram, queue } = useMemo(() => {
    const schedule = SCHEDULES[day] || SCHEDULES[1]

    const currentIndex = schedule.findIndex((program: Program) => {
      const [startHour, startMinute] = program.startTime
        .split(':')
        .map(Number)

      const [endHour, endMinute] = program.endTime
        .split(':')
        .map(Number)

      const start = startHour * 60 + startMinute
      let end = endHour * 60 + endMinute

      if (end === 0 || end <= start) end = 24 * 60

      return total >= start && total < end
    })

    const safeIndex = currentIndex === -1 ? 0 : currentIndex
    const activeProgram = schedule[safeIndex]

    const nextPrograms: Program[] = []

    for (let index = 1; index <= 4; index++) {
      nextPrograms.push(
        schedule[(safeIndex + index) % schedule.length],
      )
    }

    return {
      currentProgram: activeProgram,
      queue: nextPrograms,
    }
  }, [day, total])

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  // Player Zeno e reconexão automática.
  useEffect(() => {
    const audio = new Audio(STREAM_URL)

    audio.crossOrigin = 'anonymous'
    audio.preload = 'none'
    audio.volume = parseFloat(
      localStorage.getItem('praise-volume') || '0.8',
    )

    const clearStallTimer = () => {
      if (stallTimeoutRef.current) {
        clearTimeout(stallTimeoutRef.current)
        stallTimeoutRef.current = null
      }
    }

    const clearRetryTimer = () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
    }

    let scheduleRetry: () => void

    const reconnect = () => {
      if (reconnectingRef.current) return
      if (!shouldBePlayingRef.current) return

      reconnectingRef.current = true
      clearStallTimer()

      audio.src = `${STREAM_URL}?_=${Date.now()}`
      audio.load()

      audio.play()
        .then(() => {
          retryCountRef.current = 0
          reconnectingRef.current = false
        })
        .catch(() => {
          reconnectingRef.current = false
          scheduleRetry()
        })
    }

    scheduleRetry = () => {
      clearRetryTimer()

      const delay = Math.min(
        2000 * 2 ** retryCountRef.current,
        MAX_RETRY_DELAY,
      )

      retryCountRef.current += 1
      retryTimeoutRef.current = setTimeout(reconnect, delay)
    }

    const armStallTimer = () => {
      clearStallTimer()

      if (!shouldBePlayingRef.current) return

      stallTimeoutRef.current = setTimeout(
        reconnect,
        STALL_RECONNECT_DELAY,
      )
    }

    const handlePlay = () => {
      setIsPlaying(true)
      clearStallTimer()
      clearRetryTimer()
      retryCountRef.current = 0

      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing'
      }
    }

    const handlePlaying = () => {
      setIsPlaying(true)
      clearStallTimer()
      clearRetryTimer()
      retryCountRef.current = 0

      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing'
      }
    }

    const handlePause = () => {
      setIsPlaying(false)

      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused'
      }

      if (shouldBePlayingRef.current) {
        scheduleRetry()
      }
    }

    const handleWaitingOrStalled = () => {
      armStallTimer()
    }

    const handleError = () => {
      setIsPlaying(false)
      clearStallTimer()

      if (shouldBePlayingRef.current) {
        scheduleRetry()
      }
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('playing', handlePlaying)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('waiting', handleWaitingOrStalled)
    audio.addEventListener('stalled', handleWaitingOrStalled)
    audio.addEventListener('suspend', handleWaitingOrStalled)
    audio.addEventListener('error', handleError)

    audioRef.current = audio

    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.setActionHandler('play', () => {
          shouldBePlayingRef.current = true
          audio.play().catch(() => {})
        })

        navigator.mediaSession.setActionHandler('pause', () => {
          shouldBePlayingRef.current = false
          audio.pause()
        })

        navigator.mediaSession.setActionHandler('stop', () => {
          shouldBePlayingRef.current = false
          audio.pause()
        })

        navigator.mediaSession.setActionHandler(
          'previoustrack',
          null,
        )
        navigator.mediaSession.setActionHandler('nexttrack', null)
        navigator.mediaSession.setActionHandler('seekto', null)

        updateMediaSessionMetadata('Praise FM USA', 'Live')
      } catch {
        // Alguns navegadores não suportam todas as ações da Media Session.
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return
      if (!shouldBePlayingRef.current) return

      const readyAndPlaying =
        !audio.paused &&
        !audio.ended &&
        audio.readyState >= 3

      if (!readyAndPlaying) reconnect()
    }

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    )

    const handleDeviceChange = () => {
      if (!shouldBePlayingRef.current) return

      window.setTimeout(() => reconnect(), 1000)
    }

    if (
      navigator.mediaDevices &&
      'addEventListener' in navigator.mediaDevices
    ) {
      navigator.mediaDevices.addEventListener(
        'devicechange',
        handleDeviceChange,
      )
    }

    let lastCheckedTime = -1

    const heartbeat = window.setInterval(() => {
      if (!shouldBePlayingRef.current || audio.paused) return

      if (audio.currentTime === lastCheckedTime) {
        reconnect()
      }

      lastCheckedTime = audio.currentTime
    }, 15000)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('playing', handlePlaying)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('waiting', handleWaitingOrStalled)
      audio.removeEventListener('stalled', handleWaitingOrStalled)
      audio.removeEventListener('suspend', handleWaitingOrStalled)
      audio.removeEventListener('error', handleError)

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      )

      if (
        navigator.mediaDevices &&
        'removeEventListener' in navigator.mediaDevices
      ) {
        navigator.mediaDevices.removeEventListener(
          'devicechange',
          handleDeviceChange,
        )
      }

      window.clearInterval(heartbeat)
      clearStallTimer()
      clearRetryTimer()

      audio.pause()
      audio.src = ''
      audioRef.current = null

      if ('mediaSession' in navigator) {
        try {
          navigator.mediaSession.playbackState = 'none'
          navigator.mediaSession.setActionHandler('play', null)
          navigator.mediaSession.setActionHandler('pause', null)
          navigator.mediaSession.setActionHandler('stop', null)
        } catch {
          // A limpeza da Media Session pode variar por navegador.
        }
      }
    }
  }, [])

  const togglePlayback = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      shouldBePlayingRef.current = false
      audio.pause()
      return
    }

    shouldBePlayingRef.current = true
    audio.play().catch(() => setIsPlaying(false))
  }

  const openProgramPage = (program: Program) => {
    setSelectedProgram(program)
    navigate(`/program/${slugify(program.title)}`)
  }

  // Metadados da música ao vivo via Zeno.
  useEffect(() => {
    const eventSource = new EventSource(METADATA_URL, {
      withCredentials: false,
    })

    eventSourceRef.current = eventSource

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        const streamTitle = data.streamTitle || ''

        if (!streamTitle.includes(' - ')) return

        const [artistRaw, ...titleParts] = streamTitle.split(' - ')
        const artist = artistRaw.trim()
        const title = titleParts.join(' - ').trim()

        if (!artist || !title) return

        const fullText = `${artist} ${title}`.toLowerCase()

        if (
          BLOCKED_METADATA_KEYWORDS.some((keyword) =>
            fullText.includes(keyword),
          )
        ) {
          return
        }

        setLiveMetadata((previous) => {
          if (
            previous &&
            previous.title === title &&
            previous.artist === artist
          ) {
            return previous
          }

          const metadata: LiveMetadata = {
            artist,
            title,
            playedAt: new Date(),
            isMusic: true,
          }

          setTrackHistory((history) =>
            [metadata, ...history].slice(0, 10),
          )

          updateMediaSessionMetadata(title, artist)

          return metadata
        })
      } catch {
        // Ignora mensagens de metadados inválidas.
      }
    }

    return () => {
      eventSource.close()
      eventSourceRef.current = null
    }
  }, [])

  const pathname =
    location.pathname.replace(/\/+$/, '') || '/'

  const programSlug = pathname.startsWith('/program/')
    ? pathname.split('/')[2]
    : undefined

  const pageProgram = programSlug
    ? findProgramBySlug(programSlug)
    : undefined

  const seo = pageProgram
    ? {
        title: `${pageProgram.title} | Praise FM USA`,
        description:
          `Discover ${pageProgram.title} on Praise FM USA. ` +
          'Explore program details, broadcast information and Christian radio content.',
      }
    : SEO_PAGES[pathname] || {
        title: 'Praise FM USA | Christian Radio & Worship',
        description:
          'Listen to gospel music, Christian worship and inspirational programming on Praise FM USA, streaming 24/7.',
      }

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RadioStation',
    name: 'Praise FM USA',
    url: 'https://praisefmradio.vercel.app/',
    logo: 'https://praisefmradio.vercel.app/icon-512.png',
    description: SEO_PAGES['/'].description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
  }

  return (
    <div className="relative isolate min-h-screen flex flex-col pb-[120px] transition-colors praise-ambient-home">
      <AmbientBackground
        title={currentProgram?.title || 'Praise FM'}
        artwork={getProgramImage(currentProgram)}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <SEO
          title={seo.title}
          description={seo.description}
          url={pathname}
          jsonLd={pathname === '/' ? homeJsonLd : undefined}
        />

        <Navbar
          activeTab={
            pathname === '/'
              ? 'home'
              : pathname.split('/')[1]
          }
          theme="dark"
          glass
        />

        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <HomeBBC
                  isPlaying={isPlaying}
                  liveMetadata={liveMetadata}
                  currentProgram={currentProgram}
                  queue={queue}
                  onListenClick={togglePlayback}
                  onNavigateToProgram={openProgramPage}
                  trackHistory={trackHistory}
                />
              }
            />

            {/* Compatibilidade com links antigos de programas. */}
            <Route
              path="/program"
              element={
                selectedProgram ? (
                  <ProgramDetail
                    program={selectedProgram}
                    liveMetadata={liveMetadata}
                    trackHistory={trackHistory}
                    isPlaying={isPlaying}
                    onListenClick={togglePlayback}
                    onBack={() => navigate('/schedule')}
                    onViewSchedule={() => navigate('/schedule')}
                  />
                ) : (
                  <Navigate to="/schedule" replace />
                )
              }
            />

            <Route
              path="/program/:slug"
              element={
                <ProgramRoute
                  liveMetadata={liveMetadata}
                  trackHistory={trackHistory}
                  isPlaying={isPlaying}
                  onListenClick={togglePlayback}
                  onBack={() => navigate('/schedule')}
                  onViewSchedule={() => navigate('/schedule')}
                />
              }
            />

            <Route
              path="/programs/:slug"
              element={<LegacyProgramRedirect />}
            />

            <Route path="/music" element={<Playlist />} />

            <Route
              path="/schedule"
              element={
                <ScheduleList
                  onNavigateToProgram={openProgramPage}
                  onBack={() => navigate('/')}
                />
              }
            />

            <Route path="/devotional" element={<DevotionalPage />} />
            <Route path="/new-releases" element={<NewReleasesPage />} />
            <Route path="/artists" element={<FeaturedArtistsPage />} />

            <Route
              path="/presenters"
              element={
                <PresentersPage
                  onNavigateToProgram={openProgramPage}
                />
              }
            />

            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfUsePage />} />
            <Route path="/cookies" element={<CookiesPolicyPage />} />

            <Route path="/sports" element={<SportsIndex />} />
            <Route
              path="/sports/:league"
              element={<SportsLeaguePage />}
            />

            {/* Não redireciona silenciosamente páginas inexistentes para a home. */}
            <Route
              path="/live-recordings"
              element={<Navigate to="/schedule" replace />}
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </main>

        <Footer />

        {currentProgram && (
          <LivePlayerBar
            isPlaying={isPlaying}
            onTogglePlayback={togglePlayback}
            program={currentProgram}
            liveMetadata={liveMetadata}
            queue={queue}
            audioRef={audioRef}
          />
        )}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
      <SpeedInsights />
      <Analytics />
    </BrowserRouter>
  )
}
