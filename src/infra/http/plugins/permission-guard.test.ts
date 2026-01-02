import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import Fastify, { type FastifyInstance } from "fastify";
import { MockPermissionRepository } from "test/repositories/mock-permission-repository";
import { authGuard } from "./auth-guard";
import { permissionGuard } from "./permission-guard";

type ErrorResponse = {
	message: string;
};

describe("Permission Guard", () => {
	let app: FastifyInstance;
	let permRepo: MockPermissionRepository;

	beforeEach(async () => {
		app = Fastify();
		permRepo = new MockPermissionRepository();

		await app.register(fastifyCookie);
		await app.register(fastifyJwt, {
			secret: "test-secret",
			cookie: {
				cookieName: "accessToken",
				signed: false,
			},
		});

		await app.register(authGuard);

		await app.register(permissionGuard, {
			permissionRepository: permRepo,
		});

		app.get(
			"/dashboard",
			{ config: { permissions: ["metrics:view"] } },
			async () => ({ message: "ok" }),
		);

		app.get(
			"/settings",
			{ config: { permissions: ["settings:read", "settings:write"] } },
			async () => ({ message: "ok" }),
		);

		await app.ready();
	});

	afterEach(async () => {
		await app.close();
	});

	it("should allow 'admin' role to bypass permission checks", async () => {
		const token = app.jwt.sign({ sub: "admin-id", role: "admin" });

		const response = await app.inject({
			method: "GET",
			url: "/dashboard",
			cookies: { accessToken: token },
		});

		expect(response.statusCode).toBe(200);
	});

	it("should allow non-admin user with the correct permission", async () => {
		await permRepo.create({
			id: 10,
			slug: "metrics:view",
			description: "",
			createdAt: new Date(),
		});
		await permRepo.assignToUser("user-ok", 10);

		const token = app.jwt.sign({ sub: "user-ok", role: "user" });

		const response = await app.inject({
			method: "GET",
			url: "/dashboard",
			cookies: { accessToken: token },
		});

		expect(response.statusCode).toBe(200);
	});

	it("should block (403) user missing the permission", async () => {
		const token = app.jwt.sign({ sub: "user-blocked", role: "user" });

		const response = await app.inject({
			method: "GET",
			url: "/dashboard",
			cookies: { accessToken: token },
		});

		expect(response.statusCode).toBe(403);
		expect(response.json() as ErrorResponse).toEqual({ message: "Forbidden" });
	});

	it("should block (403) user having only partial permissions", async () => {
		await permRepo.create({
			id: 20,
			slug: "settings:read",
			description: "",
			createdAt: new Date(),
		});
		await permRepo.assignToUser("user-partial", 20);

		const token = app.jwt.sign({ sub: "user-partial", role: "user" });

		const response = await app.inject({
			method: "GET",
			url: "/settings",
			cookies: { accessToken: token },
		});

		expect(response.statusCode).toBe(403);
	});

	it("should fail (401) if authentication is missing", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/dashboard",
		});

		expect(response.statusCode).toBe(401);
	});

	it("should return (500) if repository fails unexpectedly", async () => {
		permRepo.findAllByUserId = async () => {
			throw new Error("DB Down");
		};

		const token = app.jwt.sign({ sub: "user-err", role: "user" });

		const response = await app.inject({
			method: "GET",
			url: "/dashboard",
			cookies: { accessToken: token },
		});

		expect(response.statusCode).toBe(500);
		expect(response.json() as ErrorResponse).toEqual({
			message: "Internal Server Error",
		});
	});
});
