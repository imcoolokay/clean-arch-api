import { AppError } from "@/core/errors/app-error";
import type { TokenProvider } from "@/core/ports/token-provider";
import type { RefreshTokenRepository } from "@/core/repositories/refresh-token-repository";
import type { UserRepository } from "@/core/repositories/user-repository";
import type { RefreshUserTokenOutput } from "./authentication.dto";

export class RefreshUserToken {
	constructor(
		private refreshTokenRepo: RefreshTokenRepository,
		private userRepo: UserRepository,
		private tokenProvider: TokenProvider,
	) {}

	async execute(currentToken: string): Promise<RefreshUserTokenOutput | null> {
		const storedToken = await this.refreshTokenRepo.findByToken(currentToken);

		if (!storedToken) {
			throw new AppError("Invalid refresh token", 401);
		}

		if (!storedToken.isValid) {
			await this.refreshTokenRepo.revokeAllForUser(storedToken.userId);
			throw new AppError("Please login again.", 401);
		}

		if (new Date() > storedToken.expiresAt) {
			await this.refreshTokenRepo.revoke(storedToken.id);
			throw new AppError("Refresh token expired", 401);
		}

		const user = await this.userRepo.findById(storedToken.userId);

		if (!user) {
			await this.refreshTokenRepo.revokeAllForUser(storedToken.userId);
			throw new AppError("User not found", 401);
		}

		await this.refreshTokenRepo.revoke(storedToken.id);

		const newRefreshToken = await this.refreshTokenRepo.create(
			storedToken.userId,
		);

		if (!newRefreshToken) return null;

		const newAccessToken = await this.tokenProvider.generate({
			sub: user.id,
			role: user.role,
		});

		return {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken.token,
		};
	}
}
