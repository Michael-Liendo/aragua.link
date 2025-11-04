export enum PublicRoutesEnum {
	Landing = "/",
}

export enum AuthRoutesEnum {
	Login = "/login",
	Register = "/register",
}

export enum PrivateRoutesEnum {
	Home = "/app",
	Links = "/app/links",
	LinkAnalytics = "/app/links/:linkId/analytics",
}
