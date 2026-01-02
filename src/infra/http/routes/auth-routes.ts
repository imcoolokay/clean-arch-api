import type { FastifyInstance, FastifyRequest } from "fastify";
import type { AuthenticateController } from "../controllers/authenticate-controller";
import type { RefreshTokenController } from "../controllers/refresh-token-controller";
import { type LoginBody, loginSchema } from "../dtos/auth-schema";

export async function authRoutes(
	app: FastifyInstance,
	opts: {
		authenticateController: AuthenticateController;
		refreshTokenController: RefreshTokenController;
	},
) {
	const { authenticateController, refreshTokenController } = opts;

	app.post(
		"/",
		{
			schema: { tags: ["Auth"], body: loginSchema },
			config: { public: true },
		},
		(req, reply) =>
			authenticateController.handle(
				req as FastifyRequest<{ Body: LoginBody }>,
				reply,
			),
	);

	app.post(
		"/refresh-token",
		{
			schema: { tags: ["Auth"] },
			config: { public: true },
		},
		(req, reply) => refreshTokenController.handle(req, reply),
	);
}
