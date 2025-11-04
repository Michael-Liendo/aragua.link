import * as dotenv from "dotenv";

dotenv.config();

const {
	NODE_ENV = "development",
	PORT = 3000,
	HOST = "127.0.0.1",
	SALT_ROUNDS = 10,
	CORS_ORIGIN = "http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost,capacitor://localhost",
	JWT_PRIVATE_KEY = "aragua",
	POSTGRES_HOST = "0.0.0.0",
	POSTGRES_PASSWORD = "password",
	POSTGRES_USER = "user",
	POSTGRES_DB = "server-app",
	DEV_POSTGRES_HOST = "0.0.0.0",
	DEV_POSTGRES_PASSWORD = "password",
	DEV_POSTGRES_USER = "user",
	DEV_POSTGRES_DB = "server-app",
} = process.env;

export const EnvConfig = () => {
	return {
		NODE_ENV,
		HOST,
		PORT,
		SALT_ROUNDS,
		CORS_ORIGIN,
		JWT_PRIVATE_KEY,
		POSTGRES_HOST,
		POSTGRES_PASSWORD,
		POSTGRES_USER,
		POSTGRES_DB,
		DEV_POSTGRES_HOST,
		DEV_POSTGRES_PASSWORD,
		DEV_POSTGRES_USER,
		DEV_POSTGRES_DB,
	};
};
