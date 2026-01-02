import type { PermissionRepository } from "@/core/repositories/permission-repository";
import type {
	ListUserPermissionsInput,
	ListUserPermissionsOutput,
} from "./permissions.dto";

export class ListUserPermissions {
	constructor(private permissionRepo: PermissionRepository) {}

	async execute({
		userId,
	}: ListUserPermissionsInput): Promise<ListUserPermissionsOutput> {
		return this.permissionRepo.findAllByUserId(userId);
	}
}
