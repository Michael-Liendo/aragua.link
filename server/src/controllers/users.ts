import type { IUser, IUserForUpdate } from "@aragualink/shared";
import Services from "../services";
import type { Reply, Request } from "../types";

export async function me(request: Request, reply: Reply) {
	// biome-ignore lint/correctness/noUnusedVariables: remove the password from the response
	const { password, ...user } = request.user as IUser;
	return reply.code(200).send({ success: true, message: "Ok", data: user });
}

export async function update(req: Request, reply: Reply) {
	const { id } = req.user as Required<IUser>;
	const userUpdates = req.body as IUserForUpdate;

	const updated = await Services.user.update(id, userUpdates);
	reply
		.status(200)
		.send({ success: true, message: "User updated", data: updated });
}

export async function deleteUser(req: Request, reply: Reply) {
	const { id } = req.user as Required<IUser>;

	await Services.user.delete(id);
	return reply.status(204).send();
}

export async function getOne(req: Request, reply: Reply) {
	const { id } = req.params as { id: string };
	const user = await Services.user.getByID(id);
	// biome-ignore lint/correctness/noUnusedVariables: remove the password from the response
	const { password, ...safe } = user as Required<IUser>;
	return reply.status(200).send({ success: true, message: "Ok", data: safe });
}

export async function getByEmail(req: Request, reply: Reply) {
	const { email } = req.query as { email: string };
	const user = await Services.user.getByEmail(email);
	// biome-ignore lint/correctness/noUnusedVariables: remove the password from the response
	const { password, ...safe } = user as Required<IUser>;
	return reply.status(200).send({ success: true, message: "Ok", data: safe });
}
