import type {
	IBioPage,
	ILink,
	IPaginationResponse,
	ISResponse,
	IUser,
	TMasterName,
} from "@aragualink/shared";
import customFetch from "@/utils/fetch";

export interface DashboardMetrics {
	users: {
		total: number;
		free: number;
		pro: number;
		enterprise: number;
		newThisWeek: number;
		newThisMonth: number;
	};
	links: {
		total: number;
		active: number;
		inactive: number;
		whatsappChats: number;
		whatsappGroups: number;
		telegramGroups: number;
		telegramChannels: number;
		discordInvites: number;
		customLinks: number;
	};
	clicks: {
		total: number;
		today: number;
		thisWeek: number;
		thisMonth: number;
		averagePerLink: number;
	};
	bioPages: { total: number; active: number };
	topCountries: Array<{
		country: string;
		country_code: string;
		clicks: number;
	}>;
	topCities: Array<{ city: string; country: string; clicks: number }>;
	topDevices: Array<{ device_type: string; clicks: number }>;
	topBrowsers: Array<{ browser: string; clicks: number }>;
	topReferrers: Array<{ referrer_domain: string; clicks: number }>;
}

// Generic type for getAll response
interface GetAllResponse<T> {
	data: T[];
	pagination: IPaginationResponse;
}

export default class AdminService {
	static async getDashboardMetrics(): Promise<DashboardMetrics> {
		const response = await customFetch("/admin/metrics");
		const data = await response.json();
		return data.data;
	}

	static async getAll<T = IUser | ILink | IBioPage>(
		masterName: TMasterName,
		page = 0,
		limit = 100,
	): Promise<GetAllResponse<T>> {
		const response = await customFetch(
			`/admin/findAll/${masterName}?page=${page}&limit=${limit}`,
		);
		const data: ISResponse<GetAllResponse<T>> = await response.json();
		return { data: data.data.data, pagination: data.data.pagination };
	}

	static async getOne<T = IUser | ILink | IBioPage>(
		masterName: TMasterName,
		id: string,
	): Promise<T> {
		const response = await customFetch(`/admin/findOne/${masterName}/${id}`);
		const data: ISResponse<T> = await response.json();
		return data.data;
	}

	static async create<T = IUser | ILink | IBioPage>(
		masterName: TMasterName,
		payload: Partial<T>,
	): Promise<T> {
		const response = await customFetch(`/admin/create/${masterName}`, {
			method: "POST",
			body: JSON.stringify(payload),
		});
		const data: ISResponse<T> = await response.json();
		return data.data;
	}

	static async update<T = IUser | ILink | IBioPage>(
		masterName: TMasterName,
		id: string,
		payload: Partial<T>,
	): Promise<T> {
		const response = await customFetch(`/admin/update/${masterName}/${id}`, {
			method: "PUT",
			body: JSON.stringify(payload),
		});
		const data: ISResponse<T> = await response.json();
		return data.data;
	}

	static async delete(masterName: TMasterName, id: string): Promise<void> {
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
