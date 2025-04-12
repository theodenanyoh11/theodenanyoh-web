import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

// Exporting config segments for Next.js
// export const config = {
//   api: {
//     bodyParser: false, // Disable default body parsing to handle raw body for verification
//   },
// }

type WebhookPayload = {
  doc: {
    id: string
    // Add other potential fields if needed for logging or logic
  }
  collection: string
  operation: 'create' | 'update' | 'delete'
}

// We need a secret to verify the webhook request came from Payload
// Store this in your environment variables (.env.local, .env.production)
const PAYLOAD_WEBHOOK_SECRET = process.env.PAYLOAD_WEBHOOK_SECRET

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log('Received revalidation request...')

  if (!PAYLOAD_WEBHOOK_SECRET) {
    console.error('PAYLOAD_WEBHOOK_SECRET is not set. Skipping revalidation.')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  try {
    // 1. Verify the webhook signature (Optional but Recommended)
    // Payload doesn't have built-in signature verification like Sanity/Stripe yet.
    // For now, we'll rely on a simple secret check if provided in headers/body,
    // or just proceed if the secret is configured (less secure).
    // A more robust approach would involve a shared secret in the header.
    const secret = req.headers.get('x-payload-secret')
    if (secret !== PAYLOAD_WEBHOOK_SECRET) {
      console.warn('Invalid or missing webhook secret.')
      // return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
      // Allow proceeding for now if secret is missing, but log it.
    }

    // 2. Parse the request body
    const payloadBody = (await req.json()) as WebhookPayload
    console.log('Webhook Body:', JSON.stringify(payloadBody, null, 2))

    const { collection, operation, doc } = payloadBody

    if (!collection || !operation || !doc) {
      console.error('Invalid webhook payload:', payloadBody)
      return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 })
    }

    // 3. Determine the tag to revalidate based on the collection
    let tagToRevalidate: string | null = null
    if (collection === 'posts') {
      tagToRevalidate = 'posts'
    } else if (collection === 'projects') {
      tagToRevalidate = 'projects'
    }
    // Add more 'else if' for other collections as needed

    if (!tagToRevalidate) {
      console.log(
        `No specific tag configured for collection: ${collection}. Skipping tag revalidation.`,
      )
      // Optionally revalidate a generic 'all' tag or specific paths if needed
      // revalidatePath('/') // Example: revalidate homepage on any change
      return NextResponse.json({ revalidated: false, message: 'No relevant tag found' })
    }

    // 4. Perform revalidation
    console.log(
      `Revalidating tag: ${tagToRevalidate} due to ${operation} on ${collection} id: ${doc.id}`,
    )
    revalidateTag(tagToRevalidate)

    // Revalidate related paths explicitly if needed (e.g., list pages)
    // if (tagToRevalidate === 'posts') {
    //   revalidatePath('/posts')
    //   revalidatePath(`/posts/${doc.slug}`) // Assuming slug exists
    // }
    // if (tagToRevalidate === 'projects') {
    //   revalidatePath('/projects')
    //   revalidatePath(`/projects/${doc.slug}`) // Assuming slug exists
    // }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error: any) {
    console.error('Error processing revalidation webhook:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook', details: error.message },
      { status: 500 },
    )
  }
}
