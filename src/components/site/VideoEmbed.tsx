import React from 'react'

import { toEmbed } from './videoEmbedUrl'

/** Inline player for a video post. */
export const VideoEmbed: React.FC<{ url: string; title: string }> = ({ url, title }) => {
  const embed = toEmbed(url, false)
  return embed.kind === 'iframe' ? (
    <iframe
      allow="fullscreen; picture-in-picture"
      allowFullScreen
      className="size-full"
      loading="lazy"
      src={embed.src}
      title={title}
    />
  ) : (
    <video className="size-full" controls preload="metadata" src={embed.src} />
  )
}
