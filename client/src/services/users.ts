import {
	type IPaginationRequest,
	type ISResponse,
	type IUser,
	type IUserForRegister,
	type IUserForUpdate,
	UserSchema,
} from "@aragualink/shared";
import fetch from "../utils/fetch";

export class UserService {
	static async register(user: IUserForRegister) {
		try {
			const request = await fetch("/auth/register", {
				method: "POST",
				body: JSON.stringify(user),
			});
			const response: ISResponse<IUser> = await request.json();

			return UserSchema.parse(response.data);
		} catch (error) {
			console.error("UserServices", error);
			throw error;
		}
	}
	static async me() {
		const request = await fetch("/users/me");
		if (request.status === 401) {
			throw new Error("Unauthorized");
		}

		const response = await request.json();

		return UserSchema.parse(response.data);
	}

	static async getOne(id: string) {
		const request = await fetch(`/users/${id}`);
		const response: ISResponse<IUser | undefined> = await request.json();
		if (response.success === false) throw new Error("Error fetching user");
		return response.data ? UserSchema.parse(response.data) : undefined;
	}

	static async getByEmail(email: string) {
		const request = await fetch(
			`/users/by-email?email=${encodeURIComponent(email)}`,
		);
		const response: ISResponse<IUser | undefined> = await request.json();
		if (response.success === false)
			throw new Error("Error fetching user by email");
		return response.data ? UserSchema.parse(response.data) : undefined;
	}

	static async find(
		{ username }: { username?: string },
		pagination?: IPaginationRequest,
	) {
		const queryParams = new URLSearchParams();

		if (username) {
			queryParams.append("username", username);
		}

		if (pagination?.page) {
			queryParams.append("page", pagination.page.toString());
		}
		if (pagination?.limit) {
			queryParams.append("limit", pagination.limit.toString());
		}
		const request = await fetch(`/users?${queryParams.toString()}`);

		const response: ISResponse<IUser[]> = await request.json();
		const data = UserSchema.array().parse(response.data);

		return {
			...response,
			data: data,
		};
	}

	static async update(user: IUserForUpdate) {
		try {
			const request = await fetch("/users/update", {
				method: "PUT",
				body: JSON.stringify(user),
			});

			if (request.status === 400) {
				throw new Error("Bad Request");
			}

			const response = await request.json();

			return response.success as boolean;
		} catch (error) {
			console.error("userServices", error);
			throw error;
		}
	}

	static async delete(id: string) {
		const request = await fetch(`/users/${id}`, {
			method: "DELETE",
		});

		if (request.status === 400) {
			throw new Error("Bad Request");
		}
		return true;
	}
}
