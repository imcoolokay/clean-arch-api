import { env } from "./config/env";
import { databaseConnect } from "./infra/database/connection";
import { makeContainer } from "./infra/di/container";
import { apiRoutes } from "./infra/http/routes";
import { createServer } from "./infra/http/server";
import { logger } from "./infra/utils/logger";

async function main() {
	try {
		const db = await databaseConnect();

		const container = makeContainer(db);

		const app = createServer(container);

		app.register(apiRoutes, {
			prefix: "/api/v1",
			container,
		});

		await app.ready();
		await app.listen({ port: env.APP_PORT, host: "0.0.0.0" });

		logger.info({
			msg: "Server started",
			env: env.APP_ENV,
			port: env.APP_PORT,
		});
	} catch (err) {
		logger.fatal(err, "Failed to start server");
		process.exit(1);
	}
}

main();
