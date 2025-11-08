import { z } from "zod";

// Schema for bio page
export const BioPageSchema = z.object({
	id: z.uuid(),
	user_id: z.uuid(),
	slug: z
		.string()
		.min(3)
		.max(50)
		.regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
	display_name: z.string().min(1).max(100),
	bio: z.string().max(500).nullable().optional(),
	avatar_url: z.string().url().nullable().optional(),
	theme: z.enum(["light", "dark", "gradient"]).default("light"),
	is_active: z.boolean().default(true),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
});

// Schema for creating a bio page
export const BioPageForCreateSchema = BioPageSchema.pick({
	slug: true,
	display_name: true,
	bio: true,
	avatar_url: true,
	theme: true,
	is_active: true,
}).partial({
	bio: true,
	avatar_url: true,
	theme: true,
	is_active: true,
});

// Schema for updating a bio page
export const BioPageForUpdateSchema = BioPageSchema.pick({
	display_name: true,
	bio: true,
	avatar_url: true,
	theme: true,
	is_active: true,
}).partial();

// Bio page link item (link that appears on the bio page)
export const BioPageLinkSchema = z.object({
	id: z.uuid(),
	bio_page_id: z.uuid(),
	link_id: z.uuid(),
	position: z.number().int().min(0).default(0),
	is_visible: z.boolean().default(true),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
});

// Schema for adding a link to bio page
export const BioPageLinkForCreateSchema = BioPageLinkSchema.pick({
	link_id: true,
	position: true,
	is_visible: true,
}).partial({
	position: true,
	is_visible: true,
});

// Schema for updating a bio page link
export const BioPageLinkForUpdateSchema = BioPageLinkSchema.pick({
	position: true,
	is_visible: true,
}).partial();

// Public bio page response (what visitors see)
export const PublicBioPageSchema = z.object({
	slug: z.string(),
	display_name: z.string(),
	bio: z.string().nullable().optional(),
	avatar_url: z.string().nullable().optional(),
	theme: z.string(),
	links: z.array(
		z.object({
			id: z.uuid(),
			title: z.string(),
			url: z.string(),
			description: z.string().nullable().optional(),
			special_type: z.string().nullable().optional(),
			special_code: z.string().nullable().optional(),
		}),
	),
});

// TypeScript interfaces
export interface IBioPage extends z.infer<typeof BioPageSchema> {}
export interface IBioPageForCreate
	extends z.infer<typeof BioPageForCreateSchema> {}
export interface IBioPageForUpdate
	extends z.infer<typeof BioPageForUpdateSchema> {}
export interface IBioPageLink extends z.infer<typeof BioPageLinkSchema> {}
export interface IBioPageLinkForCreate
	extends z.infer<typeof BioPageLinkForCreateSchema> {}
export interface IBioPageLinkForUpdate
	extends z.infer<typeof BioPageLinkForUpdateSchema> {}
export interface IPublicBioPage extends z.infer<typeof PublicBioPageSchema> {}
