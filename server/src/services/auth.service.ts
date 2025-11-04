import type {
	IUser,
	IUserForLogin,
	IUserForRegister,
} from "@aragualink/shared";
import Repository from "../repository";
import { BadRequestError, UnauthorizedError } from "../utils/errorHandler";
import { Jwt } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";

export default class Auth {
	static async login(data: IUserForLogin) {
		const existsUser = await Repository.users.getUserByEmail(data.email);

		if (!existsUser || !existsUser.password) {
			throw new UnauthorizedError("Credenciales inválidas");
		}

		const { password, ...userWithoutPassword } = existsUser as Required<IUser>;

		const isCorrectPassword = await comparePassword(data.password, password);

		if (!isCorrectPassword) {
			throw new UnauthorizedError("Credenciales inválidas");
		}

		const token = await Jwt.createToken({
			id: userWithoutPassword.id,
		});

		return { token };
	}

	static async renewToken(id: string) {
		const user = await Repository.users.getUserByID(id);

		if (!user) {
			throw new UnauthorizedError("Usuario no encontrado");
		}

		const token = await Jwt.createToken({ id: user.id });

		return { token };
	}

	static async register(data: IUserForRegister) {
		const { first_name, last_name, email, password } = data;

		const existsUser = await Repository.users.getUserByEmail(email);

		if (existsUser) {
			throw new BadRequestError("El correo electrónico ya está en uso", {
				code: "EMAIL_ALREADY_EXISTS",
				path: "email",
				message: "El correo electrónico ya está registrado",
			});
		}

		const hashedPassword = await hashPassword(password);

		const userToRegister = {
			first_name,
			last_name,
			email,
			password: hashedPassword,
		};

		const user = await Repository.users.createUser({
			...userToRegister,
		});

		const { token } = await Auth.login({
			email: data.email,
			password: data.password,
		});

		return { user, token };
	}
}
