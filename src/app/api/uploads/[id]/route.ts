import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { findOrderById, getFile } from '@/lib/store';

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const orderId = Number(id);
    const order = findOrderById(orderId);

    if (!order || !order.file_name) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Only the owner or an admin may access the file.
    if (session.role !== 'admin' && order.user_id !== session.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const stored = getFile(orderId);
    if (!stored) {
        // File metadata exists but the bytes aren't in memory (e.g. after a
        // server restart in this no-database demo).
        return NextResponse.json({ error: 'File no longer available (demo mode).' }, { status: 410 });
    }

    const downloadName = stored.name.replace(/"/g, '');
    return new NextResponse(new Uint8Array(stored.buffer), {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${downloadName}"`,
            'Cache-Control': 'private, no-store',
        },
    });
}
