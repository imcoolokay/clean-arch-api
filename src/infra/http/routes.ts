import type { FastifyInstance } from "fastify";
import type { PermissionRepository } from "@/core/repositories/permission-repository";
import type { AuthenticateController } from "./controllers/authenticate-controller";
import type { UserPermissionsController } from "./controllers/permissions-controller";
import type { RefreshTokenController } from "./controllers/refresh-token-controller";
import type { RegisterUserController } from "./controllers/register-user-controller";
import { authRoutes } from "./routes/auth-routes";
import { permissionRoutes } from "./routes/permissions-routes";
import { userRoutes } from "./routes/user-routes";

export interface ApiDependencies {
	registerUserController: RegisterUserController;
	authenticateController: AuthenticateController;
	refreshTokenController: RefreshTokenController;
	userPermissionsController: UserPermissionsController;
	permissionRepository: PermissionRepository;
}

export async function apiRoutes(
	app: FastifyInstance,
	opts: { container: ApiDependencies },
) {
	const { container } = opts;

	app.register(userRoutes, {
		prefix: "/users",
		registerController: container.registerUserController,
	});

	app.register(authRoutes, {
		prefix: "/sessions",
		authenticateController: container.authenticateController,
		refreshTokenController: container.refreshTokenController,
	});

	app.register(permissionRoutes, {
		prefix: "/users",
		userPermissionsController: container.userPermissionsController,
	});
}
