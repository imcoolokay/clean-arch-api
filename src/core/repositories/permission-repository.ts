import type { Permission } from "../entities/permission";

export interface PermissionRepository {
	findBySlug(slug: string): Promise<Permission | null>;
	findAllByUserId(userId: string): Promise<string[]>;
	assignToUser(userId: string, permissionId: number): Promise<void>;
	removeFromUser(userId: string, permissionId: number): Promise<void>;
}
