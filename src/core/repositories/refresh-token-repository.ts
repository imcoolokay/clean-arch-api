import type { RefreshToken } from "../entities/refresh-token";

export interface RefreshTokenRepository {
	create(userId: string): Promise<RefreshToken | null>;
	findByToken(token: string): Promise<RefreshToken | null>;
	revoke(id: string): Promise<void>;
	revokeAllForUser(userId: string): Promise<void>;
}
