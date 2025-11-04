import type { ILink, ILinkForCreate, ILinkForUpdate } from "@aragualink/shared";
import Repository from "../repository";
import { BadRequestError, NotFoundError } from "../utils/errorHandler";

export default class LinksService {
	/**
	 * Get a link by ID
	 */
	static async getById(linkId: string, userId: string): Promise<ILink> {
		const link = await Repository.links.getLinkById(linkId);
		if (!link) {
			throw new NotFoundError("Link not found");
		}
		// Ensure user owns the link
		if (link.user_id !== userId) {
			throw new BadRequestError(
				"You don't have permission to access this link",
			);
		}
		return link;
	}

	/**
	 * Get a link by short code (public access)
	 */
	static async getByShortCode(shortCode: string): Promise<ILink> {
		const link = await Repository.links.getLinkByShortCode(shortCode);
		if (!link) {
			throw new NotFoundError("Link not found");
		}
		if (!link.is_active) {
			throw new NotFoundError("Link is not active");
		}
		return link;
	}

	/**
	 * Get all links for a user
	 */
	static async getAllByUserId(userId: string): Promise<ILink[]> {
		const links = await Repository.links.getLinksByUserId(userId);
		return links;
	}

	/**
	 * Get active links for a user (public profile)
	 */
	static async getActiveByUserId(userId: string): Promise<ILink[]> {
		const links = await Repository.links.getActiveLinksByUserId(userId);
		return links;
	}

	/**
	 * Create a new link
	 */
	static async create(userId: string, linkDTO: ILinkForCreate): Promise<ILink> {
		// Validate short code is unique among links
		const shortCodeExists = await Repository.links.checkShortCodeExists(
			linkDTO.short_code,
		);
		if (shortCodeExists) {
			throw new BadRequestError(
				"Este código corto ya está en uso por otro enlace. Por favor elige otro.",
			);
		}

		// Validate short code doesn't conflict with existing bio page slugs
		const bioPageWithSameSlug = await Repository.bioPages.getBySlug(
			linkDTO.short_code,
		);
		if (bioPageWithSameSlug) {
			throw new BadRequestError(
				"Este código corto ya está en uso por una página bio. Por favor elige otro.",
			);
		}

		// Validate URL format
		try {
			new URL(linkDTO.url);
		} catch {
			throw new BadRequestError("Invalid URL format");
		}

		const link = await Repository.links.createLink(userId, linkDTO);
		return link;
	}

	/**
	 * Update a link
	 */
	static async update(
		linkId: string,
		userId: string,
		linkUpdates: ILinkForUpdate,
	): Promise<ILink> {
		// Ensure link exists and user owns it
		const existing = await Repository.links.getLinkById(linkId);
		if (!existing) {
			throw new NotFoundError("Link not found");
		}
		if (existing.user_id !== userId) {
			throw new BadRequestError(
				"You don't have permission to update this link",
			);
		}

		// Validate URL if updating
		if (linkUpdates.url) {
			try {
				new URL(linkUpdates.url);
			} catch {
				throw new BadRequestError("Invalid URL format");
			}
		}

		const link = await Repository.links.updateLink(linkId, userId, linkUpdates);
		return link;
	}

	/**
	 * Delete a link
	 */
	static async delete(linkId: string, userId: string): Promise<boolean> {
		// Ensure link exists and user owns it
		const existing = await Repository.links.getLinkById(linkId);
		if (!existing) {
			throw new NotFoundError("Link not found");
		}
		if (existing.user_id !== userId) {
			throw new BadRequestError(
				"You don't have permission to delete this link",
			);
		}

		const deleted = await Repository.links.deleteLink(linkId, userId);
		return deleted;
	}

	/**
	 * Track a click on a link (public)
	 */
	static async trackClick(shortCode: string): Promise<ILink> {
		const link = await LinksService.getByShortCode(shortCode);
		await Repository.links.incrementClicks(link.id);
		return link;
	}

	/**
	 * Reorder links
	 */
	static async reorder(
		userId: string,
		linkPositions: Array<{ id: string; position: number }>,
	): Promise<boolean> {
		// Validate all links belong to user
		for (const { id } of linkPositions) {
			const link = await Repository.links.getLinkById(id);
			if (!link || link.user_id !== userId) {
				throw new BadRequestError(
					`Link ${id} not found or you don't have permission`,
				);
			}
		}

		const reordered = await Repository.links.reorderLinks(
			userId,
			linkPositions,
		);
		return reordered;
	}
}
