import { MasterNameEnum, type TMasterName } from "../schema/server";

export function validateMasterName(masterName: string): boolean {
	return MasterNameEnum.options.includes(masterName as TMasterName);
}
