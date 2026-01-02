export interface AssignPermissionInput {
	userId: string;
	permissionSlug: string;
}

export interface RemovePermissionInput {
	userId: string;
	permissionSlug: string;
}

export interface ListUserPermissionsInput {
	userId: string;
}

export type ListUserPermissionsOutput = string[];
