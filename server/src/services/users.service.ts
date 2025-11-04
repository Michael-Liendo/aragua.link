import type {
	IUser,
	IUserForRegister,
	IUserForUpdate,
} from "@aragualink/shared";
import Repository from "../repository";
import { BadRequestError, NotFoundError } from "../utils/errorHandler";
import { hashPassword } from "../utils/password";

export default class Users {
	static async getByID(userID: string): Promise<IUser | undefined> {
		const user = await Repository.users.getUserByID(userID);
		if (!user) {
			throw new NotFoundError("User not found");
		}
		return user;
	}

	static async getByEmail(email: string): Promise<IUser> {
		const user = await Repository.users.getUserByEmail(email);
		if (!user) {
			throw new NotFoundError("User not found");
		}
		return user;
	}

	static async create(dto: IUserForRegister): Promise<IUser> {
		// Validate unique email
		const existing = await Repository.users.getUserByEmail(dto.email);
		if (existing) {
			throw new BadRequestError("User email already exists");
		}

		// Hash password if provided
		if (dto.password) {
			dto.password = await hashPassword(dto.password);
		}

		const created = await Repository.users.createUser(dto);
		return created;
	}

	static async update(
		id: string,
		userUpdates: Partial<IUserForUpdate>,
	): Promise<boolean> {
		// Ensure user exists
		const current = await Repository.users.getUserByID(id);
		if (!current) {
			throw new BadRequestError("User not found");
		}

		// Normalize and validate email if updating
		if (userUpdates.email) {
			userUpdates.email = userUpdates.email.trim().toLowerCase();
			const taken = await Repository.users.getUserByEmail(userUpdates.email);
			if (taken && taken.id !== id) {
				throw new BadRequestError("User email already exists");
			}
		}

		// Hash password if updating
		if (userUpdates.password) {
			userUpdates.password = await hashPassword(userUpdates.password);
		}

		const updated = await Repository.users.updateUser(id, userUpdates);
		return updated;
	}

	static async delete(id: string): Promise<boolean> {
		// Ensure user exists before deleting
		const current = await Repository.users.getUserByID(id);
		if (!current) {
			throw new BadRequestError("User not found");
		}
		const deleted = await Repository.users.deleteUser(id);
		return deleted;
	}
}
