import React, { useEffect, useState } from 'react'

interface ForecastItem {
  day: string
  temp: string
  condition: string
}

const EMPTY_FORECAST: ForecastItem[] = [
  { day: 'Today', temp: '--°F', condition: 'Unavailable' },
  { day: 'Tomorrow', temp: '--°F', condition: 'Unavailable' },
  { day: 'Next', temp: '--°F', condition: 'Unavailable' }
]

const API_KEY = '46c6e2c5797e2e465e06600d29810afe'
const LAT = '41.8781'
const LON = '-87.6298'
const CHICAGO_TZ = 'America/Chicago'

const chicagoDateKey = (date: Date): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: CHICAGO_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)

const chicagoWeekday = (date: Date): string =>
  new Intl.DateTimeFormat('en-US', {
    timeZone: CHICAGO_TZ,
    weekday: 'short'
  }).format(date)

export default function WeatherBar() {
  const [forecast, setForecast] = useState<ForecastItem[]>(EMPTY_FORECAST)

  useEffect(() => {
    const controller = new AbortController()
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=imperial&appid=${API_KEY}`

    const loadForecast = async () => {
      try {
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) throw new Error(`Weather HTTP ${response.status}`)
        const data = await response.json()
        if (!Array.isArray(data?.list)) throw new Error('Invalid weather response')

        // Use Chicago's calendar days rather than fixed 3-hour array offsets.
        const todayKey = chicagoDateKey(new Date())
        const grouped = new Map<string, any[]>()
        for (const entry of data.list) {
          if (typeof entry.dt !== 'number') continue
          const date = new Date(entry.dt * 1000)
          const key = chicagoDateKey(date)
          if (key < todayKey) continue
          const entries = grouped.get(key) || []
          entries.push(entry)
          grouped.set(key, entries)
        }

        const days = [...grouped.entries()].slice(0, 3)
        const nextForecast = days.map(([key, entries], index): ForecastItem => {
          // Select the observation closest to noon in Chicago for each date.
          const atNoon = [...entries].sort((a, b) => {
            const hour = (e: any) => Number(new Intl.DateTimeFormat('en-US', {
              timeZone: CHICAGO_TZ, hour: '2-digit', hour12: false
            }).format(new Date(e.dt * 1000))) % 24
            return Math.abs(hour(a) - 12) - Math.abs(hour(b) - 12)
          })[0]
          const date = new Date(atNoon.dt * 1000)
          return {
            day: index === 0 && key === todayKey ? 'Today' : index === 1 && days[0]?.[0] === todayKey ? 'Tomorrow' : chicagoWeekday(date),
            temp: typeof atNoon.main?.temp === 'number' ? `${Math.round(atNoon.main.temp)}°F` : '--°F',
            condition: atNoon.weather?.[0]?.main || 'Unavailable'
          }
        })

        setForecast([...nextForecast, ...EMPTY_FORECAST.slice(nextForecast.length)].slice(0, 3))
      } catch (error) {
        if (!controller.signal.aborted) setForecast(EMPTY_FORECAST)
      }
    }

    void loadForecast()
    return () => controller.abort()
  }, [])

  return (
    <div className="py-6">
      <div className="bg-[#101827]/65 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-orange-500 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h10a4 4 0 001.5-7.7A5 5 0 008.5 7.3 4.5 4.5 0 003 15z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-black text-orange-500 uppercase tracking-wide">Chicago, IL</p>
              <h3 className="text-sm font-normal leading-tight !text-white">Weather Outlook</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          {forecast.map((item, index) => (
            <div key={index} className="bg-white/10 px-3 py-2 rounded-xl text-center flex flex-col items-center justify-center min-w-[85px]">
              <span className="text-[10px] font-bold text-gray-300 uppercase">{item.day}</span>
              <span className="text-sm font-black text-white my-0.5">{item.temp}</span>
              <span className="text-[10px] text-gray-300 truncate max-w-full">{item.condition}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
