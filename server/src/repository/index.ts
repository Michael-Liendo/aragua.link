import { AdminRepository } from "./admin";
import { Users } from "./users";

export default class Repository {
	static users = Users;
	static admin = AdminRepository;
}
