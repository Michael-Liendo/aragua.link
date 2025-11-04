export const formatCurrency = (amount: number, currency = "Bs.") => {
	const formattedAmount = new Intl.NumberFormat("es-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);
	return `${currency}${formattedAmount}`;
};

// expected format: "12:00 PM"
export const formatToHour = (date: string | Date) => {
	return new Intl.DateTimeFormat("es-VE", {
		hour: "numeric",
		minute: "numeric",
	}).format(new Date(date));
};

export const formatDate = (date: string | Date) => {
	return new Intl.DateTimeFormat("es-VE", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(new Date(date));
};

export const formatDateToSortable = (date: string | Date) => {
	const d = new Date(date);
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	const h = String(d.getHours()).padStart(2, "0");
	const min = String(d.getMinutes()).padStart(2, "0");

	return `${y}-${m}-${day} ${h}:${min}`;
};
