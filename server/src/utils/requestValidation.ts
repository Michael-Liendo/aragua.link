import type { Reply, Request } from "../types";

const requestValidation = (
	// biome-ignore lint/suspicious/noExplicitAny: Accepting any Zod schema
	schema: any,
) => {
	return async (req: Request, reply: Reply) => {
		if (!schema) return;

		const result = schema.safeParse(req.body);

		if (!req.body) {
			return reply.status(400).send({
				success: false,
				message: "Validation error",
				errors: [
					{
						code: "MISSING_BODY",
						path: "root",
						message: "Request body is missing",
					},
				],
			});
		}

		if (!result.success) {
			// biome-ignore lint/suspicious/noExplicitAny: Zod issue type
			const errors = result.error.issues.map((issue: any) => ({
				code: issue.code,
				path: issue.path.length > 0 ? issue.path.join(".") : "root",
				message: issue.message,
			}));
			reply.status(400).send({
				success: false,
				message: "Validation error",
				errors,
			});
		} else {
			req.body = result.data;
		}
	};
};

export default requestValidation;
