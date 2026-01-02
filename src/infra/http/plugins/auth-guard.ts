import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const authGuardPlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
	app.addHook("onRequest", async (req, reply) => {
		if (req.routeOptions.config?.public) {
			return;
		}

		try {
			await req.jwtVerify();
		} catch {
			await reply.status(401).send({
				message: "Unauthorized",
				error: "Invalid or expired token",
			});

			return reply;
		}
	});
};

export const authGuard = fp(authGuardPlugin, {
	name: "auth-guard",
	dependencies: ["@fastify/jwt", "@fastify/cookie"],
});
