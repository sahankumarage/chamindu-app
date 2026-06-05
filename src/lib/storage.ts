import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { put } from '@vercel/blob';

/**
 * PDF storage abstraction.
 * - With BLOB_READ_WRITE_TOKEN set (Vercel Blob) → files go to Blob; we store the URL.
 * - Otherwise (local dev) → files go to ./data/uploads; we store "local:<name>".
 */
const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
const LOCAL_DIR = path.join(process.cwd(), 'data', 'uploads');

export async function savePdf(buffer: Buffer, _originalName: string): Promise<string> {
    const key = `orders/${randomUUID()}.pdf`;

    if (hasBlob) {
        const blob = await put(key, buffer, {
            access: 'public',
            contentType: 'application/pdf',
        });
        return blob.url;
    }

    fs.mkdirSync(LOCAL_DIR, { recursive: true });
    const name = path.basename(key);
    fs.writeFileSync(path.join(LOCAL_DIR, name), buffer);
    return `local:${name}`;
}

/** Read a stored PDF back as a Buffer (from Blob URL or local file). */
export async function readPdf(ref: string): Promise<Buffer | null> {
    if (ref.startsWith('http://') || ref.startsWith('https://')) {
        const res = await fetch(ref);
        if (!res.ok) return null;
        return Buffer.from(await res.arrayBuffer());
    }

    const name = ref.startsWith('local:') ? ref.slice('local:'.length) : ref;
    const filePath = path.join(LOCAL_DIR, path.basename(name));
    if (!filePath.startsWith(LOCAL_DIR) || !fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath);
}
