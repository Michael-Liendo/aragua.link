export const isValidUUID = (uuid: string): boolean => {
	const pattern =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	return pattern.test(uuid);
};
