import { beforeEach, describe, expect, it } from "bun:test";
import { MockPermissionRepository } from "test/repositories/mock-permission-repository";
import { MockUserRepository } from "test/repositories/mock-user-repository";
import type { User } from "@/core/entities/user";
import { AssignPermission } from "./assign-permission";

describe("Assign Permission Use Case", () => {
	let permRepo: MockPermissionRepository;
	let userRepo: MockUserRepository;
	let sut: AssignPermission;

	beforeEach(() => {
		permRepo = new MockPermissionRepository();
		userRepo = new MockUserRepository();
		sut = new AssignPermission(permRepo, userRepo);
	});

	it("should assign a permission to a user", async () => {
		const user: User = {
			id: "user-1",
			name: "John",
			email: "john@test.com",
			password: "hash",
			role: "admin",
			createdAt: new Date(),
		};
		await userRepo.create(user);

		await permRepo.create({
			id: 10,
			slug: "users:create",
			description: "Create users",
			createdAt: new Date(),
		});

		await sut.execute({
			userId: user.id,
			permissionSlug: "users:create",
		});

		const userPerms = await permRepo.findAllByUserId(user.id);
		expect(userPerms).toContain("users:create");
	});
});
