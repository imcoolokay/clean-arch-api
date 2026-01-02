export interface RegisterUserInput {
	name: string;
	email: string;
	password: string;
}

export interface RegisterUserOutput {
	id: string;
	email: string;
	createdAt: Date;
}
