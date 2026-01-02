import { eq } from "drizzle-orm";
import type { BunSQLDatabase } from "drizzle-orm/bun-sql";
import type { User } from "@/core/entities/user";
import type { UserRepository } from "@/core/repositories/user-repository";
import { usersTable } from "../schemas/users";

export class DrizzleUserRepository implements UserRepository {
	constructor(private readonly db: BunSQLDatabase) {}

	async create(user: User): Promise<string> {
		const [result] = await this.db
			.insert(usersTable)
			.values({
				id: user.id,
				name: user.name,
				email: user.email,
				password: user.password,
				role: user.role,
				createdAt: user.createdAt,
			})
			.returning({ id: usersTable.id });

		if (!result) {
			throw new Error("User insert failed");
		}

		return result.id;
	}

	async findByEmail(email: string): Promise<User | null> {
		const [row] = await this.db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email));

		if (!row) {
			return null;
		}

		return {
			id: row.id,
			name: row.name,
			email: row.email,
			password: row.password,
			role: row.role,
			createdAt: row.createdAt,
			updatedAt: row.updatedAt ?? undefined,
		};
	}

	async findById(id: string): Promise<User | null> {
		const [row] = await this.db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, id));

		if (!row) {
			return null;
		}

		return {
			id: row.id,
			name: row.name,
			email: row.email,
			password: row.password,
			role: row.role,
			createdAt: row.createdAt,
			updatedAt: row.updatedAt ?? undefined,
		};
	}
}
