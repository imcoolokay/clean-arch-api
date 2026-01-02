import { boolean, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const refreshTokens = pgTable("refresh_tokens", {
	id: uuid()
		.primaryKey()
		.$defaultFn(() => Bun.randomUUIDv7()),
	token: uuid()
		.unique()
		.notNull()
		.$defaultFn(() => Bun.randomUUIDv7()),
	userId: uuid()
		.references(() => usersTable.id)
		.notNull(),
	isValid: boolean().default(true).notNull(),
	expiresAt: timestamp().notNull(),
	createdAt: timestamp().defaultNow().notNull(),
});
