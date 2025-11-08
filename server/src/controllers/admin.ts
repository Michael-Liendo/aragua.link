import type {
	IAdminChangePassword,
	IAdminUpdateUserRole,
	IPaginationRequest,
} from "@aragualink/shared";
import Services from "../services";
import type { Reply, Request } from "../types";

export async function findAll(request: Request, reply: Reply) {
	const { page = 0, limit = 100 } = request.query as IPaginationRequest;
	const { master_name } = request.params as {
		master_name: string;
	};

	const result = await Services.admin.getAll(master_name, {
		page,
		limit,
	});

	return reply.code(200).send({
		success: true,
		message: "Ok",
		data: result.data,
		pagination: result.pagination,
	});
}

export async function findOne(request: Request, reply: Reply) {
	const { master_name, id } = request.params as {
		master_name: string;
		id: string;
	};

	const item = await Services.admin.getOne(master_name, id);

	return reply.code(200).send({
		success: true,
		message: "Ok",
		data: item,
	});
}

export async function create(request: Request, reply: Reply) {
	const { master_name } = request.params as { master_name: string };
	const body = request.body as Record<string, unknown>;

	const created = await Services.admin.create(master_name, body);

	return reply.code(201).send({
		success: true,
		message: "Created successfully",
		data: created,
	});
}

export async function update(request: Request, reply: Reply) {
	const { master_name, master_id } = request.params as {
		master_name: string;
		master_id: string;
	};
	const body = request.body as Record<string, unknown>;

	const updated = await Services.admin.update(master_name, master_id, body);

	return reply.code(200).send({
		success: true,
		message: "Updated successfully",
		data: updated,
	});
}

export async function remove(request: Request, reply: Reply) {
	const { master_name, master_id } = request.params as {
		master_name: string;
		master_id: string;
	};

	await Services.admin.delete(master_name, master_id);

	return reply.code(204).send();
}

export async function getDashboardMetrics(request: Request, reply: Reply) {
	const metrics = await Services.admin.getDashboardMetrics();

	return reply.code(200).send({
		success: true,
		message: "Ok",
		data: metrics,
	});
}

export async function changeUserPassword(request: Request, reply: Reply) {
	const { userId, newPassword } = request.body as IAdminChangePassword;

	await Services.admin.changeUserPassword(userId, newPassword);

	return reply.code(200).send({
		success: true,
		message: "Password updated successfully",
		data: null,
	});
}

export async function updateUserRole(request: Request, reply: Reply) {
	const { userId, plan } = request.body as IAdminUpdateUserRole;

	await Services.admin.updateUserRole(userId, plan);

	return reply.code(200).send({
		success: true,
		message: "User role updated successfully",
		data: null,
	});
}
