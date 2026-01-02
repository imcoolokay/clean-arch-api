import type { Logger } from "drizzle-orm";
import { type BunSQLDatabase, drizzle } from "drizzle-orm/bun-sql";
import { env } from "../../config/env";
import { logger } from "../utils/logger";

class QueryLogger implements Logger {
	logQuery(query: string, _: unknown[]): void {
		logger.debug({ msg: "SQL Query", query });
	}
}

export type DrizzleDB = BunSQLDatabase;

export const databaseConnect = async (): Promise<DrizzleDB> => {
	try {
		const db = drizzle(env.APP_DATABASE_URL, {
			casing: "snake_case",
			logger: env.APP_ENV === "development" ? new QueryLogger() : undefined,
		});
		await db.execute("SELECT 1");
		return db;
	} catch (error) {
		logger.fatal({
			msg: "Database connection failed",
			error: error instanceof Error ? error.message : String(error),
		});
		process.exit(1);
	}
};
