import type { Permission } from "@/core/entities/permission";
import type { PermissionRepository } from "@/core/repositories/permission-repository";

interface UserPermissionRelation {
	userId: string;
	permissionId: number;
}

export class MockPermissionRepository implements PermissionRepository {
	public items: Permission[] = [];
	public userPermissions: UserPermissionRelation[] = [];

	async create(data: Permission): Promise<Permission> {
		this.items.push(data);
		return data;
	}

	async findBySlug(slug: string): Promise<Permission | null> {
		return this.items.find((p) => p.slug === slug) || null;
	}

	async assignToUser(userId: string, permissionId: number): Promise<void> {
		const exists = this.userPermissions.some(
			(up) => up.userId === userId && up.permissionId === permissionId,
		);

		if (!exists) {
			this.userPermissions.push({ userId, permissionId });
		}
	}

	async removeFromUser(userId: string, permissionId: number): Promise<void> {
		this.userPermissions = this.userPermissions.filter(
			(up) => !(up.userId === userId && up.permissionId === permissionId),
		);
	}

	async findAllByUserId(userId: string): Promise<string[]> {
		const userRelations = this.userPermissions.filter(
			(up) => up.userId === userId,
		);

		return userRelations
			.map((relation) => {
				const permission = this.items.find(
					(p) => p.id === relation.permissionId,
				);
				return permission ? permission.slug : null;
			})
			.filter((slug): slug is string => slug !== null);
	}
}
