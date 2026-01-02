import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import type { TokenPayload, TokenProvider } from "@/core/ports/token-provider";

export class JwtProvider implements TokenProvider {
	async generate(payload: TokenPayload): Promise<string> {
		return jwt.sign({ role: payload.role }, env.APP_JWT_SECRET, {
			subject: payload.sub,
			expiresIn: "1h",
		});
	}
}
