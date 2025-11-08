import { AdminRepository } from "./admin";
import { Analytics } from "./analytics";
import BioPageRepository from "./bioPages";
import { Links } from "./links";
import { Users } from "./users";

export { AdminRepository as Admin } from "./admin";
export { Analytics } from "./analytics";
export { default as BioPages } from "./bioPages";
export { Links } from "./links";
export { Users } from "./users";

export default class Repository {
	static users = Users;
	static admin = AdminRepository;
	static links = Links;
	static analytics = Analytics;
	static bioPages = BioPageRepository;
}
