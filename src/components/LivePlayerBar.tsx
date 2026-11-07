import { cloudinaryImage } from '../cloudinaryImage';
// Praise FM USA: Schedule do mini player = programa atual + 2 proximos.
import React, { useState, useEffect, useMemo, useRef } from 'react'

import {

  Play,

  Pause,

  Volume2,

  VolumeX,

  Volume1,

  List,

  X,

  RotateCcw,

  RotateCw,

} from 'lucide-react'

import { Program } from '../types'



interface LivePlayerBarProps {

  isPlaying?: boolean

  onTogglePlayback?: () => void

  program?: Program

  liveMetadata?: {

    artist: string

    title: string

    artwork?: string

  } | null

  queue?: Program[]

  audioRef?: React.RefObject<HTMLAudioElement | null>

}



const formatTimeToAmPm = (timeString: string): string => {

  try {

    if (

      timeString.includes('AM') ||

      timeString.includes('PM')

    ) {

      return timeString

    }



    const parts = timeString.split(':')

    const hours = parts[0]

    const minutes = parts[1] || '00'



    let hour = parseInt(hours, 10)



    const period = hour >= 12 ? 'PM' : 'AM'



    hour = hour % 12 || 12



    return (

      String(hour) +

      ':' +

      minutes +

      ' ' +

      period

    )

  } catch {

    return timeString

  }

}



const getChicagoDayAndTotalMinutes = () => {

  const formatter = new Intl.DateTimeFormat(

    'en-US',

    {

      timeZone: 'America/Chicago',

      weekday: 'short',

      hour: '2-digit',

      minute: '2-digit',

      hour12: false,

    }

  )



  const parts = formatter.formatToParts(

    new Date()

  )



  const weekday =

    parts.find(

      (p) => p.type === 'weekday'

    )?.value || 'Mon'



  const hour = Number(

    parts.find(

      (p) => p.type === 'hour'

    )?.value || 0

  )



  const minute = Number(

    parts.find(

      (p) => p.type === 'minute'

    )?.value || 0

  )



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



const getProgramProgress = (

  program?: Program

): number => {

  if (!program) {

    return 0

  }



  const { total } =

    getChicagoDayAndTotalMinutes()



  const startParts =

    program.startTime

      .split(':')

      .map(Number)



  const endParts =

    program.endTime

      .split(':')

      .map(Number)



  const start =

    startParts[0] * 60 +

    startParts[1]



  let end =

    endParts[0] * 60 +

    endParts[1]



  if (

    end === 0 ||

    end <= start

  ) {

    end = 24 * 60

  }



  if (total <= start) {

    return 0

  }



  if (total >= end) {

    return 100

  }



  return Math.round(

    ((total - start) /

      (end - start)) *

      100

  )

}



const LivePlayerBar: React.FC<

  LivePlayerBarProps

> = ({

  isPlaying = false,

  onTogglePlayback = () => {},

  program = {

    id: '',

    title: 'Praise FM',

    host: '',

    startTime: '00:00',

    endTime: '00:00',

    description: '',

    image: '',

  },

  liveMetadata = null,

  queue = [],

  audioRef = {

    current: null,

  },

}) => {

  const [

    isExpanded,

    setIsExpanded,

  ] = useState(false)



  const [

    showSchedule,

    setShowSchedule,

  ] = useState(false)



  const [volume, setVolume] =

    useState(() => {

      return parseFloat(

        localStorage.getItem(

          'praise-volume'

        ) || '0.8'

      )

    })



  const [

    isMuted,

    setIsMuted,

  ] = useState(false)



  const [

    prevVolume,

    setPrevVolume,

  ] = useState(0.8)



  const [

    showVolumeSlider,

    setShowVolumeSlider,

  ] = useState(false)



  const [

    playbackRate,

    setPlaybackRate,

  ] = useState(1)



  // GA4 listening-session control.

  // These refs survive metadata/program updates without causing

  // duplicate audio_start / audio_60sec events.

  const audioStartSentRef =

    useRef(false)



  const audioPlayedSecondsRef =

    useRef(0)



  const audio60SentRef =

    useRef(false)



  const progress = useMemo(

    () =>

      getProgramProgress(

        program

      ),

    [program]

  )



  const displayTitle =

    liveMetadata?.title ||

    program.title



  const displayArtist =

    liveMetadata?.artist ||

    program.host



  const displayImage =

    liveMetadata?.artwork ||

    program.image



  /*

   * ==========================================================

   * HEARTBEAT GA4

   * ==========================================================

   */



  useEffect(() => {

    if (!isPlaying) {

      return

    }



    const sendHeartbeat = () => {

      const audio =

        audioRef.current



      if (

        audio &&

        audio.paused

      ) {

        return

      }



      const win =

        window as typeof window & {

          gtag?: (

            command: string,

            eventName: string,

            params?: Record<

              string,

              string | number

            >

          ) => void

        }



      if (

        typeof win.gtag !==

        'function'

      ) {

        return

      }



      win.gtag(

        'event',

        'audio_heartbeat',

        {

          station:

            'Praise FM',



          program:

            program.title ||

            'Praise FM',



          host:

            program.host ||

            '',



          listening_minutes:

            1,



          player:

            'website',

        }

      )

    }



    const heartbeat =

      window.setInterval(

        sendHeartbeat,

        60000

      )



    return () => {

      window.clearInterval(

        heartbeat

      )

    }

  }, [

    isPlaying,

    program.title,

    program.host,

    audioRef,

  ])



  /*

   * ==========================================================

   * AUDIO START

   * One event per listening session.

   * Program/host metadata can change while the stream keeps

   * playing; the ref prevents those updates from creating

   * false new Session Starts.

   * ==========================================================

   */



  useEffect(() => {

    if (!isPlaying) {

      audioStartSentRef.current =

        false



      return

    }



    if (

      audioStartSentRef.current

    ) {

      return

    }



    const win =

      window as typeof window & {

        gtag?: (

          command: string,

          eventName: string,

          params?: Record<

            string,

            string | number

          >

        ) => void

      }



    if (

      typeof win.gtag !==

      'function'

    ) {

      return

    }



    audioStartSentRef.current =

      true



    win.gtag(

      'event',

      'audio_start',

      {

        station:

          'Praise FM',



        program:

          program.title ||

          'Praise FM',



        host:

          program.host ||

          '',



        player:

          'website',

      }

    )

  }, [

    isPlaying,

    program.title,

    program.host,

  ])



  /*

   * ==========================================================

   * AUDIO 60SEC

   * One event after 60 seconds of actual playback in the

   * current listening session.

   * ==========================================================

   */



  useEffect(() => {

    if (!isPlaying) {

      audioPlayedSecondsRef.current =

        0



      audio60SentRef.current =

        false



      return

    }



    const interval =

      window.setInterval(

        () => {

          const audio =

            audioRef.current



          // If the HTMLAudioElement exists, only count time

          // while it is genuinely playing.

          if (

            audio &&

            (

              audio.paused ||

              audio.ended

            )

          ) {

            return

          }



          audioPlayedSecondsRef.current +=

            1



          if (

            audioPlayedSecondsRef.current <

              60 ||

            audio60SentRef.current

          ) {

            return

          }



          audio60SentRef.current =

            true



          const win =

            window as typeof window & {

              gtag?: (

                command: string,

                eventName: string,

                params?: Record<

                  string,

                  string | number

                >

              ) => void

            }



          if (

            typeof win.gtag !==

            'function'

          ) {

            return

          }



          win.gtag(

            'event',

            'audio_60sec',

            {

              station:

                'Praise FM',



              program:

                program.title ||

                'Praise FM',



              host:

                program.host ||

                '',



              seconds_played:

                60,



              player:

                'website',

            }

          )



          window.clearInterval(

            interval

          )

        },

        1000

      )



    return () => {

      window.clearInterval(

        interval

      )

    }

  }, [

    isPlaying,

    program.title,

    program.host,

    audioRef,

  ])



  /*

   * ==========================================================

   * AUDIO SETTINGS

   * ==========================================================

   */



  useEffect(() => {

    if (audioRef.current) {

      audioRef.current.volume =

        isMuted ? 0 : volume



      audioRef.current.muted =

        isMuted



      audioRef.current.playbackRate =

        playbackRate

    }

  }, [

    volume,

    isMuted,

    playbackRate,

    audioRef,

  ])



  const handleVolumeChange = (

    e: React.ChangeEvent<HTMLInputElement>

  ) => {

    const val =

      parseFloat(

        e.target.value

      )



    setVolume(val)



    if (val > 0) {

      setIsMuted(false)

      setPrevVolume(val)

    } else {

      setIsMuted(true)

    }



    localStorage.setItem(

      'praise-volume',

      val.toString()

    )

  }



  const toggleMute = () => {

    if (isMuted) {

      setIsMuted(false)



      setVolume(

        prevVolume > 0.05

          ? prevVolume

          : 0.8

      )

    } else {

      setPrevVolume(volume)

      setIsMuted(true)

    }

  }



  const cyclePlaybackRate = () => {

    const rates = [

      1,

      1.25,

      1.5,

      2,

    ]



    const index =

      rates.indexOf(

        playbackRate

      )



    setPlaybackRate(

      rates[

        (index + 1) %

          rates.length

      ]

    )

  }



  const VolumeIcon = () => {

    if (

      isMuted ||

      volume === 0

    ) {

      return (

        <VolumeX className="w-5 h-5" />

      )

    }



    if (volume < 0.5) {

      return (

        <Volume1 className="w-5 h-5" />

      )

    }



    return (

      <Volume2 className="w-5 h-5" />

    )

  }



  useEffect(() => {

    document.body.style.overflow =

      showSchedule ||

      isExpanded

        ? 'hidden'

        : 'unset'



    return () => {

      document.body.style.overflow =

        'unset'

    }

  }, [

    showSchedule,

    isExpanded,

  ])



  return (

    <>

      <div

        className={

          'praise-glow-schedule fixed top-0 right-0 bottom-[72px] md:bottom-0 w-full md:w-96 z-[100] bg-white dark:bg-[#121212] transition-transform duration-300 flex flex-col shadow-2xl ' +

          (showSchedule

            ? 'translate-x-0'

            : 'translate-x-full')

        }

      >

        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10">

          <h2 className="text-lg font-semibold text-black dark:text-white">

            Schedule

          </h2>



          <button

            onClick={() =>

              setShowSchedule(

                false

              )

            }

            aria-label="Close schedule"

            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"

          >

            <X className="w-5 h-5 text-black dark:text-white" />

          </button>

        </div>



        <div className="flex-grow overflow-y-auto pb-4 md:pb-0">

          <div className="p-3">

            <div className="flex items-start space-x-3">

              <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-200 dark:bg-gray-700">

                {program.image && (

                  <img

                    src={cloudinaryImage(program.image, 128)}

                    className="w-full h-full object-cover"

                    alt={program.title}

                    loading="lazy"

                    decoding="async"

                    width={64}

                    height={64}

                  />

                )}

              </div>



              <div className="flex flex-col min-w-0 flex-grow">

                <span className="font-bold text-base text-black dark:text-white leading-tight mb-1 truncate">

                  {program.title}

                </span>



                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">

                  {program.host}

                </span>



                <span className="text-xs text-gray-400 dark:text-gray-500 truncate">

                  {formatTimeToAmPm(

                    program.startTime

                  )}{' '}

                  -{' '}

                  {formatTimeToAmPm(

                    program.endTime

                  )}{' '}

                  • LIVE

                </span>

              </div>

            </div>

          </div>



          {queue

            .slice(0, 2)

            .map(

              (

                prog,

                index

              ) => (

                <div

                  key={prog.id}

                  className="p-3"

                >

                  <div className="flex items-start space-x-3">

                    <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-200 dark:bg-gray-700">

                      {prog.image && (

                        <img

                          src={cloudinaryImage(prog.image, 128)}

                          className="w-full h-full object-cover"

                          alt={

                            prog.title

                          }

                          loading="lazy"

                          decoding="async"

                          width={64}

                          height={64}

                        />

                      )}

                    </div>



                    <div className="flex flex-col min-w-0 flex-grow">

                      <span className="font-bold text-base text-black dark:text-white leading-tight mb-1 truncate">

                        {

                          prog.title

                        }

                      </span>



                      <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">

                        {

                          prog.host

                        }

                      </span>



                      <span className="text-xs text-gray-400 dark:text-gray-500 truncate">

                        {formatTimeToAmPm(

                          prog.startTime

                        )}{' '}

                        -{' '}

                        {formatTimeToAmPm(

                          prog.endTime

                        )}

                      </span>

                    </div>



                    <span className="text-xs font-medium text-orange-500 mt-1">

                      {index +

                        2}

                      °

                    </span>

                  </div>

                </div>

              )

            )}

        </div>

      </div>



      {showSchedule && (

        <div

          className="fixed inset-0 bg-black/50 z-[99] md:hidden"

          onClick={() =>

            setShowSchedule(

              false

            )

          }

        />

      )}



      {isPlaying && (

        <div

          className={

            'praise-glow-mini-player fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-white/10 md:hidden transition-all duration-300 ' +

            (isExpanded

              ? 'h-auto'

              : 'h-[72px]')

          }

        >

          {!isExpanded ? (

            <div

              className="flex items-center justify-between px-4 py-3 h-[72px] relative"

              onClick={() =>

                setIsExpanded(

                  true

                )

              }

            >

              <div className="flex flex-col min-w-0 flex-grow">

                <span className="text-base font-bold text-black dark:text-white leading-tight truncate">

                  {

                    displayTitle

                  }

                </span>



                <span className="text-sm text-gray-500 dark:text-gray-400 truncate leading-tight">

                  {

                    displayArtist

                  }{' '}

                  • LIVE

                </span>

              </div>



              <div className="flex items-center gap-2">

                <button

                  onClick={(e) => {

                    e.stopPropagation()

                    onTogglePlayback()

                  }}

                  aria-label="Pause radio"

                  className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-black dark:border-white flex items-center justify-center bg-white dark:bg-[#121212]"

                >

                  <Pause className="w-4 h-4 text-black dark:text-white fill-current" />

                </button>



                <button

                  onClick={(e) => {

                    e.stopPropagation()

                    setShowSchedule(

                      true

                    )

                  }}

                  aria-label="Open schedule"

                  className="p-2 text-gray-700 dark:text-gray-300"

                >

                  <List className="w-5 h-5" />

                </button>

              </div>



              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-white/10">

                <div

                  className="h-full bg-orange-500 transition-all duration-1000 ease-out"

                  style={{

                    width:

                      String(

                        progress

                      ) +

                      '%',

                  }}

                />

              </div>

            </div>

          ) : (

            <div className="flex flex-col">

              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10">

                <span className="text-sm font-semibold text-black dark:text-white">

                  Now Playing

                </span>



                <button

                  onClick={() => {

                    setIsExpanded(

                      false

                    )

                    setShowSchedule(

                      false

                    )

                  }}

                  aria-label="Close player"

                  className="p-2"

                >

                  <X className="w-5 h-5 text-black dark:text-white" />

                </button>

              </div>



              <div className="flex items-center space-x-3 px-4 py-4 border-b border-gray-100 dark:border-white/5">

                <div className="w-14 h-14 flex-shrink-0 rounded overflow-hidden bg-gray-200 dark:bg-gray-700">

                  {displayImage && (

                    <img

                      src={

                        displayImage

                      }

                      className="w-full h-full object-cover"

                      alt={

                        displayTitle

                      }

                      loading="lazy"

                      decoding="async"

                    />

                  )}

                </div>



                <div className="min-w-0 flex-grow">

                  <span className="font-bold text-base text-black dark:text-white leading-tight block truncate">

                    {

                      displayTitle

                    }

                  </span>



                  <span className="text-sm text-gray-500 dark:text-gray-400 block truncate">

                    {

                      displayArtist

                    }

                  </span>



                  <span className="text-xs text-gray-400 dark:text-gray-500">

                    {formatTimeToAmPm(

                      program.startTime

                    )}{' '}

                    -{' '}

                    {formatTimeToAmPm(

                      program.endTime

                    )}{' '}

                    • LIVE

                  </span>

                </div>

              </div>



              <div className="px-4 py-3">

                <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">

                  <div

                    className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out"

                    style={{

                      width:

                        String(

                          progress

                        ) +

                        '%',

                    }}

                  />

                </div>



                <div className="flex justify-between mt-1">

                  <span className="text-[10px] text-gray-400">

                    {formatTimeToAmPm(

                      program.startTime

                    )}

                  </span>



                  <span className="text-[10px] text-gray-400">

                    {formatTimeToAmPm(

                      program.endTime

                    )}

                  </span>

                </div>

              </div>



              <div className="flex items-center justify-center space-x-6 px-4 py-4">

                <button

                  aria-label="Rewind 30 seconds"

                  className="relative w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300"

                >

                  <RotateCcw className="w-5 h-5" />



                  <span className="absolute text-[9px] font-bold mt-[2px]">

                    30

                  </span>

                </button>



                <button

                  onClick={

                    onTogglePlayback

                  }

                  aria-label="Pause radio"

                  className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg"

                >

                  <Pause className="w-5 h-5 fill-current" />

                </button>



                <button

                  aria-label="Forward 30 seconds"

                  className="relative w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300"

                >

                  <RotateCw className="w-5 h-5" />



                  <span className="absolute text-[9px] font-bold mt-[2px]">

                    30

                  </span>

                </button>

              </div>



              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/5">

                <div className="flex items-center space-x-2 flex-grow">

                  <button

                    onClick={

                      toggleMute

                    }

                    aria-label={

                      isMuted

                        ? 'Unmute'

                        : 'Mute'

                    }

                    className="p-2"

                  >

                    <VolumeIcon />

                  </button>



                  <input

                    type="range"

                    min="0"

                    max="1"

                    step="0.01"

                    value={

                      isMuted

                        ? 0

                        : volume

                    }

                    onChange={

                      handleVolumeChange

                    }

                    aria-label="Volume"

                    className="flex-grow h-1 bg-gray-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-orange-500"

                  />



                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 w-6 text-right">

                    {Math.round(

                      (isMuted

                        ? 0

                        : volume) *

                        10

                    )}

                  </span>

                </div>



                <div className="flex items-center space-x-3 ml-4">

                  <button

                    onClick={

                      cyclePlaybackRate

                    }

                    className="px-2.5 py-1 text-xs font-semibold text-black dark:text-white border border-gray-300 dark:border-white/30 rounded"

                  >

                    {

                      playbackRate

                    }

                    ×

                  </button>



                  <div className="flex items-center space-x-1.5">

                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />



                    <span className="text-xs font-bold text-orange-500 uppercase">

                      LIVE

                    </span>

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      )}



      {isPlaying && (

        <div className="praise-glow-mini-player fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-white/10 hidden md:flex flex-col transition-colors duration-300">

          <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10">

            <div

              className="h-full bg-orange-500 transition-all duration-1000 ease-out"

              style={{

                width:

                  String(

                    progress

                  ) +

                  '%',

              }}

            />

          </div>



          <div className="flex items-center justify-between px-8 py-4">

            <div className="flex items-center space-x-4 w-[30%] min-w-0">

              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200 dark:border-white/10 shadow-sm bg-gray-200 dark:bg-gray-700">

                {displayImage && (

                  <img

                    src={

                      displayImage

                    }

                    alt=""

                    className="w-full h-full object-cover"

                    loading="lazy"

                    decoding="async"

                  />

                )}

              </div>



              <div className="min-w-0">

                <h4 className="font-semibold text-gray-900 dark:text-white leading-tight truncate text-[15px]">

                  {

                    displayTitle

                  }

                </h4>



                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">

                  {

                    displayArtist

                  }

                </p>

              </div>

            </div>



            <div className="flex items-center justify-center space-x-6">

              <button

                aria-label="Rewind 30 seconds"

                className="relative w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"

              >

                <RotateCcw className="w-5 h-5" />



                <span className="absolute text-[9px] font-bold mt-[2px]">

                  30

                </span>

              </button>



              <button

                onClick={

                  onTogglePlayback

                }

                aria-label="Pause radio"

                className="w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center hover:scale-105 transition-all active:scale-95 shadow-md"

              >

                <Pause className="w-5 h-5 fill-current" />

              </button>



              <button

                aria-label="Forward 30 seconds"

                className="relative w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"

              >

                <RotateCw className="w-5 h-5" />



                <span className="absolute text-[9px] font-bold mt-[2px]">

                  30

                </span>

              </button>

            </div>



            <div className="flex items-center justify-end space-x-4 w-[30%]">

              <div

                className="flex items-center space-x-2 relative"

                onMouseEnter={() =>

                  setShowVolumeSlider(

                    true

                  )

                }

                onMouseLeave={() =>

                  setShowVolumeSlider(

                    false

                  )

                }

              >

                <button

                  onClick={

                    toggleMute

                  }

                  aria-label={

                    isMuted

                      ? 'Unmute'

                      : 'Mute'

                  }

                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"

                >

                  <VolumeIcon />

                </button>



                <div

                  className={

                    'flex items-center transition-all duration-200 overflow-hidden ' +

                    (showVolumeSlider

                      ? 'w-24 opacity-100'

                      : 'w-0 opacity-0')

                  }

                >

                  <input

                    type="range"

                    min="0"

                    max="1"

                    step="0.01"

                    value={

                      isMuted

                        ? 0

                        : volume

                    }

                    onChange={

                      handleVolumeChange

                    }

                    aria-label="Volume"

                    className="w-full h-1 bg-gray-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-orange-500"

                  />



                  <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-400 w-6 text-right">

                    {Math.round(

                      (isMuted

                        ? 0

                        : volume) *

                        10

                    )}

                  </span>

                </div>

              </div>



              <button

                onClick={

                  cyclePlaybackRate

                }

                className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white border border-gray-300 dark:border-white/20 rounded hover:border-black dark:hover:border-white transition-all"

              >

                {

                  playbackRate

                }

                ×

              </button>



              <button

                onClick={() =>

                  setShowSchedule(

                    true

                  )

                }

                aria-label="Open schedule"

                className="p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"

              >

                <List className="w-6 h-6" />

              </button>



              <div className="flex items-center space-x-1.5 px-2">

                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />



                <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">

                  LIVE

                </span>

              </div>

            </div>

          </div>

        </div>

      )}

    </>

  )

}



export default LivePlayerBar
