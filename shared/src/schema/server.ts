import { z } from "zod";

export const MasterNameEnum = z.enum(["users", "links"]);

export interface IReply {
	200: ISResponse<unknown>;
	201: ISResponse<unknown>;
	204: ISResponse<unknown>;
	400: {
		success: boolean;
		message: string;
		error?: string;
		errors?: IError[];
	};
	401: {
		success: boolean;
		message: string;
		error?: string;
		errors?: IError[];
	};
	500: {
		error: string;
		success: boolean;
		message: string;
		details?: string;
	};
}

export type TMasterName = z.infer<typeof MasterNameEnum>;

export interface IError {
	code: string;
	path: string;
	message: string;
}

export interface ISResponse<T> {
	success: boolean;
	message: string;
	data: T;
	pagination?: IPaginationResponse;
}

export interface ISReplyFindAll<T> {
	data: T[];
	pagination: IPaginationResponse;
}

export interface IFindAllDatabase<T> {
	data: T[];
	count: number;
}

export interface IPaginationRequest {
	page: number;
	limit?: number;
}

export interface IPaginationResponse {
	page: number;
	limit: number;
	total: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
}
