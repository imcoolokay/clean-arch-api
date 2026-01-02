import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import Fastify, { type FastifyInstance } from "fastify";
import { authGuard } from "./auth-guard";

type ErrorResponse = {
	message: string;
	error: string;
};

describe("Auth Guard", () => {
	let app: FastifyInstance;

	beforeEach(async () => {
		app = Fastify();

		await app.register(fastifyCookie);

		await app.register(fastifyJwt, {
			secret: "super-secret-test-key",
			cookie: {
				cookieName: "accessToken",
				signed: false,
			},
		});

		await app.register(authGuard);

		app.get("/private", async () => ({ status: "ok" }));
		app.get("/public", { config: { public: true } }, async () => ({
			status: "ok",
		}));

		await app.ready();
	});

	afterEach(async () => {
		await app.close();
	});

	it("should allow public routes without any token", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/public",
		});

		expect(response.statusCode).toBe(200);
	});

	it("should block private routes if cookie is missing", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/private",
		});

		expect(response.statusCode).toBe(401);

		expect(response.json() as ErrorResponse).toEqual({
			message: "Unauthorized",
			error: "Invalid or expired token",
		});
	});

	it("should allow private routes if valid token is in cookie", async () => {
		const token = app.jwt.sign({ sub: "user-1", role: "user" });

		const response = await app.inject({
			method: "GET",
			url: "/private",
			cookies: {
				accessToken: token,
			},
		});

		expect(response.statusCode).toBe(200);
	});

	it("should block if token in cookie is invalid", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/private",
			cookies: {
				accessToken: "invalid-token",
			},
		});

		expect(response.statusCode).toBe(401);
	});
});
