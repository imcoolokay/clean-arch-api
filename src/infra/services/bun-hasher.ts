import type { PasswordHasher } from "@/core/ports/password-hasher";

export class BunHasher implements PasswordHasher {
	async hash(password: string): Promise<string> {
		return Bun.password.hash(password, { algorithm: "bcrypt", cost: 12 });
	}
	async compare(plain: string, hashed: string): Promise<boolean> {
		return Bun.password.verify(plain, hashed);
	}
}
