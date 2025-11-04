import { AuthService } from "./auth";
import { LinksService } from "./links";
import { UserService } from "./users";

export default class Services {
	static auth = AuthService;
	static users = UserService;
	static links = LinksService;
}
