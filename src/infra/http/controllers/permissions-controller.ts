import type { FastifyReply, FastifyRequest } from "fastify";
import type { AssignPermission } from "@/core/use-cases/permissions/assign-permission";
import type { ListUserPermissions } from "@/core/use-cases/permissions/list-user-permissions";
import type { RemovePermission } from "@/core/use-cases/permissions/remove-permission";
import type {
	AssignPermissionBody,
	AssignPermissionParams,
	RemovePermissionParams,
} from "../dtos/permissions-schema";

export class UserPermissionsController {
	constructor(
		private assignUseCase: AssignPermission,
		private removeUseCase: RemovePermission,
		private listUseCase: ListUserPermissions,
	) {}

	async assign(
		req: FastifyRequest<{
			Body: AssignPermissionBody;
			Params: AssignPermissionParams;
		}>,
		reply: FastifyReply,
	) {
		const { userId } = req.params;
		const { permissionSlug } = req.body;

		await this.assignUseCase.execute({ userId, permissionSlug });

		return reply.status(204).send();
	}

	async remove(
		req: FastifyRequest<{ Params: RemovePermissionParams }>,
		reply: FastifyReply,
	) {
		const { userId, permissionSlug } = req.params;

		await this.removeUseCase.execute({ userId, permissionSlug });

		return reply.status(204).send();
	}

	async list(
		req: FastifyRequest<{ Params: AssignPermissionParams }>,
		reply: FastifyReply,
	) {
		const { userId } = req.params;

		const permissions = await this.listUseCase.execute({ userId });

		return reply.status(200).send({ permissions });
	}
}
