import type {
	ISResponse,
	IUser,
	IUserForLogin,
	IUserForRegister,
} from "@aragualink/shared";
import fetch from "../utils/fetch";

export class AuthService {
	static async register(data: IUserForRegister) {
		const request = await fetch("/auth/register", {
			method: "POST",
			body: JSON.stringify(data),
		});

		const response: ISResponse<{
			user: IUser;
			token: string;
		}> = await request.json();

		if (response.success === false) throw new Error("Error registering");

		return response;
	}
	static async login(data: IUserForLogin) {
		const request = await fetch("/auth/login", {
			method: "POST",
			body: JSON.stringify(data),
		});

		const response: ISResponse<{ token: string }> = await request.json();

		if (response.success === false) throw new Error("Error logging in");

		return response;
	}
}
