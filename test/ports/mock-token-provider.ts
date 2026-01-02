import type { TokenPayload, TokenProvider } from "@/core/ports/token-provider";

export class MockTokenProvider implements TokenProvider {
	async generate(payload: TokenPayload): Promise<string> {
		return JSON.stringify(payload);
	}

	async verify(token: string): Promise<TokenPayload> {
		return JSON.parse(token) as TokenPayload;
	}
}
