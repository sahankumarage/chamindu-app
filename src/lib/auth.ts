import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { db, type User, type Role } from './db';

const SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'c-printing-dev-secret-change-me'
);
const COOKIE = 'session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionUser = {
    id: number;
    name: string;
    email: string;
    role: Role;
};

export function hashPassword(pw: string): string {
    return bcrypt.hashSync(pw, 10);
}

export function verifyPassword(pw: string, hash: string): boolean {
    return bcrypt.compareSync(pw, hash);
}

export async function createSession(user: SessionUser): Promise<void> {
    const token = await new SignJWT({ ...user })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(SECRET);

    const store = await cookies();
    store.set(COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: MAX_AGE,
    });
}

export async function destroySession(): Promise<void> {
    const store = await cookies();
    store.delete(COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
    const store = await cookies();
    const token = store.get(COOKIE)?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return {
            id: payload.id as number,
            name: payload.name as string,
            email: payload.email as string,
            role: payload.role as Role,
        };
    } catch {
        return null;
    }
}

/** Look up the full, current user record from the DB (source of truth). */
export async function getCurrentUser(): Promise<User | null> {
    const session = await getSession();
    if (!session) return null;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(session.id) as
        | User
        | undefined;
    return user ?? null;
}
