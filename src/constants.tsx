import { Program } from './types'

export const COLORS = {
  ACCENT: '#ff6600',
  DARK: '#1a1a1a',
  GRAY: '#f3f4f6'
}

const IMAGES = {
  DANIEL_BROOKS: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1783132371/daniel-brooks_qbfdgc.webp',
  RACHAEL_HARRIS: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1782158974/rachael-harris_pwfg0z.webp',
  MICHAEL_RAY: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1783132371/michael-ray_n6ylzs.webp',
  STANCY_CAMPBELL: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1782157748/stancy-campbell_zwsout.webp',
  NICK_CUSACK: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1792222383/weekend-morning_f0j3oi.webp',
  SUNDAY_SERVICE: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1781538248/sunday-service_xmj94r.webp',
  BIBLEPROJECT_PODCAST: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1792277020/BP_Show_Podcast_Icon_yg8olu.webp',
  LEXXA: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1791853506/praise-fm-rock_mz54t4.webp',
  AVA_BROOKS: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1782158973/ava-brooks_oyzibl.webp',
  SCOTT_TURNER: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1783132371/scott-turner_cwy1bc.webp',
  KENNY_AJ: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1791853506/praise-fm-flow_ef6gqq.webp',
  SARAH_JORDAN: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1782158974/sarah-jordan_tfnxpp.webp',
  WORSHIP: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1791176390/worship_tlnp2j.webp',
  ARTHUR_BRADFORD: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1793619657/arthur_bradford_zzmftc.webp',
  CHILL_MIX: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1785297426/chill-mix_btpsnv.webp',
  CLUB_MIX: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1785297861/club-mix_ritmbx.webp',
  BLACK_SOUL: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1786538567/praisefmblacksoul_hvo3ah.webp',
  WORLD_BEATS: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1787173961/world-beats_vhjv2i.webp',
  INSOMNIA_CLUB_MIX: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1791176390/insomnia-club-mix_vy81u6.webp',
  COUNTRY: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1791176495/praise-fm-country_wi9hll.webp',
  ROCK_MIX: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1791176390/praise-fm-rock-mix_fstjt3.webp',
  CLASSICS_MIX: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1791177197/praise-fm-classics-mix_s6iy8j.webp',
  NON_STOP: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1791176390/non-stop_frjo6q.webp',
  SPORTS_HIGHLIGHTS: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1794110192/praise-fm-sports_bpddb7.webp',
}

const weekday: Program[] = [
  {
    id: 'midnight-grace',
    title: 'Midnight Grace',
    host: 'Daniel Brooks',
    startTime: '00:00',
    endTime: '06:00',
    description: 'Overnight worship.',
    image: IMAGES.DANIEL_BROOKS
  },
  {
    id: 'worship-morning',
    title: 'Worship',
    host: 'Praise FM',
    startTime: '06:00',
    endTime: '07:00',
    description: 'start your day with worship.',
    image: IMAGES.WORSHIP
  },
  {
    id: 'Morning Show',
    title: 'Morning Show',
    host: 'Stancy Campbell',
    startTime: '07:00',
    endTime: '12:00',
    description: 'Music, encouragement and inspiration.',
    image: IMAGES.STANCY_CAMPBELL
  },
  {
    id: 'worship-midday',
    title: 'Worship',
    host: 'Praise FM',
    startTime: '12:00',
    endTime: '13:00',
    description: 'A midday hour of worship.',
    image: IMAGES.WORSHIP
  },
  {
    id: 'sports-highlights',
    title: 'Praise FM Sports Highlights',
    host: 'Praise FM',
    startTime: '13:00',
    endTime: '14:00',
    description: 'The top sports stories and highlights from last night.',
    image: IMAGES.SPORTS_HIGHLIGHTS
  },
  {
    id: 'midday-grace',
    title: 'Midday Grace',
    host: 'Michael Ray',
    startTime: '14:00',
    endTime: '16:00',
    description: 'Faith and encouragement through music.',
    image: IMAGES.MICHAEL_RAY
  },
  {
    id: 'praise-fm-flow',
    title: 'Praise FM Flow',
    host: 'DJ Kenny AJ',
    startTime: '16:00',
    endTime: '17:00',
    description: 'Hip Hop and energy.',
    image: IMAGES.KENNY_AJ
  },
  {
    id: 'future-artists',
    title: 'Future Artists',
    host: 'Sarah Jordan',
    startTime: '17:00',
    endTime: '18:00',
    description: 'Discover the future sound of Christian music.',
    image: IMAGES.SARAH_JORDAN
  },
  {
    id: 'carpool',
    title: 'Praise FM Carpool',
    host: 'Rachael Harris',
    startTime: '18:00',
    endTime: '20:00',
    description: 'Your company on the way home.',
    image: IMAGES.RACHAEL_HARRIS
  },
  {
    id: 'praise-fm-rock',
    title: 'Praise FM Rock',
    host: 'Lexxa',
    startTime: '20:00',
    endTime: '21:00',
    description: 'Christian rock and Faith.',
    image: IMAGES.LEXXA
  },
  {
    id: 'praise-fm-classics',
    title: 'Classics',
    host: 'Scott Turner',
    startTime: '21:00',
    endTime: '22:00',
    description: 'Timeless Christian favorites.',
    image: IMAGES.SCOTT_TURNER
  },
  {
    id: 'praise-fm-chill',
    title: 'Praise FM Chill',
    host: 'Ava Brooks',
    startTime: '22:00',
    endTime: '00:00',
    description: 'Ava Brooks brings the best of the Chill',
    image: IMAGES.AVA_BROOKS
  }
]

// Grade específica de Quarta-feira (Wednesday)
const wednesday: Program[] = weekday.map((program) => {
  if (program.id === 'praise-fm-classics') {
    return {
      id: 'praise-fm-golden-hymns',
      title: 'Golden Hymns',
      host: 'Arthur Bradford',
      startTime: '21:00',
      endTime: '22:00',
      description: 'Traditional hymns and classic faith songs.',
      image: IMAGES.ARTHUR_BRADFORD
    }
  }

  return program
})

// Grade específica de Sábado (Saturday)
const saturday: Program[] = [
  {
    id: 'saturday-insomnia-club-mix',
    title: 'Insomnia Club Mix',
    host: 'Praise FM',
    startTime: '00:00',
    endTime: '06:00',
    description: 'An overnight mix of uplifting sounds.',
    image: IMAGES.INSOMNIA_CLUB_MIX
  },
  {
    id: 'saturday-worship-morning',
    title: 'Worship',
    host: 'Praise FM',
    startTime: '06:00',
    endTime: '07:00',
    description: 'Start your Saturday with worship.',
    image: IMAGES.WORSHIP
  },
  {
    id: 'saturday-weekend-morning',
    title: 'Weekend Morning',
    host: 'Nick Cusack',
    startTime: '07:00',
    endTime: '12:00',
    description: 'A fresh weekend morning with music, faith and inspiration.',
    image: IMAGES.NICK_CUSACK
  },
  {
    id: 'saturday-worship-midday',
    title: 'Worship',
    host: 'Praise FM',
    startTime: '12:00',
    endTime: '13:00',
    description: 'A midday hour of worship.',
    image: IMAGES.WORSHIP
  },
  {
    id: 'saturday-sports-highlights',
    title: 'Praise FM Sports Highlights',
    host: 'Praise FM',
    startTime: '13:00',
    endTime: '14:00',
    description: 'The top sports stories and highlights from last night.',
    image: IMAGES.SPORTS_HIGHLIGHTS
  },
  {
    id: 'saturday-midday-grace',
    title: 'Midday Grace',
    host: 'Michael Ray',
    startTime: '14:00',
    endTime: '16:00',
    description: 'Faith and encouragement through music.',
    image: IMAGES.MICHAEL_RAY
  },
  {
    id: 'maia-millers-club-mix',
    title: "Maia Miller's Club Mix",
    host: 'DJ Maia Miller',
    startTime: '16:00',
    endTime: '17:00',
    description: 'Kick off your Saturday with high-energy Christian music.',
    image: IMAGES.CLUB_MIX
  },
  {
    id: 'praise-fm-black-soul',
    title: 'Praise FM Black Soul',
    host: 'Jeff Olumbe',
    startTime: '17:00',
    endTime: '18:00',
    description: 'Celebrating Black gospel and soul music.',
    image: IMAGES.BLACK_SOUL
  },
  {
    id: 'saturday-praise-fm-country',
    title: 'Praise FM Country',
    host: 'Luke Dawson',
    startTime: '18:00',
    endTime: '19:00',
    description: 'Country gospel and songs of faith.',
    image: IMAGES.COUNTRY
  },
  {
    id: 'saturday-praise-fm-rock-mix',
    title: 'Praise FM Rock Mix',
    host: 'Praise FM',
    startTime: '19:00',
    endTime: '20:00',
    description: 'A nonstop mix of Christian rock.',
    image: IMAGES.ROCK_MIX
  },
  {
    id: 'saturday-praise-fm-classics-mix',
    title: 'Praise FM Classics Mix',
    host: 'Praise FM',
    startTime: '20:00',
    endTime: '21:00',
    description: 'Timeless Christian classics in the mix.',
    image: IMAGES.CLASSICS_MIX
  },
  {
    id: 'saturday-praise-fm-non-stop',
    title: 'Praise FM Non Stop',
    host: 'Praise FM',
    startTime: '21:00',
    endTime: '22:00',
    description: 'One hour of nonstop Christian music.',
    image: IMAGES.NON_STOP
  },
  {
    id: 'saturday-praise-fm-chill-mix',
    title: 'Praise FM Chill Mix',
    host: 'Praise FM',
    startTime: '22:00',
    endTime: '00:00',
    description: 'A smooth two-hour mix to close out Saturday.',
    image: IMAGES.CHILL_MIX
  }
]

const sunday: Program[] = [
  {
    id: 'sunday-insomnia-club-mix',
    title: 'Insomnia Club Mix',
    host: 'Praise FM',
    startTime: '00:00',
    endTime: '06:00',
    description: 'Overnight Christian music in the mix.',
    image: IMAGES.INSOMNIA_CLUB_MIX
  },
  {
    id: 'sunday-worship-morning',
    title: 'Worship',
    host: 'Praise FM',
    startTime: '06:00',
    endTime: '07:00',
    description: 'Start your Sunday with worship.',
    image: IMAGES.WORSHIP
  },
  {
    id: 'sunday-weekend-morning',
    title: 'Weekend Morning',
    host: 'Nick Cusack',
    startTime: '07:00',
    endTime: '12:00',
    description: 'A fresh weekend morning with music, faith and inspiration.',
    image: IMAGES.NICK_CUSACK
  },
  {
    id: 'sunday-worship-midday',
    title: 'Worship',
    host: 'Praise FM',
    startTime: '12:00',
    endTime: '13:00',
    description: 'A midday hour of worship.',
    image: IMAGES.WORSHIP
  },
  {
    id: 'sunday-sports-highlights',
    title: 'Praise FM Sports Highlights',
    host: 'Praise FM',
    startTime: '13:00',
    endTime: '14:00',
    description: 'The top sports stories and highlights from last night.',
    image: IMAGES.SPORTS_HIGHLIGHTS
  },
  {
    id: 'sunday-midday-grace',
    title: 'Midday Grace',
    host: 'Michael Ray',
    startTime: '14:00',
    endTime: '16:00',
    description: 'Faith and encouragement through music.',
    image: IMAGES.MICHAEL_RAY
  },
  {
    id: 'sunday-praise-fm-country',
    title: 'Praise FM Country',
    host: 'Luke Dawson',
    startTime: '16:00',
    endTime: '17:00',
    description: 'Country gospel and songs of faith.',
    image: IMAGES.COUNTRY
  },
  {
    id: 'sunday-praise-fm-non-stop',
    title: 'Praise FM Non Stop',
    host: 'Praise FM',
    startTime: '17:00',
    endTime: '18:00',
    description: 'One hour of nonstop Christian music.',
    image: IMAGES.NON_STOP
  },
  {
    id: 'sunday-worship-evening',
    title: 'Worship',
    host: 'Praise FM',
    startTime: '18:00',
    endTime: '19:00',
    description: 'Evening worship and peaceful Christian music.',
    image: IMAGES.WORSHIP
  },
  {
    id: 'bible project-podcast',
    title: 'Bible Project Podcast',
    host: 'Bible Project',
    startTime: '19:00',
    endTime: '20:00',
    description: 'Explore the Bible’s story and themes with Bible Project.',
    image: IMAGES.BIBLEPROJECT_PODCAST
  },
  {
    id: 'sunday-service',
    title: 'Sunday Service',
    host: 'Guest',
    startTime: '20:00',
    endTime: '21:00',
    description: 'A message of faith, hope and encouragement.',
    image: IMAGES.SUNDAY_SERVICE
  },
  {
    id: 'sunday-praise-fm-classics-mix',
    title: 'Praise FM Classics Mix',
    host: 'Praise FM',
    startTime: '21:00',
    endTime: '22:00',
    description: 'Timeless Christian classics in the mix.',
    image: IMAGES.CLASSICS_MIX
  },
  {
    id: 'sunday-praise-fm-chill-mix',
    title: 'Praise FM Chill Mix',
    host: 'Praise FM',
    startTime: '22:00',
    endTime: '00:00',
    description: 'A smooth mix to close out Sunday.',
    image: IMAGES.CHILL_MIX
  }
]

export const SCHEDULES: Record<number, Program[]> = {
  0: sunday,    // Domingo (Sports Highlights 13h, Midday Grace 14h, Country 16h, Non Stop 17h, Classics Mix 21h, Chill Mix 22h)
  1: weekday,   // Segunda (Sports Highlights 13h, Midday Grace 14h)
  2: weekday,   // Terça
  3: wednesday, // Quarta (Golden Hymns)
  4: weekday,   // Quinta
  5: weekday,   // Sexta
  6: saturday   // Sábado (Sports Highlights 13h, Midday Grace 14h, Country 18h, Rock Mix 19h, Classics Mix 20h, Non Stop 21h, Chill Mix 22h)
}