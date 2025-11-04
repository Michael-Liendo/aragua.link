import type { ILink, ILinkForCreate, ILinkForUpdate } from "@aragualink/shared";
import { InternalServerError, NotFoundError } from "../utils/errorHandler";
import database from "./database";

export class Links {
	/**
	 * getLinkById - get a link by ID
	 * @param id string
	 * @returns ILink | undefined
	 */
	static async getLinkById(id: string): Promise<ILink | undefined> {
		const [link] = await database<ILink>("links").where({ id });
		return link;
	}

	/**
	 * getLinkByShortCode - get a link by short code
	 * @param shortCode string
	 * @returns ILink | undefined
	 */
	static async getLinkByShortCode(
		shortCode: string,
	): Promise<ILink | undefined> {
		const [link] = await database<ILink>("links").where({
			short_code: shortCode,
		});
		return link;
	}

	/**
	 * getLinksByUserId - get all links for a user
	 * @param userId string
	 * @returns ILink[]
	 */
	static async getLinksByUserId(userId: string): Promise<ILink[]> {
		const links = await database<ILink>("links")
			.where({ user_id: userId })
			.orderBy("position", "asc");
		return links;
	}

	/**
	 * getActiveLinksByUserId - get all active links for a user
	 * @param userId string
	 * @returns ILink[]
	 */
	static async getActiveLinksByUserId(userId: string): Promise<ILink[]> {
		const links = await database<ILink>("links")
			.where({ user_id: userId, is_active: true })
			.orderBy("position", "asc");
		return links;
	}

	/**
	 * createLink - creates a link and returns it
	 * @param userId string
	 * @param linkDTO ILinkForCreate
	 * @returns ILink
	 */
	static async createLink(
		userId: string,
		linkDTO: ILinkForCreate,
	): Promise<ILink> {
		// Get the next position for this user
		const [{ max_position }] = await database("links")
			.where({ user_id: userId })
			.max("position as max_position");

		const nextPosition = (max_position ?? -1) + 1;

		const [link] = await database<ILink>("links")
			.insert({
				...linkDTO,
				user_id: userId,
				position: linkDTO.position ?? nextPosition,
			})
			.returning("*");

		if (!link) throw new InternalServerError("Error creating link");
		return link;
	}

	/**
	 * updateLink - updates a link's information
	 * @param id string
	 * @param userId string - to ensure user owns the link
	 * @param linkUpdates ILinkForUpdate
	 * @returns ILink
	 */
	static async updateLink(
		id: string,
		userId: string,
		linkUpdates: ILinkForUpdate,
	): Promise<ILink> {
		const [link] = await database<ILink>("links")
			.where({ id, user_id: userId })
			.update({ ...linkUpdates, updated_at: new Date() })
			.returning("*");

		if (!link) {
			throw new NotFoundError("Link not found or you don't have permission");
		}

		return link;
	}

	/**
	 * deleteLink - deletes a link
	 * @param id string
	 * @param userId string - to ensure user owns the link
	 * @returns boolean
	 */
	static async deleteLink(id: string, userId: string): Promise<boolean> {
		const rowsDeleted = await database("links")
			.where({ id, user_id: userId })
			.del();

		if (rowsDeleted === 0) {
			throw new NotFoundError("Link not found or you don't have permission");
		}

		return true;
	}

	/**
	 * incrementClicks - increment click count for a link
	 * @param id string
	 * @returns boolean
	 */
	static async incrementClicks(id: string): Promise<boolean> {
		const rowsUpdated = await database("links")
			.where({ id })
			.increment("clicks", 1);

		if (rowsUpdated === 0) {
			throw new NotFoundError("Link not found");
		}

		return true;
	}

	/**
	 * reorderLinks - update positions for multiple links
	 * @param userId string
	 * @param linkPositions Array<{id: string, position: number}>
	 * @returns boolean
	 */
	static async reorderLinks(
		userId: string,
		linkPositions: Array<{ id: string; position: number }>,
	): Promise<boolean> {
		try {
			await database.transaction(async (trx) => {
				for (const { id, position } of linkPositions) {
					await trx("links")
						.where({ id, user_id: userId })
						.update({ position, updated_at: new Date() });
				}
			});
			return true;
		} catch (error) {
			throw new InternalServerError(`Error reordering links: ${error}`);
		}
	}

	/**
	 * checkShortCodeExists - check if a short code is already taken
	 * @param shortCode string
	 * @param excludeLinkId string | undefined - exclude this link ID from check (for updates)
	 * @returns boolean
	 */
	static async checkShortCodeExists(
		shortCode: string,
		excludeLinkId?: string,
	): Promise<boolean> {
		let query = database("links").where({ short_code: shortCode });

		if (excludeLinkId) {
			query = query.whereNot({ id: excludeLinkId });
		}

		const [result] = await query.count("* as count");
		return Number(result?.count) > 0;
	}
}
