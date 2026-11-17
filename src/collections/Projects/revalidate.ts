import { revalidatePath } from 'next/cache'
import type { RequestContext } from 'payload'

// Project tiles appear on the homepage, the work index and each case study.
export const revalidateProjects = ({ context }: { context: RequestContext }): void => {
  if (context.disableRevalidate) return
  revalidatePath('/')
  revalidatePath('/projects')
  revalidatePath('/projects/[slug]', 'page')
}
