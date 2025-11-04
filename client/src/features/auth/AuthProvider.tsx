import type { IUser } from "@aragualink/shared";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import Services from "@/services";

export interface AuthContextProps {
	isLoading: boolean;
	setToken: (token: string) => void;
	logout: () => void;
	user: IUser | undefined;
	token: string | undefined;
	authInitialized: boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
	undefined,
);

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
	const [token, setToken] = useState<string | undefined>(undefined);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) setToken(token);
		setLoaded(true);
	}, []);

	const updateToken = async (token: string) => {
		await localStorage.setItem("token", token);
		setToken(token);
	};

	const logout = async () => {
		await localStorage.removeItem("token");
		setToken(undefined);
	};

	const { data: userData, isLoading } = useQuery<IUser | null, Error>({
		queryKey: ["user", token],
		queryFn: async () => {
			if (!token) return null;
			try {
				const user = await Services.users.me();
				return user;
				// biome-ignore lint: no know the type
			} catch (error: any) {
				if (error?.error === "UNAUTHORIZED") {
					await logout();
					return null;
				}
				throw error;
			}
		},
		enabled: !!token,
		staleTime: 5 * 60 * 1000,
		retry: false,
	});

	return (
		<AuthContext.Provider
			value={{
				isLoading,
				authInitialized: loaded && (!token || !isLoading),
				user: userData ?? undefined,
				token: token ?? undefined,
				setToken: updateToken,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
