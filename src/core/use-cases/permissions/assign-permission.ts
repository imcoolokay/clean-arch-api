import { AppError } from "@/core/errors/app-error";
import type { PermissionRepository } from "@/core/repositories/permission-repository";
import type { UserRepository } from "@/core/repositories/user-repository";
import type { AssignPermissionInput } from "./permissions.dto";

export class AssignPermission {
	constructor(
		private permissionRepo: PermissionRepository,
		private userRepo: UserRepository,
	) {}

	async execute({
		userId,
		permissionSlug,
	}: AssignPermissionInput): Promise<void> {
		const user = await this.userRepo.findById(userId);
		if (!user) {
			throw new AppError("User not found", 404);
		}

		const permission = await this.permissionRepo.findBySlug(permissionSlug);
		if (!permission) {
			throw new AppError(`Permission '${permissionSlug}' is not valid`, 400);
		}

		const userPermissions = await this.permissionRepo.findAllByUserId(userId);
		if (userPermissions.includes(permissionSlug)) {
			return;
		}

		await this.permissionRepo.assignToUser(userId, permission.id);
	}
}
