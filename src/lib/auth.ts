import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-fallback-min-32chars!!");

export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) {
        return null;
    }
}

// Mock auth for now
export async function getAuthUser(req: Request) {
    // In a real app, we would extract the token from cookies or Authorization header
    // For this mock, we'll just return a dummy user to allow the API to function
    return { id: 'user-1', role: 'admin' };
}