export enum PublicRoutesEnum {
	Landing = "/",
	Terms = "/terminos",
	Privacy = "/privacidad",
}

export enum AuthRoutesEnum {
	Login = "/login",
	Register = "/register",
}

export enum PrivateRoutesEnum {
	Home = "/app",
	Links = "/app/links",
	LinkAnalytics = "/app/links/:linkId/analytics",
	Analytics = "/app/analytics",
	BioPage = "/app/bio",
	Admin = "/app/admin",
}
