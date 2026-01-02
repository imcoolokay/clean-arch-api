import type { FastifyInstance } from "fastify";
import {
	hasZodFastifySchemaValidationErrors,
	isResponseSerializationError,
} from "fastify-type-provider-zod";
import { AppError } from "@/core/errors/app-error";
import { logger } from "../utils/logger";

export const errorHandler: FastifyInstance["errorHandler"] = (
	error,
	_,
	reply,
) => {
	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.status(400).send({
			message: "Validation Error",
			issues: error.validation,
		});
	}

	if (isResponseSerializationError(error)) {
		return reply.status(500).send({
			message: "Internal Server Error",
		});
	}

	if (error instanceof AppError) {
		return reply.status(error.statusCode).send({
			message: error.message,
		});
	}

	logger.error({ err: error }, "Unexpected error");
	return reply.status(500).send({
		message: "Internal Server Error",
	});
};
