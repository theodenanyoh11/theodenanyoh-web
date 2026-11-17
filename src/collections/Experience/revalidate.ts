import { revalidatePath } from 'next/cache'
import type { RequestContext } from 'payload'

export const revalidateExperience = ({ context }: { context: RequestContext }): void => {
  if (context.disableRevalidate) return
  revalidatePath('/experience')
}
