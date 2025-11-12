import {
	type IBulkLinkResult,
	type ILink,
	type ILinkForCreate,
	type ILinkForUpdate,
	type ISResponse,
	LinkSchema,
} from "@aragualink/shared";
import fetch from "../utils/fetch";

export class LinksService {
	/**
	 * Get all links for the authenticated user
	 */
	static async getAll(): Promise<ILink[]> {
		const request = await fetch("/links/my");
		const response: ISResponse<ILink[]> = await request.json();

		if (!response.success) {
			throw new Error("Error fetching links");
		}

		return LinkSchema.array().parse(response.data);
	}

	/**
	 * Get a single link by ID
	 */
	static async getOne(id: string): Promise<ILink> {
		const request = await fetch(`/links/my/${id}`);
		const response: ISResponse<ILink> = await request.json();

		if (!response.success) {
			throw new Error("Error fetching link");
		}

		return LinkSchema.parse(response.data);
	}

	/**
	 * Create a new link
	 */
	static async create(link: ILinkForCreate): Promise<ILink> {
		const request = await fetch("/links/my", {
			method: "POST",
			body: JSON.stringify(link),
		});

		const response: ISResponse<ILink> = await request.json();

		if (!response.success) {
			throw new Error(response.message || "Error creating link");
		}

		return LinkSchema.parse(response.data);
	}

	/**
	 * Update a link
	 */
	static async update(id: string, link: ILinkForUpdate): Promise<ILink> {
		const request = await fetch(`/links/my/${id}`, {
			method: "PUT",
			body: JSON.stringify(link),
		});

		const response: ISResponse<ILink> = await request.json();

		if (!response.success) {
			throw new Error(response.message || "Error updating link");
		}

		return LinkSchema.parse(response.data);
	}

	/**
	 * Delete a link
	 */
	static async delete(id: string): Promise<boolean> {
		const request = await fetch(`/links/my/${id}`, {
			method: "DELETE",
		});

		if (request.status !== 204) {
			throw new Error("Error deleting link");
		}

		return true;
	}

	/**
	 * Reorder links
	 */
	static async reorder(
		links: Array<{ id: string; position: number }>,
	): Promise<boolean> {
		const request = await fetch("/links/my/reorder", {
			method: "POST",
			body: JSON.stringify({ links }),
		});

		const response: ISResponse<boolean> = await request.json();

		if (!response.success) {
			throw new Error("Error reordering links");
		}

		return true;
	}

	/**
	 * Get public profile with active links
	 */
	static async getPublicProfile(userId: string): Promise<{
		user: {
			id: string;
			first_name: string;
			last_name: string;
			plan: string;
		};
		links: ILink[];
	}> {
		const request = await fetch(`/links/profile/${userId}`);
		const response = await request.json();

		if (!response.success) {
			throw new Error("Error fetching public profile");
		}

		return response.data;
	}

	/**
	 * Create multiple links at once
	 */
	static async createBulk(links: ILinkForCreate[]): Promise<IBulkLinkResult> {
		const request = await fetch("/links/my/bulk", {
			method: "POST",
			body: JSON.stringify({ links }),
		});

		const response: ISResponse<IBulkLinkResult> = await request.json();

		if (!response.success) {
			throw new Error(response.message || "Error creating bulk links");
		}

		return response.data;
	}
}
