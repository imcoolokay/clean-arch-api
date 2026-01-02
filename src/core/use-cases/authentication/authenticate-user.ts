import { AppError } from "@/core/errors/app-error";
import type { PasswordHasher } from "@/core/ports/password-hasher";
import type { TokenProvider } from "@/core/ports/token-provider";
import type { RefreshTokenRepository } from "@/core/repositories/refresh-token-repository";
import type { UserRepository } from "@/core/repositories/user-repository";
import type {
	AuthenticateUserInput,
	AuthenticateUserOutput,
} from "./authentication.dto";

export class AuthenticateUser {
	constructor(
		private userRepo: UserRepository,
		private hasher: PasswordHasher,
		private tokenProvider: TokenProvider,
		private refreshTokenRepo: RefreshTokenRepository,
	) {}

	async execute(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
		const user = await this.userRepo.findByEmail(input.email);

		if (!user) {
			throw new AppError("Invalid credentials", 401);
		}

		const passwordMatch = await this.hasher.compare(
			input.password,
			user.password,
		);

		if (!passwordMatch) {
			throw new AppError("Invalid credentials", 401);
		}

		const accessToken = await this.tokenProvider.generate({
			sub: user.id,
			role: user.role,
		});

		const refreshToken = await this.refreshTokenRepo.create(user.id);

		if (!refreshToken) {
			throw new AppError("Failed to create refresh token", 500);
		}

		return { accessToken, refreshToken: refreshToken.token };
	}
}
