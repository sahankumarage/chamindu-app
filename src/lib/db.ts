import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';

// Data lives in <project>/data — db file + uploaded PDFs.
const DATA_DIR = path.join(process.cwd(), 'data');
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');

function ensureDirs() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Cache the connection across hot reloads in dev.
const globalForDb = globalThis as unknown as { __cprintingDb?: DatabaseSync };

function init(): DatabaseSync {
    ensureDirs();
    const db = new DatabaseSync(path.join(DATA_DIR, 'app.db'));
    db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

    db.exec(`
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
      kind TEXT NOT NULL,                 -- 'print' | 'store'
      title TEXT NOT NULL,
      description TEXT,
      items_json TEXT,                    -- JSON cart items for store orders
      file_name TEXT,                     -- original uploaded file name
      file_path TEXT,                     -- stored file name on disk
      amount REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending',          -- pending|in_production|ready|completed|cancelled
      payment_status TEXT NOT NULL DEFAULT 'unpaid',   -- unpaid|paid
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

    // Seed default accounts once. INSERT OR IGNORE is race-safe across the
    // parallel workers Next.js spawns during build (email is UNIQUE).
    const seeds: Array<[string, string, string, 'admin' | 'client']> = [
        ['C Printing Admin', 'admin@cprinting.com', 'admin123', 'admin'],
        ['Demo Client', 'client@cprinting.com', 'client123', 'client'],
    ];
    try {
        for (const [name, email, pw, role] of seeds) {
            const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
            if (!existing) {
                db.prepare(
                    'INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
                ).run(name, email, bcrypt.hashSync(pw, 10), role);
            }
        }
    } catch {
        // Another worker seeded concurrently — safe to ignore.
    }

    // Seed a few demo orders for the demo client so the dashboards aren't empty.
    try {
        const demo = db.prepare("SELECT id FROM users WHERE email = 'client@cprinting.com'").get() as
            | { id: number }
            | undefined;
        if (demo) {
            const count = (db.prepare('SELECT COUNT(*) AS c FROM orders WHERE user_id = ?').get(demo.id) as { c: number }).c;
            if (count === 0) {
                const ins = db.prepare(
                    `INSERT INTO orders (user_id, kind, title, description, items_json, amount, status, payment_status)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
                );
                ins.run(demo.id, 'print', '500 Matte Business Cards', 'Double-sided, 350gsm matte, full color.', null, 45, 'completed', 'paid');
                ins.run(demo.id, 'print', 'A2 Event Posters ×20', 'Gloss finish, vivid color, rush turnaround.', null, 120, 'in_production', 'unpaid');
                ins.run(
                    demo.id, 'store', 'Store order — 3 items', null,
                    JSON.stringify([
                        { name: 'Premium Matte Cardstock', price: 18, qty: 2 },
                        { name: 'CMYK Ink Cartridge Set', price: 64, qty: 1 },
                    ]),
                    100, 'ready', 'unpaid'
                );
                ins.run(demo.id, 'print', 'Roll-up Banner 850×2000mm', 'Retractable stand included. Awaiting quote.', null, 0, 'pending', 'unpaid');
            }
        }
    } catch {
        // Non-fatal — demo data is best-effort.
    }

    return db;
}

export const db: DatabaseSync = globalForDb.__cprintingDb ?? init();
if (process.env.NODE_ENV !== 'production') globalForDb.__cprintingDb = db;

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
