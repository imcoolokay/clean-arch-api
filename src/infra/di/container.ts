import { AuthenticateUser } from "@/core/use-cases/authentication/authenticate-user";
import { RefreshUserToken } from "@/core/use-cases/authentication/refresh-token";
import { AssignPermission } from "@/core/use-cases/permissions/assign-permission";
import { ListUserPermissions } from "@/core/use-cases/permissions/list-user-permissions";
import { RemovePermission } from "@/core/use-cases/permissions/remove-permission";
import { RegisterUser } from "@/core/use-cases/register-user/register-user";
import type { DrizzleDB } from "../database/connection";
import { DrizzlePermissionRepository } from "../database/repositories/drizzle-permission-repository";
import { DrizzleRefreshTokenRepository } from "../database/repositories/drizzle-refresh-token-repository";
import { DrizzleUserRepository } from "../database/repositories/drizzle-user-repository";
import { AuthenticateController } from "../http/controllers/authenticate-controller";
import { UserPermissionsController } from "../http/controllers/permissions-controller";
import { RefreshTokenController } from "../http/controllers/refresh-token-controller";
import { RegisterUserController } from "../http/controllers/register-user-controller";
import type { ApiDependencies } from "../http/routes";
import { BunHasher } from "../services/bun-hasher";
import { JwtProvider } from "../services/jwt-provider";

export function makeContainer(db: DrizzleDB): ApiDependencies {
	const hasher = new BunHasher();
	const tokenProvider = new JwtProvider();

	const userRepo = new DrizzleUserRepository(db);
	const permissionRepo = new DrizzlePermissionRepository(db);
	const refreshTokenRepo = new DrizzleRefreshTokenRepository(db);

	const registerUseCase = new RegisterUser(userRepo, hasher);
	const authUseCase = new AuthenticateUser(
		userRepo,
		hasher,
		tokenProvider,
		refreshTokenRepo,
	);
	const refreshTokenUseCase = new RefreshUserToken(
		refreshTokenRepo,
		userRepo,
		tokenProvider,
	);

	const assignPermission = new AssignPermission(permissionRepo, userRepo);
	const removePermission = new RemovePermission(permissionRepo);
	const listPermissions = new ListUserPermissions(permissionRepo);

	return {
		registerUserController: new RegisterUserController(registerUseCase),
		authenticateController: new AuthenticateController(authUseCase),
		refreshTokenController: new RefreshTokenController(refreshTokenUseCase),
		userPermissionsController: new UserPermissionsController(
			assignPermission,
			removePermission,
			listPermissions,
		),
		permissionRepository: permissionRepo,
	};
}
