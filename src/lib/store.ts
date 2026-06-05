/**
 * In-memory data store (no database).
 *
 * Hardcoded accounts + demo data so the portal/admin work without any external
 * service. NOTE: data lives in memory only — new signups/orders persist while
 * the server instance is warm but reset on restart (and aren't shared between
 * serverless instances). Swap this module for a real DB to make it permanent.
 */

export type Role = 'client' | 'admin';

export type User = {
    id: number;
    name: string;
    email: string;
    password: string; // plaintext — demo only
    role: Role;
    created_at: string;
};

export type Order = {
    id: number;
    user_id: number;
    kind: 'print' | 'store';
    title: string;
    description: string | null;
    items_json: string | null;
    file_name: string | null;
    file_path: string | null;
    amount: number;
    status: string;
    payment_status: 'unpaid' | 'paid';
    created_at: string;
};

export type OrderWithUser = Order & { user_name: string; user_email: string };

type Store = {
    users: User[];
    orders: Order[];
    files: Map<number, { name: string; buffer: Buffer }>;
    nextUserId: number;
    nextOrderId: number;
};

const globalForStore = globalThis as unknown as { __store?: Store };

function seed(): Store {
    const users: User[] = [
        { id: 1, name: 'C Printing Admin', email: 'admin@cprinting.com', password: 'admin123', role: 'admin', created_at: '2026-01-05 09:00:00' },
        { id: 2, name: 'Demo Client', email: 'client@cprinting.com', password: 'client123', role: 'client', created_at: '2026-02-12 10:30:00' },
    ];

    const orders: Order[] = [
        { id: 1, user_id: 2, kind: 'print', title: '500 Matte Business Cards', description: 'Double-sided, 350gsm matte, full color.', items_json: null, file_name: null, file_path: null, amount: 45, status: 'completed', payment_status: 'paid', created_at: '2026-03-01 11:15:00' },
        { id: 2, user_id: 2, kind: 'print', title: 'A2 Event Posters ×20', description: 'Gloss finish, vivid color, rush turnaround.', items_json: null, file_name: null, file_path: null, amount: 120, status: 'in_production', payment_status: 'unpaid', created_at: '2026-04-18 14:05:00' },
        {
            id: 3, user_id: 2, kind: 'store', title: 'Store order — 3 items', description: null,
            items_json: JSON.stringify([
                { name: 'Premium Matte Cardstock', price: 18, qty: 2 },
                { name: 'CMYK Ink Cartridge Set', price: 64, qty: 1 },
            ]),
            file_name: null, file_path: null, amount: 100, status: 'ready', payment_status: 'unpaid', created_at: '2026-05-02 09:40:00',
        },
        { id: 4, user_id: 2, kind: 'print', title: 'Roll-up Banner 850×2000mm', description: 'Retractable stand included. Awaiting quote.', items_json: null, file_name: null, file_path: null, amount: 0, status: 'pending', payment_status: 'unpaid', created_at: '2026-05-28 16:20:00' },
    ];

    return { users, orders, files: new Map(), nextUserId: 3, nextOrderId: 5 };
}

function store(): Store {
    if (!globalForStore.__store) globalForStore.__store = seed();
    return globalForStore.__store;
}

function now(): string {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

// ---------------- Users ----------------

export function findUserByEmail(email: string): User | undefined {
    const e = email.trim().toLowerCase();
    return store().users.find((u) => u.email.toLowerCase() === e);
}

export function findUserById(id: number): User | undefined {
    return store().users.find((u) => u.id === id);
}

export function createUser(name: string, email: string, password: string): User {
    const s = store();
    const user: User = {
        id: s.nextUserId++,
        name,
        email: email.trim().toLowerCase(),
        password,
        role: 'client',
        created_at: now(),
    };
    s.users.push(user);
    return user;
}

// ---------------- Orders ----------------

export function listOrdersByUser(userId: number): Order[] {
    return store().orders.filter((o) => o.user_id === userId).sort((a, b) => b.id - a.id);
}

export function listAllOrders(): OrderWithUser[] {
    const s = store();
    return s.orders
        .slice()
        .sort((a, b) => b.id - a.id)
        .map((o) => {
            const u = s.users.find((x) => x.id === o.user_id);
            return { ...o, user_name: u?.name ?? 'Unknown', user_email: u?.email ?? '' };
        });
}

export function findOrderById(id: number): Order | undefined {
    return store().orders.find((o) => o.id === id);
}

export function createOrder(o: Omit<Order, 'id' | 'created_at'>): Order {
    const s = store();
    const order: Order = { ...o, id: s.nextOrderId++, created_at: now() };
    s.orders.push(order);
    return order;
}

export function updateOrderStatus(id: number, status: string): void {
    const o = findOrderById(id);
    if (o) o.status = status;
}

export function setOrderAmount(id: number, amount: number): void {
    const o = findOrderById(id);
    if (o) o.amount = amount;
}

export function setOrderPaid(id: number, paid: boolean): void {
    const o = findOrderById(id);
    if (o) o.payment_status = paid ? 'paid' : 'unpaid';
}

// ---------------- Clients (admin) ----------------

export type ClientRow = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    order_count: number;
    total_spent: number;
    outstanding: number;
};

export function listClients(): ClientRow[] {
    const s = store();
    return s.users
        .filter((u) => u.role === 'client')
        .sort((a, b) => b.id - a.id)
        .map((u) => {
            const theirs = s.orders.filter((o) => o.user_id === u.id);
            return {
                id: u.id,
                name: u.name,
                email: u.email,
                created_at: u.created_at,
                order_count: theirs.length,
                total_spent: theirs.filter((o) => o.payment_status === 'paid').reduce((t, o) => t + o.amount, 0),
                outstanding: theirs.filter((o) => o.payment_status === 'unpaid').reduce((t, o) => t + o.amount, 0),
            };
        });
}

// ---------------- Uploaded files (in-memory) ----------------

export function storeFile(orderId: number, name: string, buffer: Buffer): void {
    store().files.set(orderId, { name, buffer });
}

export function getFile(orderId: number): { name: string; buffer: Buffer } | undefined {
    return store().files.get(orderId);
}
