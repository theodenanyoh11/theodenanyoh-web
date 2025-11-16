import React from 'react'
import Script from 'next/script'

interface HeadScriptProps {
  script: string
}

interface ParsedScript {
  type: 'inline' | 'external' | 'nextjs'
  src?: string
  content?: string
  attributes: Record<string, string | boolean>
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'worker'
}

/**
 * Parses all attributes from an attribute string, including data-* attributes
 */
function parseAttributes(attrString: string): Record<string, string | boolean> {
  const attrs: Record<string, string | boolean> = {}

  if (!attrString.trim()) return attrs

  // Match all attributes including data-* attributes
  // Pattern matches: attribute="value", attribute='value', or attribute (boolean)
  // Supports: data-*, aria-*, and standard attributes
  const attrPattern = /([\w-]+)\s*=\s*["']([^"']+)["']|([\w-]+)(?=\s|$|>)/g
  let match

  while ((match = attrPattern.exec(attrString)) !== null) {
    if (match[1] && match[2]) {
      // Attribute with value (e.g., src="...", data-franklin-site-key="...")
      attrs[match[1]] = match[2]
    } else if (match[3]) {
      // Boolean attribute (e.g., async, defer)
      attrs[match[3]] = true
    }
  }

  return attrs
}

/**
 * Parses a script string and returns an array of parsed scripts
 */
function parseScripts(script: string): ParsedScript[] {
  const trimmedScript = script.trim()
  if (!trimmedScript) return []

  const scripts: ParsedScript[] = []

  // Parse Next.js Script components (handles both self-closing and with content)
  const nextScriptSelfClosingRegex = /<Script\s*([^>]*)\s*\/>/gis
  const nextScriptWithContentRegex = /<Script\s*([^>]*)>(.*?)<\/Script>/gis
  
  let match
  while ((match = nextScriptSelfClosingRegex.exec(trimmedScript)) !== null) {
    const attributes = match[1] || ''
    const attrs = parseAttributes(attributes)
    const strategy = attrs.strategy as ParsedScript['strategy']
    const src = attrs.src as string | undefined

    scripts.push({
      type: 'nextjs',
      src,
      attributes: attrs,
      strategy: strategy || 'afterInteractive',
    })
  }

  while ((match = nextScriptWithContentRegex.exec(trimmedScript)) !== null) {
    const attributes = match[1] || ''
    const content = match[2] || ''
    const attrs = parseAttributes(attributes)
    const strategy = attrs.strategy as ParsedScript['strategy']
    const src = attrs.src as string | undefined

    scripts.push({
      type: 'nextjs',
      src,
      content: content.trim() || undefined,
      attributes: attrs,
      strategy: strategy || 'afterInteractive',
    })
  }

  // Parse regular script tags (only if we haven't found Next.js Script components, or in addition to them)
  const scriptTagRegex = /<script\s*([^>]*)>(.*?)<\/script>/gis
  while ((match = scriptTagRegex.exec(trimmedScript)) !== null) {
    const attributes = match[1] || ''
    const content = match[2] || ''
    const attrs = parseAttributes(attributes)
    const hasSrc = !!attrs.src

    if (hasSrc) {
      scripts.push({
        type: 'external',
        src: attrs.src as string,
        attributes: attrs,
      })
    } else if (content.trim()) {
      scripts.push({
        type: 'inline',
        content: content.trim(),
        attributes: attrs,
      })
    }
  }

  // If no script tags found, treat as inline script content
  if (scripts.length === 0) {
    scripts.push({
      type: 'inline',
      content: trimmedScript,
      attributes: {},
    })
  }

  return scripts
}

/**
 * Determines if a script should be rendered in the body (true) or head (false)
 */
function shouldRenderInBody(parsed: ParsedScript): boolean {
  // Next.js Script components should always be in the body
  if (parsed.type === 'nextjs') {
    return true
  }
  // Regular script tags can be in the head
  return false
}

/**
 * Renders a single parsed script
 */
function renderScript(parsed: ParsedScript, index: number, location: 'head' | 'body') {
  const key = `${location}-script-${index}`

  // Next.js Script component (always in body, but beforeInteractive goes to head)
  if (parsed.type === 'nextjs') {
    const { src, content, attributes, strategy } = parsed
    const scriptProps: Record<string, unknown> = {
      id: key,
      strategy: strategy || 'afterInteractive',
      ...attributes,
    }

    // Remove strategy from attributes since we pass it separately
    delete scriptProps.strategy

    if (src) {
      scriptProps.src = src
    }

    if (content) {
      scriptProps.dangerouslySetInnerHTML = { __html: content }
    }

    return <Script key={key} {...scriptProps} />
  }

  // For head scripts, use Next.js Script with beforeInteractive to avoid sync script warnings
  if (location === 'head') {
    // External script (with src) - use Next.js Script
    if (parsed.type === 'external' && parsed.src) {
      const { src, attributes } = parsed
      return (
        <Script
          key={key}
          src={src}
          strategy="beforeInteractive"
          {...attributes}
        />
      )
    }

    // Inline script - use Next.js Script
    if (parsed.type === 'inline' && parsed.content) {
      const { content, attributes } = parsed
      return (
        <Script
          key={key}
          strategy="beforeInteractive"
          {...attributes}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )
    }
  } else {
    // For body scripts, use regular script tags (these are less common)
    // External script (with src)
    if (parsed.type === 'external' && parsed.src) {
      const { src, attributes } = parsed
      // eslint-disable-next-line react/no-danger, @next/next/no-sync-scripts
      return <script key={key} src={src} {...attributes} />
    }

    // Inline script
    if (parsed.type === 'inline' && parsed.content) {
      const { content, attributes } = parsed
      // eslint-disable-next-line react/no-danger, @next/next/no-sync-scripts
      return <script key={key} {...attributes} dangerouslySetInnerHTML={{ __html: content }} />
    }
  }

  return null
}

/**
 * Component to inject custom script tags in the head.
 * Handles:
 * - Multiple script tags
 * - Next.js Script component syntax (rendered in body)
 * - Inline scripts and external scripts
 * - Data attributes (data-*)
 * 
 * Users can paste:
 * - Multiple script tags: <script>...</script><script src="..."></script>
 * - Next.js Script: <Script src="..." strategy="afterInteractive" />
 * - Just script content: console.log('hello');
 */
export function HeadScript({ script }: HeadScriptProps) {
  if (!script) return null

  const parsedScripts = parseScripts(script)
  const headScripts = parsedScripts.filter((s) => !shouldRenderInBody(s))

  return (
    <>
      {headScripts.map((parsed, index) => renderScript(parsed, index, 'head'))}
    </>
  )
}

/**
 * Component to inject custom script tags in the body.
 * This is used for Next.js Script components that need to be in the body.
 */
export function BodyScript({ script }: HeadScriptProps) {
  if (!script) return null

  const parsedScripts = parseScripts(script)
  const bodyScripts = parsedScripts.filter((s) => shouldRenderInBody(s))

  return (
    <>
      {bodyScripts.map((parsed, index) => renderScript(parsed, index, 'body'))}
    </>
  )
}
