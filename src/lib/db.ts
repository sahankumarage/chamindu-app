import fs from 'node:fs';
import path from 'node:path';
import { createClient, type Client, type InValue } from '@libsql/client';
import bcrypt from 'bcryptjs';

/**
 * Database layer backed by libSQL (Turso).
 * - In production set TURSO_DATABASE_URL (libsql://...) + TURSO_AUTH_TOKEN.
 * - With no env vars it falls back to a local file (file:./data/app.db) for dev.
 */
const url = process.env.TURSO_DATABASE_URL || 'file:./data/app.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

const globalForDb = globalThis as unknown as {
    __client?: Client;
    __ready?: Promise<void>;
};

function client(): Client {
    if (!globalForDb.__client) {
        // For a local file URL the parent directory must exist first.
        if (url.startsWith('file:')) {
            const dir = path.dirname(url.slice('file:'.length));
            if (dir && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        }
        globalForDb.__client = createClient({ url, authToken });
    }
    return globalForDb.__client;
}

async function init(): Promise<void> {
    const c = client();

    await c.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'client',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      kind TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      items_json TEXT,
      file_name TEXT,
      file_path TEXT,
      amount REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending',
      payment_status TEXT NOT NULL DEFAULT 'unpaid',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

    // Seed default accounts (idempotent).
    const seeds: Array<[string, string, string, 'admin' | 'client']> = [
        ['C Printing Admin', 'admin@cprinting.com', 'admin123', 'admin'],
        ['Demo Client', 'client@cprinting.com', 'client123', 'client'],
    ];
    for (const [name, email, pw, role] of seeds) {
        await c.execute({
            sql: 'INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            args: [name, email, bcrypt.hashSync(pw, 10), role],
        });
    }

    // Seed demo orders for the demo client so dashboards aren't empty.
    const demo = await c.execute({ sql: "SELECT id FROM users WHERE email = 'client@cprinting.com'", args: [] });
    const demoId = demo.rows[0]?.id as number | undefined;
    if (demoId != null) {
        const existing = await c.execute({ sql: 'SELECT COUNT(*) AS c FROM orders WHERE user_id = ?', args: [demoId] });
        if (Number(existing.rows[0]?.c ?? 0) === 0) {
            const rows: Array<[string, string, string | null, string | null, number, string, string]> = [
                ['print', '500 Matte Business Cards', 'Double-sided, 350gsm matte, full color.', null, 45, 'completed', 'paid'],
                ['print', 'A2 Event Posters ×20', 'Gloss finish, vivid color, rush turnaround.', null, 120, 'in_production', 'unpaid'],
                ['store', 'Store order — 3 items', null, JSON.stringify([
                    { name: 'Premium Matte Cardstock', price: 18, qty: 2 },
                    { name: 'CMYK Ink Cartridge Set', price: 64, qty: 1 },
                ]), 100, 'ready', 'unpaid'],
                ['print', 'Roll-up Banner 850×2000mm', 'Retractable stand included. Awaiting quote.', null, 0, 'pending', 'unpaid'],
            ];
            for (const [kind, title, description, items, amount, status, payment] of rows) {
                await c.execute({
                    sql: `INSERT INTO orders (user_id, kind, title, description, items_json, amount, status, payment_status)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    args: [demoId, kind, title, description, items, amount, status, payment],
                });
            }
        }
    }
}

function ensure(): Promise<void> {
    if (!globalForDb.__ready) globalForDb.__ready = init();
    return globalForDb.__ready;
}

// ---- Query helpers ----
type Args = InValue[];

export async function dbAll<T>(sql: string, args: Args = []): Promise<T[]> {
    await ensure();
    const rs = await client().execute({ sql, args });
    return rs.rows as unknown as T[];
}

export async function dbGet<T>(sql: string, args: Args = []): Promise<T | undefined> {
    const rows = await dbAll<T>(sql, args);
    return rows[0];
}

export async function dbRun(
    sql: string,
    args: Args = []
): Promise<{ lastInsertRowid: number; rowsAffected: number }> {
    await ensure();
    const rs = await client().execute({ sql, args });
    return {
        lastInsertRowid: rs.lastInsertRowid != null ? Number(rs.lastInsertRowid) : 0,
        rowsAffected: rs.rowsAffected,
    };
}

// ---- Types ----
export type Role = 'client' | 'admin';

export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
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
