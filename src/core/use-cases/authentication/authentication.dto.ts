export interface AuthenticateUserInput {
	email: string;
	password: string;
}
export interface AuthenticateUserOutput {
	accessToken: string;
	refreshToken: string;
}

export interface RefreshUserTokenOutput {
	accessToken: string;
	refreshToken: string;
}
