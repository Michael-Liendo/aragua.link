import type { IPaginationResponse } from "@aragualink/shared";

export default function getPagination(
	page: number | string,
	limit: number | string,
	count: number,
): IPaginationResponse {
	let pageNumber = Number(page);
	let limitNumber = Number(limit);

	if (Number.isNaN(limitNumber)) {
		limitNumber = 10;
	}
	if (Number.isNaN(pageNumber)) {
		pageNumber = 0;
	}
	const total = count;
	const hasPreviousPage = pageNumber > 1;
	const hasNextPage = pageNumber < Math.ceil(total / limitNumber) - 1;

	return {
		page: pageNumber,
		limit: limitNumber,
		total,
		hasPreviousPage,
		hasNextPage,
	};
}
