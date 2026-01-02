export type UserRole = "user" | "admin";
export type UserStatus = "active" | "inactive";

export interface User {
	id: string;
	name: string;
	email: string;
	password: string;
	role: UserRole;
	createdAt: Date;
	updatedAt?: Date;
}
