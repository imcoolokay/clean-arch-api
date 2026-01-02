import type { RefreshToken } from "@/core/entities/refresh-token";
import type { RefreshTokenRepository } from "@/core/repositories/refresh-token-repository";

export class MockRefreshTokenRepository implements RefreshTokenRepository {
	public items: RefreshToken[] = [];

	async create(userId: string): Promise<RefreshToken> {
		const token: RefreshToken = {
			id: crypto.randomUUID(),
			token: crypto.randomUUID(),
			userId,
			isValid: true,
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
			createdAt: new Date(),
		};

		this.items.push(token);
		return token;
	}

	async findByToken(token: string): Promise<RefreshToken | null> {
		return this.items.find((item) => item.token === token) || null;
	}

	async revoke(id: string): Promise<void> {
		const item = this.items.find((token) => token.id === id);

		if (item) {
			item.isValid = false;
		}
	}

	async revokeAllForUser(userId: string): Promise<void> {
		this.items.forEach((item) => {
			if (item.userId === userId) {
				item.isValid = false;
			}
		});
	}
}
