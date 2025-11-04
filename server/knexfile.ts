const dotenv = require("dotenv");

dotenv.config();

const knexConfig = {
	development: {
		client: "pg",
		connection: {
			host: process.env.DEV_POSTGRES_HOST,
			user: process.env.DEV_POSTGRES_USER,
			password: process.env.DEV_POSTGRES_PASSWORD,
			database: process.env.DEV_POSTGRES_DB,
			ssl: { rejectUnauthorized: false },
		},
		pool: { min: 0, max: 10 },
	},
	production: {
		client: "pg",
		connection: {
			host: process.env.POSTGRES_HOST,
			user: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			ssl: { rejectUnauthorized: false },
		},
		pool: {
			min: 2,
			max: 10,
		},
	},
};

// @ts-expect-error
module.exports = knexConfig[process.env.NODE_ENV || "development"];
