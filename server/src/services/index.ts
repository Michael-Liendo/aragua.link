import AdminService from "./admin.service";
import AnalyticsService from "./analytics.service";
import AuthService from "./auth.service";
import LinksService from "./links.service";
import UsersService from "./users.service";

export default class Services {
	static users = UsersService;
	static auth = AuthService;
	static admin = AdminService;
	static links = LinksService;
	static analytics = AnalyticsService;
}
