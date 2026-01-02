import type { FastifyInstance, FastifyRequest } from "fastify";
import { Permissions } from "@/core/constants/permissions";
import type { UserPermissionsController } from "../controllers/permissions-controller";
import {
	type AssignPermissionBody,
	type AssignPermissionParams,
	assignPermissionBodySchema,
	permissionParamsSchema,
	type RemovePermissionParams,
	removePermissionParamsSchema,
} from "../dtos/permissions-schema";

export async function permissionRoutes(
	app: FastifyInstance,
	opts: { userPermissionsController: UserPermissionsController },
) {
	const { userPermissionsController } = opts;

	app.post(
		"/:userId/permissions",
		{
			schema: {
				tags: ["Permissions"],
				params: permissionParamsSchema,
				body: assignPermissionBodySchema,
			},
			config: {
				permissions: [Permissions.users.update],
			},
		},
		(req, res) =>
			userPermissionsController.assign(
				req as FastifyRequest<{
					Body: AssignPermissionBody;
					Params: AssignPermissionParams;
				}>,
				res,
			),
	);

	app.delete(
		"/:userId/permissions/:permissionSlug",
		{
			schema: {
				tags: ["Permissions"],
				params: removePermissionParamsSchema,
			},
			config: {
				permissions: [Permissions.users.update],
			},
		},
		(req, res) =>
			userPermissionsController.remove(
				req as FastifyRequest<{ Params: RemovePermissionParams }>,
				res,
			),
	);

	app.get(
		"/:userId/permissions",
		{
			schema: {
				tags: ["Permissions"],
				params: permissionParamsSchema,
			},
			config: {
				permissions: [Permissions.users.read],
			},
		},
		(req, res) =>
			userPermissionsController.list(
				req as FastifyRequest<{ Params: AssignPermissionParams }>,
				res,
			),
	);
}
