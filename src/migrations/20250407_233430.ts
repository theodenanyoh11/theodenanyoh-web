import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "pages_blocks_product_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_rels" ADD COLUMN "products_id" integer;
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_product_block" ADD CONSTRAINT "pages_blocks_product_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "pages_blocks_product_block_order_idx" ON "pages_blocks_product_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_product_block_parent_id_idx" ON "pages_blocks_product_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_product_block_path_idx" ON "pages_blocks_product_block" USING btree ("_path");
  DO $$ BEGIN
   ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "pages_rels_products_id_idx" ON "pages_rels" USING btree ("products_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_product_block" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_product_block" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_products_fk";
  
  DROP INDEX IF EXISTS "pages_rels_products_id_idx";
  ALTER TABLE "pages_rels" DROP COLUMN IF EXISTS "products_id";`)
}
