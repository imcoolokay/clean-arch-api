import { z } from "zod";

const envSchema = z.object({
	APP_ENV: z.enum(["development", "test", "production"]).default("development"),
	APP_PORT: z.coerce.number().default(3000),
	APP_DATABASE_URL: z.url(),
	APP_JWT_SECRET: z.string().min(32).max(128),
	APP_COOKIE_SECRET: z.string().min(32).max(128),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
	console.error("Invalid environment variables:", z.treeifyError(_env.error));
	process.exit(1);
}

export const env = _env.data;
