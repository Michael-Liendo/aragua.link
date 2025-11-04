import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("links", (table) => {
		table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
		table
			.uuid("user_id")
			.notNullable()
			.references("id")
			.inTable("users")
			.onDelete("CASCADE");
		table.string("title", 255).notNullable();
		table.text("url").notNullable();
		table.string("short_code", 50).notNullable().unique();
		table.text("description").nullable();
		table.boolean("is_active").notNullable().defaultTo(true);
		table.integer("clicks").notNullable().defaultTo(0);
		table.integer("position").notNullable().defaultTo(0);
		table.timestamps(true, true);

		// Indexes for better performance
		table.index("user_id");
		table.index("short_code");
		table.index(["user_id", "position"]);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable("links");
}
