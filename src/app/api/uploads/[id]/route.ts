import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { getSession } from '@/lib/auth';
import { db, UPLOAD_DIR, type Order } from '@/lib/db';

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(Number(id)) as
        | Order
        | undefined;

    if (!order || !order.file_path) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Only the owner or an admin may access the file.
    if (session.role !== 'admin' && order.user_id !== session.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Guard against path traversal — only allow the stored basename.
    const safeName = path.basename(order.file_path);
    const filePath = path.join(UPLOAD_DIR, safeName);
    if (!filePath.startsWith(UPLOAD_DIR) || !fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'File missing' }, { status: 404 });
    }

    const data = fs.readFileSync(filePath);
    const downloadName = (order.file_name || 'document.pdf').replace(/"/g, '');

    return new NextResponse(new Uint8Array(data), {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${downloadName}"`,
            'Cache-Control': 'private, no-store',
        },
    });
}
