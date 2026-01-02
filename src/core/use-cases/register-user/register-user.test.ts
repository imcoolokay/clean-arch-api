import { beforeEach, describe, expect, it } from "bun:test";
import { MockHasher } from "test/ports/mock-password-hasher";
import { MockUserRepository } from "test/repositories/mock-user-repository";
import { RegisterUser } from "./register-user";

describe("Register User Use Case", () => {
	let userRepo: MockUserRepository;
	let hasher: MockHasher;
	let sut: RegisterUser;

	beforeEach(() => {
		userRepo = new MockUserRepository();
		hasher = new MockHasher();
		sut = new RegisterUser(userRepo, hasher);
	});

	it("should be able to register a new user", async () => {
		const result = await sut.execute({
			name: "John Doe",
			email: "john@example.com",
			password: "123",
		});

		expect(result.id).toBeDefined();

		const createdUser = await userRepo.findByEmail("john@example.com");
		expect(createdUser).not.toBeNull();
	});

	it("should not be able to register with duplicate email", async () => {
		await sut.execute({
			name: "First John",
			email: "same@example.com",
			password: "123",
		});

		const promise = sut.execute({
			name: "Second John",
			email: "same@example.com",
			password: "123",
		});

		expect(promise).rejects.toThrow("User already exists");
	});
});
