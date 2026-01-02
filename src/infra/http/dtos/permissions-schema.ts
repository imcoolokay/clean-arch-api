import { z } from "zod";

export const permissionParamsSchema = z.object({
	userId: z.string(),
});

export const assignPermissionBodySchema = z.object({
	permissionSlug: z.string().min(1),
});

export const removePermissionParamsSchema = z.object({
	userId: z.string(),
	permissionSlug: z.string(),
});

export type AssignPermissionParams = z.infer<typeof permissionParamsSchema>;
export type AssignPermissionBody = z.infer<typeof assignPermissionBodySchema>;
export type RemovePermissionParams = z.infer<
	typeof removePermissionParamsSchema
>;
