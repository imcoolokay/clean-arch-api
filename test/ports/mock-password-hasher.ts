import type { PasswordHasher } from "@/core/ports/password-hasher";

export class MockHasher implements PasswordHasher {
	async hash(plain: string): Promise<string> {
		return plain.concat("-hashed");
	}

	async compare(plain: string, hash: string): Promise<boolean> {
		return plain.concat("-hashed") === hash;
	}
}
