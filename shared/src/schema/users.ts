import { z } from "zod";

export const UserSchema = z.object({
	id: z.uuid(),
	is_active: z.boolean().default(true),
	first_name: z.string(),
	last_name: z.string(),
	email: z.email(),
	password: z.string().optional(),
	phone: z.string().optional(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	last_login_at: z.coerce.date().optional(),
});

export const UserForLoginSchema = UserSchema.pick({
	email: true,
	password: true,
}).required();

export const UserForRegisterSchema = UserSchema.pick({
	first_name: true,
	last_name: true,
	email: true,
	password: true,
}).required();

export const UserForUpdateSchema = UserSchema.omit({
	id: true,
	created_at: true,
	updated_at: true,
	last_login_at: true,
}).partial();

export interface IUser extends z.infer<typeof UserSchema> {}

export interface IUserForRegister
	extends z.infer<typeof UserForRegisterSchema> {}

export interface IUserForLogin extends z.infer<typeof UserForLoginSchema> {}

export interface IUserForUpdate extends z.infer<typeof UserForUpdateSchema> {}

export interface ILoggedInUser {
	token: string;
	user: IUser;
}
