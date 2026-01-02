import { and, eq } from "drizzle-orm";
import type { BunSQLDatabase } from "drizzle-orm/bun-sql";
import type { PermissionRepository } from "@/core/repositories/permission-repository";
import type { Permission } from "../../../core/entities/permission";
import { permissionsTable, userPermissionsTable } from "../schemas/rbac";

export class DrizzlePermissionRepository implements PermissionRepository {
	constructor(private readonly db: BunSQLDatabase) {}

	async findBySlug(slug: string): Promise<Permission | null> {
		const [result] = await this.db
			.select()
			.from(permissionsTable)
			.where(
				and(
					eq(permissionsTable.slug, slug),
					eq(permissionsTable.status, "active"),
				),
			);

		if (!result) return null;

		return {
			id: result.id,
			slug: result.slug,
			description: result.description || undefined,
			createdAt: result.createdAt,
		};
	}

	async findAllByUserId(userId: string): Promise<string[]> {
		const result = await this.db
			.select({ slug: permissionsTable.slug })
			.from(userPermissionsTable)
			.innerJoin(
				permissionsTable,
				eq(userPermissionsTable.permissionId, permissionsTable.id),
			)
			.where(
				and(
					eq(userPermissionsTable.userId, userId),
					eq(permissionsTable.status, "active"),
				),
			);

		return result.map((r) => r.slug);
	}

	async assignToUser(userId: string, permissionId: number): Promise<void> {
		await this.db
			.insert(userPermissionsTable)
			.values({ userId, permissionId })
			.onConflictDoNothing();
	}

	async removeFromUser(userId: string, permissionId: number): Promise<void> {
		await this.db
			.update(userPermissionsTable)
			.set({ status: "inactive" })
			.where(
				and(
					eq(userPermissionsTable.userId, userId),
					eq(userPermissionsTable.permissionId, permissionId),
				),
			);
	}
}
