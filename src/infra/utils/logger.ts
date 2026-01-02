import pino from "pino";
import { env } from "../../config/env";

export const logger = pino({
	level: env.APP_ENV === "development" ? "debug" : "info",
	transport:
		env.APP_ENV === "development"
			? {
					target: "pino-pretty",
					options: {
						colorize: true,
						ignore: "pid,hostname",
						translateTime: "HH:MM:ss",
					},
				}
			: undefined,
});
