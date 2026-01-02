import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthenticateUser } from "@/core/use-cases/authentication/authenticate-user";
import { env } from "../../../config/env";
import type { LoginBody } from "../dtos/auth-schema";

export class AuthenticateController {
	constructor(private useCase: AuthenticateUser) {}

	async handle(req: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
		const { accessToken, refreshToken } = await this.useCase.execute(req.body);

		const cookieOptions = {
			httpOnly: true,
			secure: env.APP_ENV === "production",
			sameSite: "strict",
		} as const;

		reply.setCookie("refreshToken", refreshToken, {
			...cookieOptions,
			path: "/",
			maxAge: 60 * 60 * 24 * 7,
		});

		return reply.status(200).send({
			accessToken,
		});
	}
}
