import {
	integer,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import type {
	PermissionStatus,
	UserPermissionStatus,
} from "@/core/entities/permission";
import { usersTable } from "./users";

export const permissionsTable = pgTable("permissions", {
	id: serial().primaryKey(),
	slug: text().unique().notNull(),
	description: text(),
	status: text().notNull().default("active").$type<PermissionStatus>(),
	createdAt: timestamp().defaultNow().notNull(),
});

export const userPermissionsTable = pgTable(
	"user_permissions",
	{
		userId: uuid()
			.references(() => usersTable.id)
			.notNull(),
		permissionId: integer()
			.references(() => permissionsTable.id)
			.notNull(),
		status: text().notNull().default("active").$type<UserPermissionStatus>(),
	},
	(table) => [primaryKey({ columns: [table.userId, table.permissionId] })],
);
