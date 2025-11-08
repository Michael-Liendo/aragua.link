import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	// Create bio_pages table
	await knex.schema.createTable("bio_pages", (table) => {
		table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
		table
			.uuid("user_id")
			.notNullable()
			.unique()
			.references("id")
			.inTable("users")
			.onDelete("CASCADE");
		table.string("slug", 50).notNullable().unique();
		table.string("display_name", 100).notNullable();
		table.text("bio").nullable();
		table.text("avatar_url").nullable();
		table.string("theme", 20).notNullable().defaultTo("light");
		table.boolean("is_active").notNullable().defaultTo(true);
		table.timestamps(true, true);

		// Indexes for better performance
		table.index("user_id");
		table.index("slug");
	});

	// Create bio_page_links table (junction table for bio pages and links)
	await knex.schema.createTable("bio_page_links", (table) => {
		table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
		table
			.uuid("bio_page_id")
			.notNullable()
			.references("id")
			.inTable("bio_pages")
			.onDelete("CASCADE");
		table
			.uuid("link_id")
			.notNullable()
			.references("id")
			.inTable("links")
			.onDelete("CASCADE");
		table.integer("position").notNullable().defaultTo(0);
		table.boolean("is_visible").notNullable().defaultTo(true);
		table.timestamps(true, true);

		// Indexes for better performance
		table.index("bio_page_id");
		table.index("link_id");
		table.index(["bio_page_id", "position"]);

		// Ensure a link can only be added once to a bio page
		table.unique(["bio_page_id", "link_id"]);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable("bio_page_links");
	await knex.schema.dropTable("bio_pages");
}
