import type {
	IBioPage,
	IBioPageForCreate,
	IBioPageForUpdate,
	IBioPageLink,
	IBioPageLinkForCreate,
	IBioPageLinkForUpdate,
	IPublicBioPage,
} from "@aragualink/shared";
import { StatusCodes } from "http-status-codes";
import Repository from "../repository";
import { BadRequestError, NotFoundError } from "../utils/errorHandler";

export default class BioPageService {
	// Bio Pages
	static async getByUserId(userId: string): Promise<IBioPage | null> {
		const bioPage = await Repository.bioPages.getByUserId(userId);
		return bioPage || null;
	}

	static async create(
		userId: string,
		bioPageDTO: IBioPageForCreate,
	): Promise<IBioPage> {
		// Check if user already has a bio page
		const existingBioPage = await Repository.bioPages.getByUserId(userId);
		if (existingBioPage) {
			throw new BadRequestError("El usuario ya tiene una página bio");
		}

		// Validate slug is unique among bio pages
		const slugExists = await Repository.bioPages.checkSlugExists(
			bioPageDTO.slug,
		);
		if (slugExists) {
			throw new BadRequestError(
				"Este slug ya está en uso por otra página bio. Por favor elige otro.",
			);
		}

		// Validate slug doesn't conflict with existing link short codes
		const linkWithSameCode = await Repository.links.getLinkByShortCode(
			bioPageDTO.slug,
		);
		if (linkWithSameCode) {
			throw new BadRequestError(
				"Este slug ya está en uso por un enlace existente. Por favor elige otro.",
			);
		}

		return await Repository.bioPages.create(userId, bioPageDTO);
	}

	static async update(
		userId: string,
		bioPageDTO: IBioPageForUpdate,
	): Promise<IBioPage> {
		const bioPage = await Repository.bioPages.getByUserId(userId);
		if (!bioPage) {
			throw new NotFoundError("Página bio no encontrada");
		}

		const updated = await Repository.bioPages.update(bioPage.id, bioPageDTO);
		if (!updated) {
			throw new NotFoundError("Página bio no encontrada");
		}

		return updated;
	}

	static async delete(userId: string): Promise<void> {
		const bioPage = await Repository.bioPages.getByUserId(userId);
		if (!bioPage) {
			throw new NotFoundError("Página bio no encontrada");
		}

		const deleted = await Repository.bioPages.delete(bioPage.id);
		if (!deleted) {
			throw new NotFoundError("Página bio no encontrada");
		}
	}

	// Bio Page Links
	static async getLinks(userId: string): Promise<Array<IBioPageLink>> {
		const bioPage = await Repository.bioPages.getByUserId(userId);
		if (!bioPage) {
			throw new NotFoundError("Página bio no encontrada");
		}

		return await Repository.bioPages.getLinksForBioPage(bioPage.id);
	}

	static async addLink(
		userId: string,
		linkDTO: IBioPageLinkForCreate,
	): Promise<IBioPageLink> {
		const bioPage = await Repository.bioPages.getByUserId(userId);
		if (!bioPage) {
			throw new NotFoundError("Página bio no encontrada");
		}

		// Verify the link exists and belongs to the user
		const link = await Repository.links.getLinkById(linkDTO.link_id);
		if (!link || link.user_id !== userId) {
			throw new NotFoundError("Enlace no encontrado");
		}

		// Check if link is already in bio page
		const alreadyExists = await Repository.bioPages.checkLinkInBioPage(
			bioPage.id,
			linkDTO.link_id,
		);
		if (alreadyExists) {
			throw new BadRequestError("Este enlace ya está en la página bio");
		}

		return await Repository.bioPages.addLink(bioPage.id, linkDTO);
	}

	static async updateLink(
		userId: string,
		linkId: string,
		linkDTO: IBioPageLinkForUpdate,
	): Promise<IBioPageLink> {
		const bioPage = await Repository.bioPages.getByUserId(userId);
		if (!bioPage) {
			throw new NotFoundError("Página bio no encontrada");
		}

		const updated = await Repository.bioPages.updateLink(linkId, linkDTO);
		if (!updated) {
			throw new NotFoundError("Enlace no encontrado en la página bio");
		}

		return updated;
	}

	static async removeLink(userId: string, linkId: string): Promise<void> {
		const bioPage = await Repository.bioPages.getByUserId(userId);
		if (!bioPage) {
			throw new NotFoundError("Página bio no encontrada");
		}

		const deleted = await Repository.bioPages.removeLink(linkId);
		if (!deleted) {
			throw new NotFoundError("Enlace no encontrado en la página bio");
		}
	}

	static async reorderLinks(
		userId: string,
		linkOrders: Array<{ id: string; position: number }>,
	): Promise<void> {
		const bioPage = await Repository.bioPages.getByUserId(userId);
		if (!bioPage) {
			throw new NotFoundError("Página bio no encontrada");
		}

		await Repository.bioPages.reorderLinks(bioPage.id, linkOrders);
	}

	// Public
	static async getPublicBioPage(slug: string): Promise<IPublicBioPage> {
		const bioPage = await Repository.bioPages.getPublicBioPage(slug);
		if (!bioPage) {
			throw {
				statusCode: StatusCodes.NOT_FOUND,
				message: "Página bio no encontrada",
			};
		}

		return bioPage;
	}
}
