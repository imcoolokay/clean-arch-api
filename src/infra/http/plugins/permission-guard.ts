import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import type { PermissionRepository } from "@/core/repositories/permission-repository";

const permissionGuardPlugin = async (
	app: FastifyInstance,
	opts: { permissionRepository: PermissionRepository },
) => {
	const { permissionRepository } = opts;

	app.addHook("onRequest", async (req, reply) => {
		const requiredPermissions = req.routeOptions.config?.permissions;
		if (!requiredPermissions?.length) return;

		const user = req.user;
		if (!user?.sub) {
			await reply.status(401).send({
				message: "Unauthorized",
			});

			return reply;
		}

		if (user.role === "admin") return;

		try {
			const userPermissions = await permissionRepository.findAllByUserId(
				user.sub,
			);

			const hasPermission = requiredPermissions.every((p) =>
				userPermissions.includes(p),
			);

			if (!hasPermission) {
				await reply.status(403).send({
					message: "Forbidden",
				});

				return reply;
			}
		} catch (err) {
			req.log.error(err);
			await reply.status(500).send({
				message: "Internal Server Error",
			});

			return reply;
		}
	});
};

export const permissionGuard = fp(permissionGuardPlugin, {
	name: "permission-guard",
	dependencies: ["auth-guard"],
});
