import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("click_events", (table) => {
		table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
		table
			.uuid("link_id")
			.notNullable()
			.references("id")
			.inTable("links")
			.onDelete("CASCADE");
		table
			.uuid("user_id")
			.notNullable()
			.references("id")
			.inTable("users")
			.onDelete("CASCADE");

		// Request information
		table.string("ip_address", 45).nullable(); // IPv6 max length
		table.text("user_agent").nullable();

		// Geolocation information
		table.string("country", 100).nullable();
		table.string("country_code", 2).nullable();
		table.string("region", 100).nullable();
		table.string("city", 100).nullable();
		table.decimal("latitude", 10, 7).nullable();
		table.decimal("longitude", 10, 7).nullable();
		table.string("timezone", 50).nullable();

		// Device information
		table
			.enum("device_type", ["mobile", "tablet", "desktop", "bot", "unknown"])
			.nullable();
		table.string("browser", 50).nullable();
		table.string("browser_version", 20).nullable();
		table.string("os", 50).nullable();
		table.string("os_version", 20).nullable();

		// Referrer information
		table.text("referrer").nullable();
		table.string("referrer_domain", 255).nullable();

		// UTM Parameters
		table.string("utm_source", 255).nullable();
		table.string("utm_medium", 255).nullable();
		table.string("utm_campaign", 255).nullable();
		table.string("utm_term", 255).nullable();
		table.string("utm_content", 255).nullable();

		// Additional information
		table.string("language", 10).nullable();
		table.boolean("is_unique").notNullable().defaultTo(true);

		table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

		// Indexes for analytics queries
		table.index("link_id");
		table.index("user_id");
		table.index("created_at");
		table.index(["link_id", "created_at"]);
		table.index(["user_id", "created_at"]);
		table.index("country_code");
		table.index("device_type");
		table.index("referrer_domain");
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable("click_events");
}
