import type { FastifyReply, FastifyRequest } from "fastify";
import type { RefreshUserToken } from "@/core/use-cases/authentication/refresh-token";
import { env } from "../../../config/env";

export class RefreshTokenController {
	constructor(private useCase: RefreshUserToken) {}

	async handle(req: FastifyRequest, reply: FastifyReply) {
		const refreshTokenFromCookie = req.cookies.refreshToken;
		console.log(req.cookies);

		if (!refreshTokenFromCookie) {
			return reply.status(401).send({
				message: "Refresh token not found",
			});
		}

		const result = await this.useCase.execute(refreshTokenFromCookie);

		if (!result) {
			return reply
				.status(401)
				.clearCookie("refreshToken")
				.clearCookie("accessToken")
				.send({
					message: "Invalid refresh token",
				});
		}

		const { accessToken, refreshToken } = result;

		const cookieOptions = {
			httpOnly: true,
			secure: env.APP_ENV === "production",
			sameSite: "strict",
		} as const;

		reply.setCookie("accessToken", accessToken, {
			...cookieOptions,
			path: "/",
			maxAge: 60 * 60,
		});

		reply.setCookie("refreshToken", refreshToken, {
			...cookieOptions,
			path: "/",
			maxAge: 60 * 60 * 24 * 7,
		});

		return reply.status(200).send({
			message: "Tokens refreshed successfully",
		});
	}
}
