// src/utils/jwt.util.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function signToken(payload: object, expiresIn = "1h") {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken<T = any>(token: string): T {
    return jwt.verify(token, JWT_SECRET) as T;
}
