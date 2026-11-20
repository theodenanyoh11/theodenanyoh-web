import { APIError, type CollectionAfterErrorHook, type CollectionBeforeValidateHook } from 'payload'

const spamMessage = 'The spam check did not pass. Please try again, or book a call.'

// Abort the operation before persistence and the plugin's afterChange email hook.
class HoneypotSubmission extends APIError {
  constructor() {
    super('Submission received.', 200)
  }
}

export const protectFormSubmission: CollectionBeforeValidateHook = async ({
  data,
  operation,
  req,
}) => {
  if (
    operation !== 'create' ||
    !['REST', 'GraphQL'].includes(req.payloadAPI) ||
    req.user?.collection === req.payload.config.admin.user
  ) {
    return data
  }

  if (data?.honeypot) throw new HoneypotSubmission()

  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    if (process.env.NODE_ENV === 'development') {
      req.payload.logger.warn(
        'TURNSTILE_SECRET_KEY is unset. Allowing form submission in development.',
      )
      return data
    }
    throw new APIError(spamMessage, 400)
  }

  const token = data?.turnstileToken
  if (typeof token !== 'string' || !token.trim() || token.length > 2048) {
    throw new APIError(spamMessage, 400)
  }

  let valid = false
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(10_000),
      cache: 'no-store',
    })
    const result: { success?: boolean } = await response.json()
    valid = response.ok && result.success === true
  } catch {
    // A verification outage must not turn into a bypass or expose service details.
  }
  if (!valid) throw new APIError(spamMessage, 400)
  return data
}

export const acknowledgeHoneypot: CollectionAfterErrorHook = ({ error }) => {
  if (error instanceof HoneypotSubmission) {
    return { response: { message: 'Submission received.' }, status: 201 }
  }
}
