import type { IFindAllDatabase, IPaginationRequest } from "@aragualink/shared";
import { InternalServerError } from "../utils/errorHandler";
import database from "./database";

export class AdminRepository {
	static async findAll(
		master_name: string,
		pagination: IPaginationRequest,
	): Promise<IFindAllDatabase<Record<string, unknown>>> {
		const limit = pagination.limit ?? 100;
		const offset = (pagination.page ?? 0) * limit;

		const totalResult = await database(master_name).count("id").first();

		const total = totalResult?.count ? Number(totalResult.count) : 0;

		const data = await database(master_name)
			.orderBy("created_at", "desc")
			.limit(limit)
			.offset(offset);

		return {
			data,
			count: total,
		};
	}

	static async findOne(
		master_name: string,
		master_id: string,
	): Promise<Record<string, unknown> | undefined> {
		const item = await database(master_name).where({ id: master_id }).first();

		return item;
	}

	static async create<T extends Record<string, unknown>>(
		master_name: string,
		payload: T,
	): Promise<T> {
		const [created] = await database(master_name)
			.insert(payload)
			.returning("*");

		if (!created)
			throw new InternalServerError(`Error creating ${master_name}`);

		return created;
	}

	static async update<T extends Record<string, unknown>>(
		master_name: string,
		id: string,
		payload: Partial<T>,
	): Promise<T> {
		const updatedCount = await database(master_name)
			.where({ id })
			.update(payload);

		if (!updatedCount)
			throw new InternalServerError(`Error updating ${master_name}`);

		const updated = await database(master_name).where({ id }).first();

		if (!updated)
			throw new InternalServerError(`Error fetching updated ${master_name}`);

		return updated;
	}

	static async remove(master_name: string, id: string): Promise<void> {
		await database(master_name).where({ id }).delete();
	}
}
