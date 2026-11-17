/** Turns a share link into something that can be embedded. */
export const toEmbed = (
  url: string,
  autoplay = true,
): { kind: 'iframe' | 'video'; src: string } => {
  const query = autoplay ? '?autoplay=1' : ''
  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/,
  )
  if (youtube) {
    return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${youtube[1]}${query}` }
  }
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}${query}` }
  const loom = url.match(/loom\.com\/(?:share|embed)\/([\w-]+)/)
  if (loom) return { kind: 'iframe', src: `https://www.loom.com/embed/${loom[1]}${query}` }
  return { kind: 'video', src: url }
}
