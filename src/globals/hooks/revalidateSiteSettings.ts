import { revalidatePath, revalidateTag } from 'next/cache'
import type { GlobalAfterChangeHook } from 'payload'

// Site Settings feed the hero, logo strip, footer, About, Experience and
// Contact, so a change refreshes every page.
export const revalidateSiteSettings: GlobalAfterChangeHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidateTag('global_site-settings', { expire: 0 })
    revalidatePath('/', 'layout')
  }
  return doc
}
