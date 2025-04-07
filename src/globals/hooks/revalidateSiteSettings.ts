// import type { AfterChangeHook, PayloadRequest } from 'payload/types'
// import type { SiteSetting } from '../../payload-types'
import { revalidateTag } from 'next/cache'

// Explicitly type parameters as any to satisfy noImplicitAny
export const revalidateSiteSettings = ({ doc, req }: { doc: any; req: any }) => {
  // Check if the request originates from the admin panel API to avoid infinite loops
  if (req?.path?.includes('/api/globals/site-settings')) {
    revalidateTag(`global_site-settings`)
    console.log('Revalidated global_site-settings tag') // Add log for confirmation
  }
  return doc // Return the document to continue the hook chain
}
