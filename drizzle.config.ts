import { defineConfig } from "drizzle-kit";

if (!process.env.APP_DATABASE_URL) {
	throw new Error("POSTGRESQL_CONNECTION_STRING is undefined");
}

export default defineConfig({
	dialect: "postgresql",
	schema: [
		"./src/infra/database/schemas/users.ts",
		"./src/infra/database/schemas/rbac.ts",
		"./src/infra/database/schemas/auth.ts",
	],
	dbCredentials: {
		url: process.env.APP_DATABASE_URL,
	},
	migrations: {
		prefix: "index",
	},
	casing: "snake_case",
	verbose: true,
});
