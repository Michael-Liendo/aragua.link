const Fetch = () => {
	return async (url: string, options?: RequestInit) => {
		const defaultOptions: { Authorization?: string } = {};
		const token = await localStorage.getItem("token");
		if (token) {
			defaultOptions.Authorization = `Bearer ${token}`;
		}
		const apiUrl = `${import.meta.env.VITE_API_URL}/api${url}`;
		const requestOptions = {
			...options,
			headers: new Headers({
				"Content-Type":
					options?.method === "DELETE" ? "text/plain" : "application/json",
				...defaultOptions,
				...options?.headers,
			}),
		};
		const response = await fetch(apiUrl, requestOptions);
		if (!response.ok) throw await response.json();

		return response;
	};
};

export default Fetch();
