import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	// Cambiar special_type de ENUM a VARCHAR para mayor flexibilidad
	await knex.schema.alterTable("links", (table) => {
		// Eliminar la columna ENUM existente
		table.dropColumn("special_type");
	});

	await knex.schema.alterTable("links", (table) => {
		// Agregar como VARCHAR(50) para permitir cualquier tipo sin depender de migraciones
		table.string("special_type", 50).nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable("links", (table) => {
		table.dropColumn("special_type");
	});

	await knex.schema.alterTable("links", (table) => {
		// Restaurar el ENUM original
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
	});
}
