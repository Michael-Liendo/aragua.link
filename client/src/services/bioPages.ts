import {
	BioPageSchema,
	type IBioPage,
	type IBioPageForCreate,
	type IBioPageForUpdate,
	type IBioPageLink,
	type IBioPageLinkForCreate,
	type IBioPageLinkForUpdate,
	type IPublicBioPage,
	type ISResponse,
	PublicBioPageSchema,
} from "@aragualink/shared";
import fetch from "../utils/fetch";

export class BioPagesService {
	/**
	 * Get user's bio page
	 */
	static async get(): Promise<IBioPage | null> {
		const request = await fetch("/bio/my");
		const response: ISResponse<IBioPage | null> = await request.json();

		if (!response.success) {
			throw new Error("Error fetching bio page");
		}

		return response.data ? BioPageSchema.parse(response.data) : null;
	}

	/**
	 * Create bio page
	 */
	static async create(bioPage: IBioPageForCreate): Promise<IBioPage> {
		const request = await fetch("/bio/my", {
			method: "POST",
			body: JSON.stringify(bioPage),
		});

		const response: ISResponse<IBioPage> = await request.json();

		if (!response.success) {
			throw new Error(response.message || "Error creating bio page");
		}

		return BioPageSchema.parse(response.data);
	}

	/**
	 * Update bio page
	 */
	static async update(bioPage: IBioPageForUpdate): Promise<IBioPage> {
		const request = await fetch("/bio/my", {
			method: "PUT",
			body: JSON.stringify(bioPage),
		});

		const response: ISResponse<IBioPage> = await request.json();

		if (!response.success) {
			throw new Error(response.message || "Error updating bio page");
		}

		return BioPageSchema.parse(response.data);
	}

	/**
	 * Delete bio page
	 */
	static async delete(): Promise<boolean> {
		const request = await fetch("/bio/my", {
			method: "DELETE",
		});

		if (request.status !== 204) {
			throw new Error("Error deleting bio page");
		}

		return true;
	}

	/**
	 * Get links in bio page
	 */
	static async getLinks(): Promise<IBioPageLink[]> {
		const request = await fetch("/bio/my/links");
		const response: ISResponse<IBioPageLink[]> = await request.json();

		if (!response.success) {
			throw new Error("Error fetching bio page links");
		}

		return response.data;
	}

	/**
	 * Add link to bio page
	 */
	static async addLink(link: IBioPageLinkForCreate): Promise<IBioPageLink> {
		const request = await fetch("/bio/my/links", {
			method: "POST",
			body: JSON.stringify(link),
		});

		const response: ISResponse<IBioPageLink> = await request.json();

		if (!response.success) {
			throw new Error(response.message || "Error adding link to bio page");
		}

		return response.data;
	}

	/**
	 * Update link in bio page
	 */
	static async updateLink(
		id: string,
		link: IBioPageLinkForUpdate,
	): Promise<IBioPageLink> {
		const request = await fetch(`/bio/my/links/${id}`, {
			method: "PUT",
			body: JSON.stringify(link),
		});

		const response: ISResponse<IBioPageLink> = await request.json();

		if (!response.success) {
			throw new Error(response.message || "Error updating link in bio page");
		}

		return response.data;
	}

	/**
	 * Remove link from bio page
	 */
	static async removeLink(id: string): Promise<boolean> {
		const request = await fetch(`/bio/my/links/${id}`, {
			method: "DELETE",
		});

		if (request.status !== 204) {
			throw new Error("Error removing link from bio page");
		}

		return true;
	}

	/**
	 * Reorder links in bio page
	 */
	static async reorderLinks(
		linkOrders: Array<{ id: string; position: number }>,
	): Promise<boolean> {
		const request = await fetch("/bio/my/links/reorder", {
			method: "POST",
			body: JSON.stringify({ linkOrders }),
		});

		const response: ISResponse<{ message: string }> = await request.json();

		if (!response.success) {
			throw new Error("Error reordering links");
		}

		return true;
	}

	/**
	 * Get public bio page by slug
	 */
	static async getPublicBioPage(slug: string): Promise<IPublicBioPage> {
		const request = await fetch(`/bio/${slug}`);
		const response: ISResponse<IPublicBioPage> = await request.json();

		if (!response.success) {
			throw new Error("Bio page not found");
		}

		return PublicBioPageSchema.parse(response.data);
	}
}
