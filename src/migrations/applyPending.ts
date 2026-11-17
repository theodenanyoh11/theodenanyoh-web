import { sql } from '@payloadcms/db-postgres'
import { createLocalReq, type Payload } from 'payload'

import * as payload393 from './20261117_090000_payload_3_93'

// Migrations the site applies by itself when it starts in production.
//
// `payload migrate` is not used for this. It would stop at a prompt if the
// database was ever changed by a development push, and it would try to replay
// the 2025 migrations if they were never recorded. Both are possible here.
//
// Only migrations that are additive and safe to run twice belong in this list.
const automatic = [{ name: '20261117_090000_payload_3_93', up: payload393.up }]

// Any fixed number works. It only has to be the same in every instance.
const LOCK_KEY = 20261117

export const applyPendingMigrations = async (payload: Payload): Promise<void> => {
  if (process.env.NODE_ENV !== 'production') return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drizzle = (payload.db as any).drizzle
  const req = await createLocalReq({}, payload)

  for (const migration of automatic) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await drizzle.transaction(async (tx: any) => {
        // Several instances can start at once. The lock lets one of them work
        // while the others wait, then find the migration recorded and skip it.
        await tx.execute(sql`SELECT pg_advisory_xact_lock(${LOCK_KEY})`)

        const recorded = await tx.execute(
          sql`SELECT 1 FROM "payload_migrations" WHERE "name" = ${migration.name} LIMIT 1`,
        )
        if (recorded.rows.length > 0) return

        payload.logger.info(`Applying migration ${migration.name}`)
        await migration.up({ db: tx, payload, req })
        await tx.execute(sql`
          INSERT INTO "payload_migrations" ("name", "batch", "updated_at", "created_at")
          VALUES (
            ${migration.name},
            (SELECT COALESCE(MAX("batch"), 0) + 1 FROM "payload_migrations" WHERE "batch" > 0),
            now(),
            now()
          )
        `)
        payload.logger.info(`Applied migration ${migration.name}`)
      })
    } catch (err) {
      // Stop at the first failure so later migrations never run out of order.
      // The transaction has rolled back, and the next start will try again.
      payload.logger.error({ err, msg: `Migration ${migration.name} failed and was rolled back` })
      return
    }
  }
}
