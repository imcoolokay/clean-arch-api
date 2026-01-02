import { beforeEach, describe, expect, it } from "bun:test";
import { MockHasher } from "test/ports/mock-password-hasher";
import { MockTokenProvider } from "test/ports/mock-token-provider";
import { MockRefreshTokenRepository } from "test/repositories/mock-refresh-token-repository";
import { MockUserRepository } from "test/repositories/mock-user-repository";
import type { User } from "@/core/entities/user";
import { AuthenticateUser } from "./authenticate-user";

describe("Authenticate User Use Case", () => {
	let userRepo: MockUserRepository;
	let refreshTokenRepo: MockRefreshTokenRepository;
	let hasher: MockHasher;
	let tokenProvider: MockTokenProvider;
	let sut: AuthenticateUser;

	beforeEach(() => {
		userRepo = new MockUserRepository();
		refreshTokenRepo = new MockRefreshTokenRepository();
		hasher = new MockHasher();
		tokenProvider = new MockTokenProvider();

		sut = new AuthenticateUser(
			userRepo,
			hasher,
			tokenProvider,
			refreshTokenRepo,
		);
	});

	it("should authenticate with valid credentials", async () => {
		const hashedPassword = await hasher.hash("123456");
		const user: User = {
			id: "user-1",
			name: "John",
			email: "john@example.com",
			password: hashedPassword,
			role: "admin",
			createdAt: new Date(),
		};
		await userRepo.create(user);

		const result = await sut.execute({
			email: "john@example.com",
			password: "123456",
		});

		expect(result.accessToken).toBeDefined();
		expect(result.refreshToken).toBeDefined();

		expect(refreshTokenRepo.items).toHaveLength(1);
		expect(refreshTokenRepo.items[0]?.userId).toBe("user-1");
	});

	it("should fail with wrong password", async () => {
		const user: User = {
			id: "user-1",
			name: "John",
			email: "john@example.com",
			password: await hasher.hash("123456"),
			role: "admin",
			createdAt: new Date(),
		};
		await userRepo.create(user);

		const promise = sut.execute({
			email: "john@example.com",
			password: "wrong-password",
		});

		expect(promise).rejects.toThrow("Invalid credentials");
	});
});
