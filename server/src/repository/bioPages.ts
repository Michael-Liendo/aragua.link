import type {
	IBioPage,
	IBioPageForCreate,
	IBioPageForUpdate,
	IBioPageLink,
	IBioPageLinkForCreate,
	IBioPageLinkForUpdate,
	ILink,
	IPublicBioPage,
} from "@aragualink/shared";
import database from "./database";

export default class BioPageRepository {
	// Bio Pages
	static async getByUserId(userId: string): Promise<IBioPage | undefined> {
		const [bioPage] = await database<IBioPage>("bio_pages").where({
			user_id: userId,
		});
		return bioPage;
	}

	static async getBySlug(slug: string): Promise<IBioPage | undefined> {
		const [bioPage] = await database<IBioPage>("bio_pages").where({ slug });
		return bioPage;
	}

	static async getById(id: string): Promise<IBioPage | undefined> {
		const [bioPage] = await database<IBioPage>("bio_pages").where({ id });
		return bioPage;
	}

	static async create(
		userId: string,
		data: IBioPageForCreate,
	): Promise<IBioPage> {
		const [bioPage] = await database<IBioPage>("bio_pages")
			.insert({
				user_id: userId,
				...data,
			})
			.returning("*");
		return bioPage;
	}

	static async update(
		id: string,
		data: IBioPageForUpdate,
	): Promise<IBioPage | undefined> {
		const [bioPage] = await database<IBioPage>("bio_pages")
			.where({ id })
			.update({
				...data,
				updated_at: database.fn.now(),
			})
			.returning("*");
		return bioPage;
	}

	static async delete(id: string): Promise<boolean> {
		const deleted = await database("bio_pages").where({ id }).del();
		return deleted > 0;
	}

	static async checkSlugExists(
		slug: string,
		excludeBioPageId?: string,
	): Promise<boolean> {
		let query = database("bio_pages").where({ slug });

		if (excludeBioPageId) {
			query = query.whereNot({ id: excludeBioPageId });
		}

		const result = await query.first();
		return !!result;
	}

	// Bio Page Links
	static async getLinksForBioPage(
		bioPageId: string,
	): Promise<Array<IBioPageLink & ILink>> {
		const links = await database("bio_page_links")
			.join("links", "bio_page_links.link_id", "links.id")
			.where({ "bio_page_links.bio_page_id": bioPageId })
			.select(
				"bio_page_links.*",
				"links.title",
				"links.url",
				"links.description",
				"links.short_code",
				"links.is_active",
				"links.clicks",
				"links.special_type",
				"links.special_code",
			)
			.orderBy("bio_page_links.position", "asc");

		return links;
	}

	static async getPublicBioPage(
		slug: string,
	): Promise<IPublicBioPage | undefined> {
		const bioPage = await this.getBySlug(slug);
		if (!bioPage || !bioPage.is_active) {
			return undefined;
		}

		const links = await database("bio_page_links")
			.join("links", "bio_page_links.link_id", "links.id")
			.where({
				"bio_page_links.bio_page_id": bioPage.id,
				"bio_page_links.is_visible": true,
				"links.is_active": true,
			})
			.select(
				"links.id",
				"links.title",
				"links.url",
				"links.description",
				"links.special_type",
				"links.special_code",
			)
			.orderBy("bio_page_links.position", "asc");

		return {
			slug: bioPage.slug,
			display_name: bioPage.display_name,
			bio: bioPage.bio,
			avatar_url: bioPage.avatar_url,
			theme: bioPage.theme,
			links,
		};
	}

	static async addLink(
		bioPageId: string,
		data: IBioPageLinkForCreate,
	): Promise<IBioPageLink> {
		const [link] = await database<IBioPageLink>("bio_page_links")
			.insert({
				bio_page_id: bioPageId,
				...data,
			})
			.returning("*");
		return link;
	}

	static async updateLink(
		id: string,
		data: IBioPageLinkForUpdate,
	): Promise<IBioPageLink | undefined> {
		const [link] = await database<IBioPageLink>("bio_page_links")
			.where({ id })
			.update({
				...data,
				updated_at: database.fn.now(),
			})
			.returning("*");
		return link;
	}

	static async removeLink(id: string): Promise<boolean> {
		const deleted = await database("bio_page_links").where({ id }).del();
		return deleted > 0;
	}

	static async reorderLinks(
		bioPageId: string,
		linkOrders: Array<{ id: string; position: number }>,
	): Promise<void> {
		await database.transaction(async (trx) => {
			for (const { id, position } of linkOrders) {
				await trx("bio_page_links")
					.where({ id, bio_page_id: bioPageId })
					.update({ position, updated_at: database.fn.now() });
			}
		});
	}

	static async checkLinkInBioPage(
		bioPageId: string,
		linkId: string,
	): Promise<boolean> {
		const result = await database("bio_page_links")
			.where({ bio_page_id: bioPageId, link_id: linkId })
			.first();
		return !!result;
	}
}
