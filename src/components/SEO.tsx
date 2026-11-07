
import { useEffect } from 'react'

interface SEOProps {
  title: string
  description: string
  url?: string
  image?: string
  jsonLd?: Record<string, unknown>
  noIndex?: boolean
}

const SITE_URL = 'https://praisefmradio.vercel.app'
const DEFAULT_IMAGE = `${SITE_URL}/icon-512.png`

function getCanonicalUrl(url?: string) {
  const parsed = new URL(url || window.location.pathname, SITE_URL)

  // Remove parâmetros e fragmentos da URL canônica.
  parsed.search = ''
  parsed.hash = ''

  // Mantém a barra apenas na página inicial.
  if (parsed.pathname !== '/') {
    parsed.pathname = parsed.pathname.replace(/\/+$/, '')
  }

  return parsed.href
}

export default function SEO({
  title,
  description,
  url,
  image,
  jsonLd,
  noIndex = false,
}: SEOProps) {
  useEffect(() => {
    const canonicalUrl = getCanonicalUrl(url)
    const imageUrl = image
      ? new URL(image, SITE_URL).href
      : DEFAULT_IMAGE

    document.title = title

    function setMeta(
      attribute: 'name' | 'property',
      key: string,
      content: string,
    ) {
      let tag = document.head.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${key}"]`,
      )

      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attribute, key)
        document.head.appendChild(tag)
      }

      tag.setAttribute('content', content)
    }

    function setLink(rel: string, href: string) {
      let tag = document.head.querySelector<HTMLLinkElement>(
        `link[rel="${rel}"]`,
      )

      if (!tag) {
        tag = document.createElement('link')
        tag.rel = rel
        document.head.appendChild(tag)
      }

      tag.href = href
    }

    // SEO básico
    setMeta('name', 'description', description)
    setMeta(
      'name',
      'robots',
      noIndex ? 'noindex, nofollow' : 'index, follow',
    )

    // URL canônica
    setLink('canonical', canonicalUrl)

    // Open Graph
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', 'Praise FM USA')
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:image', imageUrl)
    setMeta('property', 'og:image:alt', title)
    setMeta('property', 'og:image:width', '512')
    setMeta('property', 'og:image:height', '512')
    setMeta('property', 'og:locale', 'en_US')

    // Twitter / X
    setMeta('name', 'twitter:card', 'summary')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', imageUrl)

    // Dados estruturados
    const scriptId = 'seo-jsonld'
    let scriptTag = document.getElementById(
      scriptId,
    ) as HTMLScriptElement | null

    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script')
        scriptTag.id = scriptId
        scriptTag.type = 'application/ld+json'
        document.head.appendChild(scriptTag)
      }

      scriptTag.textContent = JSON.stringify(jsonLd)
    } else {
      scriptTag?.remove()
    }
  }, [title, description, url, image, jsonLd, noIndex])

  return null
}
