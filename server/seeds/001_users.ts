import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await knex("users").del();

	const passwordHash = bcrypt.hashSync("123456", 10);

	const users = Array.from({ length: 25 }).map(() => ({
		id: faker.string.uuid(),
		first_name: faker.person.firstName(),
		last_name: faker.person.lastName(),
		email: faker.internet.email().toLowerCase(),
		phone: faker.phone.number(),
		password: passwordHash,
	}));

	await knex("users").insert(users);
}
