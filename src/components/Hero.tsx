import React, { useState, useEffect, useMemo } from 'react'
import { Play, Pause, ChevronRight, Zap, ArrowRight } from 'lucide-react'
import { SCHEDULES } from '../constants'
import { Program } from '../types'
import { cloudinaryImage } from '../cloudinaryImage'
import { useNavigate } from 'react-router-dom'

const getChicagoInfo = () => {
  const now = new Date()
  const chicagoString = now.toLocaleString('en-US', {
    timeZone: 'America/Chicago',
  })
  const chicagoDate = new Date(chicagoString)
  const h = chicagoDate.getHours()
  const m = chicagoDate.getMinutes()
  const day = chicagoDate.getDay()
  return { day, totalMinutes: h * 60 + m }
}

const parseTime = (time24: string) => {
  const parts = time24.split(':')
  const h = parseInt(parts[0] || '0', 10)
  const m = parseInt(parts[1] || '0', 10)
  return { h, m }
}

const format12h = (time24: string) => {
  const { h, m } = parseTime(time24)
  const period = h >= 12 ? 'PM' : 'AM'
  const displayH = h % 12 || 12
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`
}

interface HeroProps {
  onListenClick: () => void
  isPlaying: boolean
  liveMetadata?: { artist: string; title: string; artwork?: string } | null
  onNavigateToProgram: (program: Program) => void
}

const Hero: React.FC<HeroProps> = ({
  onListenClick,
  isPlaying,
  liveMetadata,
  onNavigateToProgram,
}) => {
  const [tick, setTick] = useState(0)
  const [showDetails, setShowDetails] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000)
    return () => clearInterval(interval)
  }, [])

  const chicago = useMemo(() => getChicagoInfo(), [tick])

  const { currentProgram, upNextPrograms } = useMemo(() => {
    const schedule = Array.isArray(SCHEDULES[chicago.day]) ? SCHEDULES[chicago.day] : SCHEDULES[1]

    const currentIndex = schedule.findIndex((p) => {
      const startTime = parseTime(p.startTime)
      const endTime = parseTime(p.endTime)

      const start = startTime.h * 60 + startTime.m
      let end = endTime.h * 60 + endTime.m

      if (end === 0 || end <= start) end = 24 * 60

      return chicago.totalMinutes >= start && chicago.totalMinutes < end
    })

    const current = currentIndex !== -1 ? schedule[currentIndex] : schedule[0]
    const next =
      currentIndex !== -1
        ? schedule.slice(currentIndex + 1, currentIndex + 3)
        : schedule.slice(1, 3)

    return {
      currentProgram: current || null,
      upNextPrograms: Array.isArray(next) ? next : [],
    }
  }, [chicago])

  const progress = useMemo(() => {
    if (!currentProgram) return 0

    const startTime = parseTime(currentProgram.startTime)
    const endTime = parseTime(currentProgram.endTime)

    const start = startTime.h * 60 + startTime.m
    let end = endTime.h * 60 + endTime.m

    if (end === 0 || end <= start) end = 24 * 60

    const elapsed = chicago.totalMinutes - start
    const duration = end - start

    if (duration <= 0) return 0

    return Math.min(Math.max(elapsed / duration, 0), 1)
  }, [currentProgram, chicago.totalMinutes])

  if (!currentProgram) return null

  const circleSize = 192
  const strokeWidth = 4
  const center = circleSize / 2
  const radius = center - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - progress * circumference

  return (
    <section className="bg-white dark:bg-[#000000] py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
          <div
            className="relative flex-shrink-0 group cursor-pointer"
            onClick={() => onNavigateToProgram(currentProgram)}
          >
            <div
              className="relative rounded-full overflow-hidden"
              style={{ width: circleSize, height: circleSize }}
            >
              {/* LCP element: imagem principal do host ao vivo.
                  fetchPriority + width/height + loading="eager" garantem
                  que o navegador baixe e decodifique isso primeiro,
                  sem competir com imagens abaixo da dobra. */}
              <img
                src={currentProgram.image}
                alt={currentProgram.title}
                width={circleSize}
                height={circleSize}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <svg
                width={circleSize}
                height={circleSize}
                className="absolute inset-0 -rotate-90 pointer-events-none"
              >
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke="#dbdbdb"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  className="dark:stroke-white/10"
                />
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke="#ff6600"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="butt"
                />
              </svg>
            </div>

            <div className="absolute bottom-2 right-2 w-12 h-12 bg-black rounded-full flex items-center justify-center border-[3px] border-white dark:border-black shadow-lg">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
          </div>

          <div className="flex-grow pt-4 text-center md:text-left">
            <div className="text-[11px] font-normal text-gray-500 dark:text-gray-400 mb-1 flex items-center justify-center md:justify-start space-x-2">
              <span>
                {format12h(currentProgram.startTime)} - {format12h(currentProgram.endTime)}
              </span>
            </div>

            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-1 hover:text-[#ff6600] transition-colors cursor-pointer inline-flex items-center"
              onClick={() => onNavigateToProgram(currentProgram)}
            >
              {currentProgram.title} with {currentProgram.host}
              <ChevronRight className="w-6 h-6 ml-1 text-[#ff6600]" />
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400 font-normal mb-6">
              {currentProgram.description}
            </p>

            <button
              onClick={onListenClick}
              className="bg-[#ff6600] text-white px-10 py-3.5 flex items-center justify-center space-x-3 hover:bg-[#e65c00] transition-all active:scale-95 mx-auto md:mx-0 rounded-sm shadow-md"
            >
              {isPlaying ? (
                <Pause className="fill-current w-5 h-5" />
              ) : (
                <Play className="fill-current w-5 h-5" />
              )}
              <span className="text-lg font-bold tracking-tight">
                {isPlaying ? 'Pause' : 'Play'}
              </span>
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="mt-16 pt-8 border-t border-gray-100 dark:border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {upNextPrograms.map((prog) => (
                  <div
                    key={prog.id}
                    className="flex items-start space-x-5 group cursor-pointer"
                    onClick={() => onNavigateToProgram(prog)}
                  >
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 overflow-hidden">
                      {/* Abaixo da dobra: lazy loading libera banda pra imagem LCP acima. */}
                      <img
                        src={cloudinaryImage(prog.image, 224)}
                        alt={prog.title}
                        loading="lazy"
                        decoding="async"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div className="flex flex-col">
                      <div className="text-[11px] font-normal mb-1">
                        <span className="text-[#ff6600] uppercase tracking-widest font-semibold mr-2">
                          UP NEXT
                        </span>
                        <span className="text-gray-400 font-normal">
                          {format12h(prog.startTime)} - {format12h(prog.endTime)}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-[#ff6600] transition-colors">
                        {prog.title}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">
                        {prog.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="mt-12 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-8 flex flex-col md:flex-row items-center justify-between group cursor-pointer transition-all hover:border-[#ff6600]/50"
              onClick={() => navigate('/new-releases')}
            >
              <div className="flex items-center space-x-6 mb-6 md:mb-0">
                <div className="w-14 h-14 bg-black dark:bg-white rounded-full flex items-center justify-center relative">
                  <Zap className="w-6 h-6 text-[#ff6600] fill-current animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-2 border-[#ff6600] scale-110 animate-ping opacity-20" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-1">
                    New Music Alert
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-normal uppercase tracking-widest">
                    Fresh anthems dropping now
                  </p>
                </div>
              </div>

              <button className="flex items-center space-x-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-black dark:text-white group-hover:text-[#ff6600] transition-colors">
                <span>Explore All</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 pt-6">
          {showDetails && (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 italic">
                {currentProgram.description.split('.')[0]}.
              </p>

              <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase font-medium tracking-widest mb-4">
                Produced by PRAISE FM Global.
              </p>
            </>
          )}

          <div className="flex flex-col space-y-3">
            {showDetails && (
              <button
                onClick={() => onNavigateToProgram(currentProgram)}
                className="flex items-center text-sm font-semibold text-black dark:text-white hover:text-[#ff6600] transition-colors w-fit group"
              >
                Programme Website <ExternalLinkIcon className="w-4 h-4 ml-2 text-[#ff6600]" />
              </button>
            )}

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center text-sm font-semibold text-black dark:text-white hover:text-[#ff6600] transition-colors w-fit"
            >
              {showDetails ? (
                <>
                  Show less <ChevronUpIcon className="w-4 h-4 ml-1 text-[#ff6600]" />
                </>
              ) : (
                <>
                  Show more <ChevronDownIcon className="w-4 h-4 ml-1 text-[#ff6600]" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
)

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export default Hero
