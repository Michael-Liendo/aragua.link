import { StatusCodes } from "http-status-codes";

export class ErrorWithDetails extends Error {
	constructor(
		message?: string,
		details?: { code: string; path: string; message: string },
		stack?: string,
	) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
		this.details = details;
		this.stack = stack;
	}

	statusCode: number;
	details?: { code: string; path: string; message: string };
	stack?: string;
}

export class InternalServerError extends ErrorWithDetails {
	name = "INTERNAL_SERVER_ERROR";
	statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
}

export class BadRequestError extends ErrorWithDetails {
	name = "BAD_REQUEST";

	statusCode = StatusCodes.BAD_REQUEST;
}
export class ConflictError extends ErrorWithDetails {
	name = "CONFLICT";
	statusCode = StatusCodes.CONFLICT;
}
export class ForbiddenError extends ErrorWithDetails {
	name = "FORBIDDEN";
	statusCode = StatusCodes.FORBIDDEN;
}
export class NotFoundError extends ErrorWithDetails {
	name = "NOT_FOUND";
	statusCode = StatusCodes.NOT_FOUND;
}
export class UnauthorizedError extends ErrorWithDetails {
	name = "UNAUTHORIZED";
	statusCode = StatusCodes.UNAUTHORIZED;
}
