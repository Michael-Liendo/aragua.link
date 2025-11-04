import type { IUser, IUserForRegister } from "@aragualink/shared";
import { InternalServerError } from "../utils/errorHandler";
import database from "./database";

export class Users {
	/**
	 * getUserByEmail - get a user with the email
	 * @param id string
	 * @returns string IUser
	 */
	static async getUserByEmail(email: string): Promise<IUser | undefined> {
		const [user] = await database<IUser>("users").where({ email });
		return user;
	}

	/**
	 *  getUserByID - get a user with the ID
	 * @param id string
	 * @returns string IUser
	 */
	static async getUserByID(id: string): Promise<IUser | undefined> {
		const [user] = await database<IUser>("users").where({ id });

		return user;
	}

	/**
	 *  createUser - creates a user and returns the id
	 * @param userDTO IUserForRegister
	 * @returns string id
	 */
	static async createUser(userDTO: IUserForRegister): Promise<IUser> {
		const [user] = await database<IUser>("users")
			.insert(userDTO)
			.returning("*");
		if (!user) throw new InternalServerError("Error creating user");
		return user;
	}

	/**
	 *  updateUser - updates a user's information
	 * @param id string
	 * @param userUpdates Partial<IUser> - fields to update
	 * @returns boolean - true if the update was successful
	 */
	static async updateUser(
		id: string,
		userUpdates: Partial<IUser>,
	): Promise<boolean> {
		try {
			const rowsUpdated = await database("users")
				.where({ id })
				.update({ ...userUpdates, updated_at: new Date() });

			if (rowsUpdated === 0) {
				throw new Error(`User with id ${id} not found`);
			}

			return true;
		} catch (error) {
			throw new InternalServerError(`Error updating user: ${error}`);
		}
	}

	static async deleteUser(id: string): Promise<boolean> {
		try {
			const rowsDeleted = await database("users").where({ id }).del();
			if (rowsDeleted === 0) {
				throw new Error(`User with id ${id} not found`);
			}
			return true;
		} catch (error) {
			throw new InternalServerError(`Error deleting user: ${error}`);
		}
	}
}
