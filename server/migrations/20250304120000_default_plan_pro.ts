import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.raw(`ALTER TABLE "users" ALTER COLUMN "plan" SET DEFAULT 'PRO'`);
}

export async function down(knex: Knex): Promise<void> {
	await knex.raw(`ALTER TABLE "users" ALTER COLUMN "plan" SET DEFAULT 'FREE'`);
}
