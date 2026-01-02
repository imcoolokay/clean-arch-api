export interface RefreshToken {
	id: string;
	token: string;
	userId: string;
	isValid: boolean;
	expiresAt: Date;
	createdAt: Date;
}
