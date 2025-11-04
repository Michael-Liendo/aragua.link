import type { IUserForLogin, IUserForRegister } from "@aragualink/shared";
import Services from "../services";
import type { Reply, Request } from "../types";

export async function register(request: Request, reply: Reply) {
	const { first_name, last_name, email, password } =
		request.body as IUserForRegister;

	const register_data = await Services.auth.register({
		first_name,
		last_name,
		email,
		password,
	});

	return reply
		.code(201)
		.send({ success: true, message: "User created", data: register_data });
}

export async function login(request: Request, reply: Reply) {
	const { email, password } = request.body as IUserForLogin;

	const token = await Services.auth.login({
		email,
		password,
	});

	return reply
		.code(201)
		.send({ success: true, message: "User logged", data: token });
}
