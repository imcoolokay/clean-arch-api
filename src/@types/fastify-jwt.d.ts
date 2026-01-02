import "@fastify/jwt";

declare module "@fastify/jwt" {
	export interface FastifyJWT {
		payload: { sub: string; role: string };
		user: { sub: string; role: string };
	}
}
