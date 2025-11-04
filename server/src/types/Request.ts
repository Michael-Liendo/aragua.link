import type { IUser } from "@aragualink/shared";
import type { FastifyRequest } from "fastify";

export interface Request extends FastifyRequest {
	user?: IUser;
}
