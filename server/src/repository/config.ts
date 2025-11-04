import * as dotenv from "dotenv";
import type { Knex } from "knex";
import { EnvConfig } from "../config/env";

dotenv.config();

const knexConfig: { [key: string]: Knex.Config } = {
	development: {
		client: "pg",
		connection: {
			host: EnvConfig().DEV_POSTGRES_HOST,
			user: EnvConfig().DEV_POSTGRES_USER,
			password: EnvConfig().DEV_POSTGRES_PASSWORD,
			database: EnvConfig().DEV_POSTGRES_DB,
			ssl: true,
		},
		pool: { min: 1, max: 10 },
	},
	production: {
		client: "pg",
		connection: {
			host: EnvConfig().POSTGRES_HOST,
			user: EnvConfig().POSTGRES_USER,
			password: EnvConfig().POSTGRES_PASSWORD,
			database: EnvConfig().POSTGRES_DB,
			ssl: { rejectUnauthorized: false },
		},
		pool: {
			min: 1,
			max: 10,
		},
	},
};

export default knexConfig[EnvConfig().NODE_ENV];
