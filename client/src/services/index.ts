import { AnalyticsService } from "./analytics";
import { AuthService } from "./auth";
import { BioPagesService } from "./bioPages";
import { LinksService } from "./links";
import { UserService } from "./users";

export default class Services {
	static auth = AuthService;
	static users = UserService;
	static links = LinksService;
	static analytics = AnalyticsService;
	static bioPages = BioPagesService;
}
