import type { FastifyReply, FastifyRequest } from "fastify";
import type { RegisterUser } from "@/core/use-cases/register-user/register-user";
import type { RegisterBody } from "../dtos/auth-schema";

export class RegisterUserController {
	constructor(private useCase: RegisterUser) {}

	async handle(
		req: FastifyRequest<{ Body: RegisterBody }>,
		reply: FastifyReply,
	) {
		const result = await this.useCase.execute(req.body);
		return reply.status(201).send(result);
	}
}
