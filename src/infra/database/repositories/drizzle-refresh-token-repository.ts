import { asc, eq, inArray } from "drizzle-orm";
import type { BunSQLDatabase } from "drizzle-orm/bun-sql";
import type { RefreshToken } from "@/core/entities/refresh-token";
import type { RefreshTokenRepository } from "@/core/repositories/refresh-token-repository";
import { refreshTokens } from "../schemas/auth";

export class DrizzleRefreshTokenRepository implements RefreshTokenRepository {
	constructor(private readonly db: BunSQLDatabase) {}

	async create(userId: string): Promise<RefreshToken | null> {
		const MAX_SESSIONS = 5;

		const userTokens = await this.db
			.select({ id: refreshTokens.id })
			.from(refreshTokens)
			.where(eq(refreshTokens.userId, userId))
			.orderBy(asc(refreshTokens.createdAt));

		if (userTokens.length >= MAX_SESSIONS) {
			const tokensToRemoveCount = userTokens.length - MAX_SESSIONS + 1;

			const idsToDelete = userTokens
				.slice(0, tokensToRemoveCount)
				.map((t) => t.id);

			if (idsToDelete.length > 0) {
				await this.db
					.delete(refreshTokens)
					.where(inArray(refreshTokens.id, idsToDelete));
			}
		}

		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);

		const [row] = await this.db
			.insert(refreshTokens)
			.values({
				userId,
				expiresAt,
				isValid: true,
			})
			.returning();

		if (!row) return null;

		return {
			id: row.id,
			token: row.token,
			userId: row.userId,
			isValid: row.isValid,
			expiresAt: row.expiresAt,
			createdAt: row.createdAt,
		};
	}

	async findByToken(token: string): Promise<RefreshToken | null> {
		const [row] = await this.db
			.select()
			.from(refreshTokens)
			.where(eq(refreshTokens.token, token))
			.limit(1);

		if (!row) return null;

		return {
			id: row.id,
			token: row.token,
			userId: row.userId,
			isValid: row.isValid,
			expiresAt: row.expiresAt,
			createdAt: row.createdAt,
		};
	}

	async revoke(id: string): Promise<void> {
		await this.db
			.update(refreshTokens)
			.set({ isValid: false })
			.where(eq(refreshTokens.id, id));
	}

	async revokeAllForUser(userId: string): Promise<void> {
		await this.db
			.update(refreshTokens)
			.set({ isValid: false })
			.where(eq(refreshTokens.userId, userId));
	}
}
