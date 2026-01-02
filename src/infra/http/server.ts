import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import Fastify from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "../../config/env";
import { errorHandler } from "./error-handler";
import { authGuard } from "./plugins/auth-guard";
import { permissionGuard } from "./plugins/permission-guard";
import type { ApiDependencies } from "./routes";

export function createServer(container: ApiDependencies) {
	const app = Fastify();

	app.register(fastifyCookie, {
		secret: env.APP_COOKIE_SECRET,
		hook: "onRequest",
	});

	app.register(fastifyJwt, {
		secret: env.APP_JWT_SECRET,
		cookie: {
			cookieName: "accessToken",
			signed: false,
		},
	});

	app.register(authGuard);
	app.register(permissionGuard, {
		permissionRepository: container.permissionRepository,
	});

	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);
	app.setErrorHandler(errorHandler);

	return app.withTypeProvider<ZodTypeProvider>();
}
