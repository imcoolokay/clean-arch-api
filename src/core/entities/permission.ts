export type PermissionStatus = "active" | "inactive";
export type UserPermissionStatus = "active" | "inactive";

export interface Permission {
	id: number;
	slug: string;
	description?: string;
	createdAt: Date;
}

export interface UserPermission {
	userId: string;
	permissionSlug: string;
}
