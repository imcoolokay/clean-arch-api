import type { User } from "@/core/entities/user";
import type { UserRepository } from "@/core/repositories/user-repository";

export class MockUserRepository implements UserRepository {
	public items: User[] = [];

	async create(data: User): Promise<string> {
		this.items.push(data);
		return data.id;
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.items.find((user) => user.email === email) || null;
	}

	async findById(id: string): Promise<User | null> {
		return this.items.find((user) => user.id === id) || null;
	}
}
