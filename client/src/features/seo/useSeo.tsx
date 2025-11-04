import { APP_NAME_CAPITALIZED } from "@aragualink/shared";
import { useEffect } from "react";

interface SEOProps {
	title: string;
	description?: string;
	keywords?: string;
	author?: string;
	robots?: string;
	ogImage?: string;
	ogType?: string;
	ogUrl?: string;
	twitterCard?: "summary" | "summary_large_image" | "app" | "player";
	twitterSite?: string;
	twitterCreator?: string;
}

const useSEO = ({
	title,
	description = "Acorta tus enlaces y crea tu página personalizada con AraguaLink. Simple, rápido y profesional.",
	keywords = "acortador de enlaces, url shortener, bio link, link in bio, aragua, venezuela",
	author = "AraguaLink",
	robots = "index, follow",
	ogImage = "/large-logo.png",
	ogType = "website",
	ogUrl,
	twitterCard = "summary_large_image",
	twitterSite = "@aragualink",
	twitterCreator = "@aragualink",
}: SEOProps) => {
	useEffect(() => {
		// Set document title
		document.title = `${title} | ${APP_NAME_CAPITALIZED}`;

		// Helper function to set or update meta tags
		const setMetaTag = (name: string, content: string, property?: boolean) => {
			const attribute = property ? "property" : "name";
			let element = document.querySelector(
				`meta[${attribute}="${name}"]`,
			) as HTMLMetaElement;

			if (!element) {
				element = document.createElement("meta");
				element.setAttribute(attribute, name);
				document.head.appendChild(element);
			}

			element.content = content;
		};

		// Basic meta tags
		setMetaTag("description", description);
		setMetaTag("keywords", keywords);
		setMetaTag("author", author);
		setMetaTag("robots", robots);

		// Open Graph meta tags
		setMetaTag("og:title", `${title} | ${APP_NAME_CAPITALIZED}`, true);
		setMetaTag("og:description", description, true);
		setMetaTag("og:type", ogType, true);
		setMetaTag("og:image", ogImage, true);
		if (ogUrl) {
			setMetaTag("og:url", ogUrl, true);
		}
		setMetaTag("og:site_name", APP_NAME_CAPITALIZED, true);

		// Twitter Card meta tags
		setMetaTag("twitter:card", twitterCard);
		setMetaTag("twitter:title", `${title} | ${APP_NAME_CAPITALIZED}`);
		setMetaTag("twitter:description", description);
		setMetaTag("twitter:image", ogImage);
		setMetaTag("twitter:site", twitterSite);
		setMetaTag("twitter:creator", twitterCreator);

		// Additional meta tags
		setMetaTag("theme-color", "#f59e0b"); // amber-500
	}, [
		title,
		description,
		keywords,
		author,
		robots,
		ogImage,
		ogType,
		ogUrl,
		twitterCard,
		twitterSite,
		twitterCreator,
	]);
};

export default useSEO;
