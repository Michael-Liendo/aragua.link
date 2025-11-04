import type { Reply, Request } from "../types";

const queryValidation = (
	// biome-ignore lint/suspicious/noExplicitAny: Accepting any Zod schema
	schema: any,
) => {
	return async (req: Request, reply: Reply) => {
		if (!schema) return;

		const result = schema.safeParse(req.query);

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
			req.query = result.data;
		}
	};
};

export default queryValidation;
