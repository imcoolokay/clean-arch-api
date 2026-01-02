import { z } from "zod";

export const registerUserBodySchema = z.object({
	name: z.string().min(4, "Name must be at least 3 characters"),
	email: z.email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerUserResponseSchema = z.object({
	id: z.uuid(),
});

export type RegisterUserBody = z.infer<typeof registerUserBodySchema>;
