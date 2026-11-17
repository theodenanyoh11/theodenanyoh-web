import { revalidatePath } from 'next/cache'
import type { RequestContext } from 'payload'

// Products appear on the homepage, the shop and their own pages.
export const revalidateProducts = ({ context }: { context: RequestContext }): void => {
  if (context.disableRevalidate) return
  revalidatePath('/')
  revalidatePath('/shop')
  revalidatePath('/products/[slug]', 'page')
}
