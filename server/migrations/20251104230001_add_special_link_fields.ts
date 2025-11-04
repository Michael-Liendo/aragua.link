import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable("links", (table) => {
		table
			.enum("special_type", [
				"whatsapp_group",
				"whatsapp_chat",
				"telegram_group",
				"telegram_channel",
				"discord_invite",
				"custom",
			])
			.nullable();
		table.string("special_code", 500).nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable("links", (table) => {
		table.dropColumn("special_type");
		table.dropColumn("special_code");
	});
}
