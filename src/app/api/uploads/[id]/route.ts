import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { dbGet, type Order } from '@/lib/db';
import { readPdf } from '@/lib/storage';

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const order = await dbGet<Order>('SELECT * FROM orders WHERE id = ?', [Number(id)]);

    if (!order || !order.file_path) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Only the owner or an admin may access the file.
    if (session.role !== 'admin' && order.user_id !== session.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await readPdf(order.file_path);
    if (!data) {
        return NextResponse.json({ error: 'File missing' }, { status: 404 });
    }

    const downloadName = (order.file_name || 'document.pdf').replace(/"/g, '');

    return new NextResponse(new Uint8Array(data), {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${downloadName}"`,
            'Cache-Control': 'private, no-store',
        },
    });
}
