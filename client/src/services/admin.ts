import customFetch from "@/utils/fetch";

export interface DashboardMetrics {
	users: { total: number; free: number; pro: number; enterprise: number };
	links: { total: number; active: number; inactive: number };
	clicks: {
		total: number;
		today: number;
		thisWeek: number;
		thisMonth: number;
	};
	bioPages: { total: number };
}

export default class AdminService {
	static async getDashboardMetrics(): Promise<DashboardMetrics> {
		const response = await customFetch("/admin/metrics");
		const data = await response.json();
		return data.data;
	}

	static async getAll(
		masterName: string,
		page = 0,
		limit = 100,
	): Promise<{ data: any[]; pagination: any }> {
		const response = await customFetch(
			`/admin/findAll/${masterName}?page=${page}&limit=${limit}`,
		);
		const data = await response.json();
		return { data: data.data, pagination: data.pagination };
	}

	static async getOne(masterName: string, id: string): Promise<any> {
		const response = await customFetch(`/admin/findOne/${masterName}/${id}`);
		const data = await response.json();
		return data.data;
	}

	static async create(masterName: string, payload: any): Promise<any> {
		const response = await customFetch(`/admin/create/${masterName}`, {
			method: "POST",
			body: JSON.stringify(payload),
		});
		const data = await response.json();
		return data.data;
	}

	static async update(
		masterName: string,
		id: string,
		payload: any,
	): Promise<any> {
		const response = await customFetch(`/admin/update/${masterName}/${id}`, {
			method: "PUT",
			body: JSON.stringify(payload),
		});
		const data = await response.json();
		return data.data;
	}

	static async delete(masterName: string, id: string): Promise<void> {
		await customFetch(`/admin/delete/${masterName}/${id}`, {
			method: "DELETE",
		});
	}

	static async changeUserPassword(
		userId: string,
		newPassword: string,
	): Promise<void> {
		await customFetch("/admin/users/change-password", {
			method: "POST",
			body: JSON.stringify({ userId, newPassword }),
		});
	}

	static async updateUserRole(userId: string, plan: string): Promise<void> {
		await customFetch("/admin/users/update-role", {
			method: "POST",
			body: JSON.stringify({ userId, plan }),
		});
	}
}
