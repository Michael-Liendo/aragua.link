import AdminService from "./admin.service";
import Auth from "./auth.service";
import Users from "./users.service";

export default class Services {
	static auth = Auth;
	static user = Users;
	static admin = AdminService;
}
