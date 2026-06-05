'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { dbGet, dbRun, type User } from './db';
import { savePdf } from './storage';
import {
    hashPassword,
    verifyPassword,
    createSession,
    destroySession,
    getSession,
    getCurrentUser,
} from './auth';

export type FormState = { error?: string } | undefined;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------- Auth ----------------

export async function signupAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');

    if (!name || !email || !password) return { error: 'All fields are required.' };
    if (!emailRe.test(email)) return { error: 'Please enter a valid email address.' };
    if (password.length < 6) return { error: 'Password must be at least 6 characters.' };

    const exists = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (exists) return { error: 'An account with this email already exists.' };

    const info = await dbRun(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashPassword(password), 'client']
    );

    await createSession({ id: info.lastInsertRowid, name, email, role: 'client' });
    redirect('/portal');
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');

    if (!email || !password) return { error: 'Email and password are required.' };

    const user = await dbGet<User>('SELECT * FROM users WHERE email = ?', [email]);
    if (!user || !verifyPassword(password, user.password)) {
        return { error: 'Invalid email or password.' };
    }

    await createSession({ id: user.id, name: user.name, email: user.email, role: user.role });

    const wanted = String(formData.get('redirect') || '');
    const safe = wanted.startsWith('/') && !wanted.startsWith('//') ? wanted : '';
    redirect(safe || (user.role === 'admin' ? '/admin' : '/portal'));
}

export async function logoutAction(): Promise<void> {
    await destroySession();
    redirect('/');
}

// ---------------- Helpers ----------------

async function requireUser(): Promise<User> {
    const user = await getCurrentUser();
    if (!user) redirect('/login');
    return user;
}

async function requireAdmin(): Promise<void> {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') redirect('/login');
}

// ---------------- Client orders ----------------

export async function createPrintOrder(_prev: FormState, formData: FormData): Promise<FormState> {
    const user = await requireUser();

    const title = String(formData.get('title') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const file = formData.get('file') as File | null;

    if (!title) return { error: 'Please give your order a title.' };

    let fileName: string | null = null;
    let storedRef: string | null = null;

    if (file && file.size > 0) {
        if (file.type !== 'application/pdf') return { error: 'Only PDF files are accepted.' };
        if (file.size > 25 * 1024 * 1024) return { error: 'File is too large (max 25 MB).' };

        const bytes = Buffer.from(await file.arrayBuffer());
        storedRef = await savePdf(bytes, file.name);
        fileName = file.name;
    }

    await dbRun(
        `INSERT INTO orders (user_id, kind, title, description, file_name, file_path, amount, status, payment_status)
     VALUES (?, 'print', ?, ?, ?, ?, 0, 'pending', 'unpaid')`,
        [user.id, title, description || null, fileName, storedRef]
    );

    revalidatePath('/portal/orders');
    redirect('/portal/orders');
}

type CartItem = { name: string; price: number; qty: number };

export async function checkoutCart(
    itemsJson: string
): Promise<{ ok: true; orderId: number } | { ok: false; error: string }> {
    const session = await getSession();
    if (!session) return { ok: false, error: 'auth' };

    let items: CartItem[];
    try {
        items = JSON.parse(itemsJson);
    } catch {
        return { ok: false, error: 'Invalid cart.' };
    }
    if (!Array.isArray(items) || items.length === 0) {
        return { ok: false, error: 'Your cart is empty.' };
    }

    const total = items.reduce((sum, i) => sum + Number(i.price) * Number(i.qty), 0);
    const count = items.reduce((n, i) => n + Number(i.qty), 0);
    const title = `Store order — ${count} item${count === 1 ? '' : 's'}`;

    const info = await dbRun(
        `INSERT INTO orders (user_id, kind, title, items_json, amount, status, payment_status)
       VALUES (?, 'store', ?, ?, ?, 'pending', 'unpaid')`,
        [session.id, title, JSON.stringify(items), total]
    );

    revalidatePath('/portal/orders');
    return { ok: true, orderId: info.lastInsertRowid };
}

// ---------------- Admin mutations ----------------

const VALID_STATUS = ['pending', 'in_production', 'ready', 'completed', 'cancelled'];

export async function adminUpdateStatus(formData: FormData): Promise<void> {
    await requireAdmin();
    const id = Number(formData.get('id'));
    const status = String(formData.get('status'));
    if (id && VALID_STATUS.includes(status)) {
        await dbRun('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    }
    revalidatePath('/admin/orders');
    revalidatePath('/admin');
}

export async function adminSetAmount(formData: FormData): Promise<void> {
    await requireAdmin();
    const id = Number(formData.get('id'));
    const amount = Number(formData.get('amount'));
    if (id && amount >= 0) {
        await dbRun('UPDATE orders SET amount = ? WHERE id = ?', [amount, id]);
    }
    revalidatePath('/admin/billing');
    revalidatePath('/admin/orders');
}

export async function adminTogglePaid(formData: FormData): Promise<void> {
    await requireAdmin();
    const id = Number(formData.get('id'));
    const paid = String(formData.get('paid')) === 'true';
    if (id) {
        await dbRun('UPDATE orders SET payment_status = ? WHERE id = ?', [paid ? 'paid' : 'unpaid', id]);
    }
    revalidatePath('/admin/billing');
    revalidatePath('/admin');
}
