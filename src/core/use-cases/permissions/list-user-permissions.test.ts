import { beforeEach, describe, expect, it } from "bun:test";
import { MockPermissionRepository } from "test/repositories/mock-permission-repository";
import { ListUserPermissions } from "./list-user-permissions";

describe("List User Permissions Use Case", () => {
	let permRepo: MockPermissionRepository;
	let sut: ListUserPermissions;

	beforeEach(() => {
		permRepo = new MockPermissionRepository();
		sut = new ListUserPermissions(permRepo);
	});

	it("should list all permissions slugs for a user", async () => {
		const userId = "user-1";

		await permRepo.create({
			id: 1,
			slug: "read",
			description: "",
			createdAt: new Date(),
		});
		await permRepo.create({
			id: 2,
			slug: "write",
			description: "",
			createdAt: new Date(),
		});

		await permRepo.assignToUser(userId, 1);
		await permRepo.assignToUser(userId, 2);

		const result = await sut.execute({ userId });

		expect(result).toHaveLength(2);
		expect(result).toContain("read");
		expect(result).toContain("write");
	});
});
