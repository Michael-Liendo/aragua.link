import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("users", (table) => {
		table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
		table.boolean("is_active").notNullable().defaultTo(true);
		table.string("first_name").notNullable();
		table.string("last_name").notNullable();
		table.string("email").notNullable().unique();
		table.string("phone").nullable();
		table.string("password").notNullable();
		table.timestamp("last_login_at").nullable();
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable("users");
}
