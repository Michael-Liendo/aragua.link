import { APP_NAME_CAPITALIZED } from "@aragualink/shared";
import { useEffect } from "react";

interface SEOProps {
	title: string;
	description?: string;
	keywords?: string;
	author?: string;
	robots?: string;
}

const useSEO = ({ title }: SEOProps) => {
	useEffect(() => {
		document.title = `${title} | ${APP_NAME_CAPITALIZED}`;
	}, [title]);
};

export default useSEO;
