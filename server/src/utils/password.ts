import bcrypt from "bcrypt";
import { EnvConfig } from "../config/env";

export const hashPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(Number(EnvConfig().SALT_ROUNDS));
	const hashedPassword = await bcrypt.hash(password, salt);

	return hashedPassword;
};

export const comparePassword = async (
	password: string,
	hashedPassword: string,
) => {
	const isMatch = await bcrypt.compare(password, hashedPassword);

	return isMatch;
};
