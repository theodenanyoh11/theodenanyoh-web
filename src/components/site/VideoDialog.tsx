'use client'

import React, { useRef, useState } from 'react'

import { toEmbed } from './videoEmbedUrl'

/**
 * Wraps a trigger. Clicking it opens the video in a native dialog.
 * The player is mounted only while the dialog is open, so nothing loads before then.
 */
export const VideoDialog: React.FC<{
  url: string
  title: string
  className?: string
  children: React.ReactNode
}> = ({ url, title, className, children }) => {
  const ref = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const embed = toEmbed(url)

  return (
    <>
      <button
        className={className}
        onClick={() => {
          setOpen(true)
          ref.current?.showModal()
        }}
        type="button"
      >
        {children}
      </button>
      <dialog
        aria-label={title}
        className="w-[min(1100px,calc(100vw-32px))] overflow-visible rounded-tile bg-ink p-0 backdrop:bg-ink/80"
        onClick={(event) => {
          if (event.target === ref.current) ref.current?.close()
        }}
        onClose={() => setOpen(false)}
        ref={ref}
      >
        <div className="aspect-video w-full overflow-hidden rounded-tile">
          {open &&
            (embed.kind === 'iframe' ? (
              <iframe
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="size-full"
                src={embed.src}
                title={title}
              />
            ) : (
              <video autoPlay className="size-full" controls src={embed.src} />
            ))}
        </div>
        <form className="absolute -top-12 right-0" method="dialog">
          <button className="rounded-pill bg-paper px-[18px] py-[10px] text-[15px] font-semibold leading-[18px] text-ink">
            Close
          </button>
        </form>
      </dialog>
    </>
  )
}
