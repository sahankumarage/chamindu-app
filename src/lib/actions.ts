'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
    findUserByEmail,
    createUser,
    createOrder,
    findOrderById,
    updateOrderStatus,
    setOrderAmount,
    setOrderPaid,
    storeFile,
    type User,
} from './store';
import {
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

    if (findUserByEmail(email)) return { error: 'An account with this email already exists.' };

    const user = createUser(name, email, password);
    await createSession({ id: user.id, name: user.name, email: user.email, role: user.role });
    redirect('/portal');
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');

    if (!email || !password) return { error: 'Email and password are required.' };

    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
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
    let buffer: Buffer | null = null;

    if (file && file.size > 0) {
        if (file.type !== 'application/pdf') return { error: 'Only PDF files are accepted.' };
        if (file.size > 25 * 1024 * 1024) return { error: 'File is too large (max 25 MB).' };
        buffer = Buffer.from(await file.arrayBuffer());
        fileName = file.name;
    }

    const order = createOrder({
        user_id: user.id,
        kind: 'print',
        title,
        description: description || null,
        items_json: null,
        file_name: fileName,
        file_path: fileName ? `mem:${fileName}` : null,
        amount: 0,
        status: 'pending',
        payment_status: 'unpaid',
    });

    if (buffer && fileName) storeFile(order.id, fileName, buffer);

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

    const order = createOrder({
        user_id: session.id,
        kind: 'store',
        title: `Store order — ${count} item${count === 1 ? '' : 's'}`,
        description: null,
        items_json: JSON.stringify(items),
        file_name: null,
        file_path: null,
        amount: total,
        status: 'pending',
        payment_status: 'unpaid',
    });

    revalidatePath('/portal/orders');
    return { ok: true, orderId: order.id };
}

// ---------------- Admin mutations ----------------

const VALID_STATUS = ['pending', 'in_production', 'ready', 'completed', 'cancelled'];

export async function adminUpdateStatus(formData: FormData): Promise<void> {
    await requireAdmin();
    const id = Number(formData.get('id'));
    const status = String(formData.get('status'));
    if (id && VALID_STATUS.includes(status)) updateOrderStatus(id, status);
    revalidatePath('/admin/orders');
    revalidatePath('/admin');
}

export async function adminSetAmount(formData: FormData): Promise<void> {
    await requireAdmin();
    const id = Number(formData.get('id'));
    const amount = Number(formData.get('amount'));
    if (id && amount >= 0 && findOrderById(id)) setOrderAmount(id, amount);
    revalidatePath('/admin/billing');
    revalidatePath('/admin/orders');
}

export async function adminTogglePaid(formData: FormData): Promise<void> {
    await requireAdmin();
    const id = Number(formData.get('id'));
    const paid = String(formData.get('paid')) === 'true';
    if (id) setOrderPaid(id, paid);
    revalidatePath('/admin/billing');
    revalidatePath('/admin');
}
