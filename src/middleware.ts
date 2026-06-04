import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'c-printing-dev-secret-change-me'
);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('session')?.value;

    let role: string | null = null;
    if (token) {
        try {
            const { payload } = await jwtVerify(token, SECRET);
            role = (payload.role as string) ?? null;
        } catch {
            role = null;
        }
    }

    // Admin area — admins only.
    if (pathname.startsWith('/admin')) {
        if (!role) {
            const url = new URL('/login', request.url);
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }
        if (role !== 'admin') {
            return NextResponse.redirect(new URL('/portal', request.url));
        }
    }

    // Client portal — any signed-in user.
    if (pathname.startsWith('/portal')) {
        if (!role) {
            const url = new URL('/login', request.url);
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/portal/:path*'],
};
