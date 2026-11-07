import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const SITE = 'https://praisefmradio.vercel.app'
const page = {
  path: 'sports',
  title: 'Praise FM Sports - NFL, NBA & MLB Scores and News',
  description:
    'Follow NFL, NBA and MLB scores, results and news with Praise FM Sports. Daily sports updates from the Praise FM Global Worship Network.',
  image: `${SITE}/og-sports.jpg`, // ajuste para o nome real do arquivo
}

const url = `${SITE}/${page.path}`
let html = readFileSync('dist/index.html', 'utf8')

const replace = (regex, value, label) => {
  const next = html.replace(regex, value)
  if (next === html) console.warn(`[sports-html] nada trocado: ${label}`)
  html = next
}

const meta = (attr, name, value) =>
  replace(
    new RegExp(`<meta\\s+${attr}="${name}"\\s+content="[^"]*"\\s*/?>`, 'g'),
    `<meta ${attr}="${name}" content="${value}" />`,
    name,
  )

replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`, 'title')
meta('name', 'description', page.description)
meta('property', 'og:url', url)
meta('property', 'og:title', page.title)
meta('property', 'og:description', page.description)
meta('property', 'og:image', page.image)
meta('name', 'twitter:url', url)
meta('name', 'twitter:title', page.title)
meta('name', 'twitter:description', page.description)
meta('name', 'twitter:image', page.image)

// hreflang apontando para a própria página
replace(/(hreflang="[^"]*"\s+href=")[^"]*(")/g, `$1${url}$2`, 'hreflang')

// canonical e tamanho da imagem
html = html.replace(
  '</head>',
  `    <link rel="canonical" href="${url}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
  </head>`,
)

mkdirSync(`dist/${page.path}`, { recursive: true })
writeFileSync(`dist/${page.path}/index.html`, html)
console.log(`[sports-html] dist/${page.path}/index.html gerado`)