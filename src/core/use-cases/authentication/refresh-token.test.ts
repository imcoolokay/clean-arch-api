import { beforeEach, describe, expect, it } from "bun:test";
import { MockTokenProvider } from "test/ports/mock-token-provider";
import { MockRefreshTokenRepository } from "test/repositories/mock-refresh-token-repository";
import { MockUserRepository } from "test/repositories/mock-user-repository";
import type { User } from "@/core/entities/user";
import { RefreshUserToken } from "./refresh-token";

describe("Refresh Token Use Case", () => {
	let refreshRepo: MockRefreshTokenRepository;
	let userRepo: MockUserRepository;
	let tokenProvider: MockTokenProvider;
	let sut: RefreshUserToken;

	beforeEach(() => {
		refreshRepo = new MockRefreshTokenRepository();
		userRepo = new MockUserRepository();
		tokenProvider = new MockTokenProvider();

		sut = new RefreshUserToken(refreshRepo, userRepo, tokenProvider);
	});

	it("should rotate token successfully", async () => {
		const user: User = {
			id: "user-1",
			name: "John",
			email: "john@test.com",
			password: "hash",
			role: "admin",
			createdAt: new Date(),
		};
		await userRepo.create(user);
		const oldToken = await refreshRepo.create(user.id);

		const result = await sut.execute(oldToken.token);

		expect(result).not.toBeNull();

		if (!result) {
			throw new Error("Result should not be null");
		}

		expect(result.accessToken).toBeDefined();
		expect(result.refreshToken).not.toEqual(oldToken.token);

		const oldTokenCheck = await refreshRepo.findByToken(oldToken.token);
		expect(oldTokenCheck?.isValid).toBe(false);

		const newTokenCheck = await refreshRepo.findByToken(result.refreshToken);
		expect(newTokenCheck?.isValid).toBe(true);
	});

	it("should block token reuse", async () => {
		const user: User = {
			id: "user-1",
			name: "John",
			email: "john@test.com",
			password: "hash",
			role: "admin",
			createdAt: new Date(),
		};
		await userRepo.create(user);
		const token = await refreshRepo.create(user.id);

		token.isValid = false;

		const promise = sut.execute(token.token);
		expect(promise).rejects.toThrow("Please login again");
	});
});
