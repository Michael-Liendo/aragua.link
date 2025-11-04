import { useEffect } from "react";

interface StructuredDataProps {
	data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
	useEffect(() => {
		const script = document.createElement("script");
		script.type = "application/ld+json";
		script.text = JSON.stringify(data);
		script.id = "structured-data";

		// Remove existing structured data if any
		const existing = document.getElementById("structured-data");
		if (existing) {
			existing.remove();
		}

		document.head.appendChild(script);

		return () => {
			script.remove();
		};
	}, [data]);

	return null;
}
