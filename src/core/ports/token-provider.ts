export interface TokenPayload {
	sub: string;
	role: string;
}

export interface TokenProvider {
	generate(payload: TokenPayload): Promise<string>;
}
