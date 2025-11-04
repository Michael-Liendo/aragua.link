export const formatCurrencyValue = (
	value: number,
	currency = "",
	decimalDigits?: number,
) => {
	// catch the infinity for return the 0
	if (value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY)
		return `${currency}${(0).toLocaleString("es-VE", {
			minimumFractionDigits: decimalDigits ?? 2,
			maximumFractionDigits: decimalDigits ?? 2,
		})}`;

	return `${currency}${(value || 0).toLocaleString("es-VE", {
		minimumFractionDigits: decimalDigits ?? 2,
		maximumFractionDigits: decimalDigits ?? 2,
	})}`;
};
