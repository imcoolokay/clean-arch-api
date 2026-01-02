import type { User } from "@/core/entities/user";
import { AppError } from "@/core/errors/app-error";
import type { PasswordHasher } from "@/core/ports/password-hasher";
import type { UserRepository } from "@/core/repositories/user-repository";
import type {
	RegisterUserInput,
	RegisterUserOutput,
} from "./register-user.dto";

export class RegisterUser {
	constructor(
		private userRepo: UserRepository,
		private hasher: PasswordHasher,
	) {}

	async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
		const existingUser = await this.userRepo.findByEmail(input.email);

		if (existingUser) {
			throw new AppError("User already exists");
		}

		const user: User = {
			id: crypto.randomUUID(),
			name: input.name,
			email: input.email,
			password: await this.hasher.hash(input.password),
			role: "user",
			createdAt: new Date(),
		};

		await this.userRepo.create(user);

		return {
			id: user.id,
			email: user.email,
			createdAt: user.createdAt,
		};
	}
}
