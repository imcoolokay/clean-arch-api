import { AppError } from "@/core/errors/app-error";
import type { PermissionRepository } from "@/core/repositories/permission-repository";
import type { RemovePermissionInput } from "./permissions.dto";

export class RemovePermission {
	constructor(private permissionRepo: PermissionRepository) {}

	async execute({
		userId,
		permissionSlug,
	}: RemovePermissionInput): Promise<void> {
		const permission = await this.permissionRepo.findBySlug(permissionSlug);

		if (!permission) {
			throw new AppError("Permission not found", 404);
		}

		await this.permissionRepo.removeFromUser(userId, permission.id);
	}
}
