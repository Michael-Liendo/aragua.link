import type { IFindAllDatabase, IPaginationRequest } from "@aragualink/shared";
import { InternalServerError } from "../utils/errorHandler";
import { hashPassword } from "../utils/password";
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

	static async getDashboardMetrics(): Promise<{
		users: { total: number; free: number; pro: number; enterprise: number };
		links: { total: number; active: number; inactive: number };
		clicks: {
			total: number;
			today: number;
			thisWeek: number;
			thisMonth: number;
		};
		bioPages: { total: number };
	}> {
		// Get user counts by plan
		const usersTotal = await database("users").count("id as count").first();
		const usersFree = await database("users")
			.where({ plan: "FREE" })
			.count("id as count")
			.first();
		const usersPro = await database("users")
			.where({ plan: "PRO" })
			.count("id as count")
			.first();
		const usersEnterprise = await database("users")
			.where({ plan: "ENTERPRISE" })
			.count("id as count")
			.first();

		// Get link counts
		const linksTotal = await database("links").count("id as count").first();
		const linksActive = await database("links")
			.where({ is_active: true })
			.count("id as count")
			.first();
		const linksInactive = await database("links")
			.where({ is_active: false })
			.count("id as count")
			.first();

		// Get click counts
		const clicksTotal = await database("link_analytics")
			.count("id as count")
			.first();
		const clicksToday = await database("link_analytics")
			.where("created_at", ">=", database.raw("CURRENT_DATE"))
			.count("id as count")
			.first();
		const clicksThisWeek = await database("link_analytics")
			.where(
				"created_at",
				">=",
				database.raw("CURRENT_DATE - INTERVAL '7 days'"),
			)
			.count("id as count")
			.first();
		const clicksThisMonth = await database("link_analytics")
			.where(
				"created_at",
				">=",
				database.raw("CURRENT_DATE - INTERVAL '30 days'"),
			)
			.count("id as count")
			.first();

		// Get bio pages count
		const bioPagesTotal = await database("bio_pages")
			.count("id as count")
			.first();

		return {
			users: {
				total: Number(usersTotal?.count || 0),
				free: Number(usersFree?.count || 0),
				pro: Number(usersPro?.count || 0),
				enterprise: Number(usersEnterprise?.count || 0),
			},
			links: {
				total: Number(linksTotal?.count || 0),
				active: Number(linksActive?.count || 0),
				inactive: Number(linksInactive?.count || 0),
			},
			clicks: {
				total: Number(clicksTotal?.count || 0),
				today: Number(clicksToday?.count || 0),
				thisWeek: Number(clicksThisWeek?.count || 0),
				thisMonth: Number(clicksThisMonth?.count || 0),
			},
			bioPages: {
				total: Number(bioPagesTotal?.count || 0),
			},
		};
	}

	static async changeUserPassword(
		userId: string,
		newPassword: string,
	): Promise<void> {
		const hashedPassword = await hashPassword(newPassword);

		const updated = await database("users")
			.where({ id: userId })
			.update({ password: hashedPassword });

		if (!updated) {
			throw new InternalServerError("Error updating user password");
		}
	}

	static async updateUserRole(userId: string, plan: string): Promise<void> {
		const updated = await database("users")
			.where({ id: userId })
			.update({ plan });

		if (!updated) {
			throw new InternalServerError("Error updating user role");
		}
	}
}
