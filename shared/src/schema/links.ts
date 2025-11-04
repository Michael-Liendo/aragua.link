import { z } from "zod";
import { SpecialLinkTypeEnum } from "./specialLinks";

export const LinkSchema = z.object({
	id: z.uuid(),
	user_id: z.uuid(),
	title: z.string().min(1).max(255),
	url: z.string().url(),
	short_code: z.string().min(3).max(50),
	description: z.string().max(500).nullable().optional(),
	is_active: z.boolean().default(true),
	clicks: z.number().int().min(0).default(0),
	position: z.number().int().min(0).default(0),
	special_type: SpecialLinkTypeEnum.nullable().optional(),
	special_code: z.string().nullable().optional(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
});

export const LinkForCreateSchema = LinkSchema.pick({
	title: true,
	url: true,
	short_code: true,
	description: true,
	is_active: true,
	position: true,
	special_type: true,
	special_code: true,
}).partial({
	description: true,
	is_active: true,
	position: true,
	special_type: true,
	special_code: true,
});

export const LinkForUpdateSchema = LinkSchema.pick({
	title: true,
	url: true,
	description: true,
	is_active: true,
	position: true,
}).partial();

export interface ILink extends z.infer<typeof LinkSchema> {}

export interface ILinkForCreate extends z.infer<typeof LinkForCreateSchema> {}

export interface ILinkForUpdate extends z.infer<typeof LinkForUpdateSchema> {}

// Stats for analytics
export const LinkStatsSchema = z.object({
	link_id: z.uuid(),
	total_clicks: z.number().int().min(0),
	unique_clicks: z.number().int().min(0),
	last_clicked_at: z.coerce.date().nullable(),
});

export interface ILinkStats extends z.infer<typeof LinkStatsSchema> {}
