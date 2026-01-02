import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import type { UserRole, UserStatus } from "@/core/entities/user";

export const usersTable = pgTable("users", {
	id: uuid().primaryKey(),
	name: varchar({ length: 100 }).notNull(),
	email: text().notNull().unique(),
	password: text().notNull(),
	role: text().notNull().default("user").$type<UserRole>(),
	status: text().notNull().default("active").$type<UserStatus>(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp(),
});
