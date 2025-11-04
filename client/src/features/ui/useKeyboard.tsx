import { useEffect } from "react";

export function useKeyboard(key: string, callback: () => void) {
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === key || e.code === key) {
				e.preventDefault();
				callback();
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);
}
