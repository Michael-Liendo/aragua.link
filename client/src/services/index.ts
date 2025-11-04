import { AuthService } from "./auth";
import { UserService } from "./users";

export default class Services {
	static auth = AuthService;
	static users = UserService;
}
