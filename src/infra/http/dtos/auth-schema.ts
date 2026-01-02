import { z } from "zod";

export const loginSchema = z.object({
	email: z.email(),
	password: z.string(),
});

export const registerSchema = z.object({
	name: z.string().min(3),
	email: z.email(),
	password: z.string().min(6),
});

export type LoginBody = z.infer<typeof loginSchema>;
export type RegisterBody = z.infer<typeof registerSchema>;
