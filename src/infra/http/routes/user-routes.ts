import type { FastifyInstance, FastifyRequest } from "fastify";
import { Permissions } from "@/core/constants/permissions";
import type { RegisterUserController } from "../controllers/register-user-controller";
import {
	type RegisterUserBody,
	registerUserBodySchema,
	registerUserResponseSchema,
} from "../dtos/register-user-schema";

export async function userRoutes(
	app: FastifyInstance,
	opts: { registerController: RegisterUserController },
) {
	const { registerController } = opts;

	app.post(
		"/",
		{
			schema: {
				tags: ["Users"],
				body: registerUserBodySchema,
				response: {
					201: registerUserResponseSchema,
				},
			},
			config: {
				permissions: [Permissions.users.create],
			},
		},
		(req, reply) => {
			return registerController.handle(
				req as FastifyRequest<{ Body: RegisterUserBody }>,
				reply,
			);
		},
	);
}
