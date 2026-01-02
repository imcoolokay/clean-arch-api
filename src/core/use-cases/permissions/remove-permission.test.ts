import { beforeEach, describe, expect, it } from "bun:test";
import { MockPermissionRepository } from "test/repositories/mock-permission-repository";
import { RemovePermission } from "./remove-permission";

describe("Remove Permission Use Case", () => {
	let permRepo: MockPermissionRepository;
	let sut: RemovePermission;

	beforeEach(() => {
		permRepo = new MockPermissionRepository();
		sut = new RemovePermission(permRepo);
	});

	it("should remove a permission from a user", async () => {
		const userId = "user-1";
		const slug = "users:delete";

		await permRepo.create({
			id: 10,
			slug,
			description: "Delete users",
			createdAt: new Date(),
		});
		await permRepo.assignToUser(userId, 10);

		await sut.execute({
			userId,
			permissionSlug: slug,
		});

		const perms = await permRepo.findAllByUserId(userId);
		expect(perms).not.toContain(slug);
	});
});
