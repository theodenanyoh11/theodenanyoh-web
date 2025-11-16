import React from 'react'

interface HeadScriptProps {
  script: string
}

/**
 * Component to inject custom script tags into the head.
 * Handles both inline scripts and external scripts with src attributes.
 * Users can paste either:
 * - A full script tag: <script src="..."></script> or <script>...</script>
 * - Just script content: console.log('hello');
 */
export function HeadScript({ script }: HeadScriptProps) {
  if (!script) return null

  const trimmedScript = script.trim()

  // Check if it's a full script tag (handles multiline scripts)
  const scriptTagMatch = trimmedScript.match(/^<script\s*([^>]*)>(.*?)<\/script>$/is)

  if (scriptTagMatch && scriptTagMatch.length >= 3) {
    const attributes = scriptTagMatch[1] || ''
    const content = scriptTagMatch[2] || ''
    const hasSrc = /src\s*=\s*["']/.test(attributes)

    // If it has a src attribute (external script)
    if (hasSrc) {
      // Extract all attributes
      const attrs: Record<string, string | boolean> = {}
      
      // Extract src
      const srcMatch = attributes.match(/src\s*=\s*["']([^"']+)["']/)
      if (srcMatch && srcMatch[1]) attrs.src = srcMatch[1]

      // Extract other attributes
      if (/\basync\b/.test(attributes)) attrs.async = true
      if (/\bdefer\b/.test(attributes)) attrs.defer = true

      // Get all other attributes (type, crossorigin, etc.)
      const otherAttrs = attributes.match(/(\w+)\s*=\s*["']([^"']+)["']/g) || []
      otherAttrs.forEach((attr) => {
        const match = attr.match(/(\w+)\s*=\s*["']([^"']+)["']/)
        if (match && match[1] && match[2] && match[1] !== 'src') {
          attrs[match[1]] = match[2]
        }
      })

      // Create script tag with attributes
      // eslint-disable-next-line react/no-danger
      return <script {...attrs} />
    }

    // Inline script - no src attribute, has content
    const inlineContent = content.trim()
    if (inlineContent) {
      // Extract attributes like type, etc.
      const attrs: Record<string, string> = {}
      const typeMatch = attributes.match(/type\s*=\s*["']([^"']+)["']/)
      if (typeMatch && typeMatch[1]) attrs.type = typeMatch[1]

      // eslint-disable-next-line react/no-danger
      return <script {...attrs} dangerouslySetInnerHTML={{ __html: inlineContent }} />
    }

    // Empty script tag - ignore
    return null
  }

  // Not a full script tag - treat as inline script content
  // Wrap it in a script tag
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: trimmedScript }} />
}
