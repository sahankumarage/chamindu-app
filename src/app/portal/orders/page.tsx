import Link from 'next/link';
import { Package, Plus, FileText, Download } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { listOrdersByUser } from '@/lib/store';
import { money, formatDate } from '@/lib/format';
import { StatusBadge, PaymentBadge } from '@/components/StatusBadge';
import styles from '@/components/dashboard.module.css';

type CartItem = { name: string; price: number; qty: number };

export const dynamic = 'force-dynamic';

export default async function PortalOrders() {
    const user = (await getCurrentUser())!;
    const orders = listOrdersByUser(user.id);

    return (
        <>
            <div className={styles.pageHead}>
                <div>
                    <h1>My Orders</h1>
                    <p>Track every print and store order in one place.</p>
                </div>
                <Link href="/portal/orders/new" className="btn btn-primary"><Plus size={18} /> New print order</Link>
            </div>

            {orders.length === 0 ? (
                <div className={styles.panel}>
                    <div className={styles.empty}>
                        <Package size={36} />
                        <p>You haven&apos;t placed any orders yet.</p>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.2rem' }}>
                    {orders.map((o) => {
                        const items: CartItem[] = o.items_json ? JSON.parse(o.items_json) : [];
                        return (
                            <div key={o.id} className={styles.panel}>
                                <div className={styles.panelHead}>
                                    <div>
                                        <h2 style={{ fontSize: '1.05rem' }}>#{o.id} · {o.title}</h2>
                                        <small className={styles.muted}>
                                            {o.kind === 'print' ? 'Print order' : 'Store order'} · {formatDate(o.created_at)}
                                        </small>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <StatusBadge status={o.status} />
                                        <PaymentBadge status={o.payment_status} />
                                    </div>
                                </div>

                                <div style={{ padding: '1.3rem 1.5rem', display: 'grid', gap: '1rem' }}>
                                    {o.description && <p className={styles.muted}>{o.description}</p>}

                                    {items.length > 0 && (
                                        <ul style={{ listStyle: 'none', display: 'grid', gap: '0.5rem' }}>
                                            {items.map((it) => (
                                                <li key={it.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                                                    <span>{it.qty} × {it.name}</span>
                                                    <span>{money(it.price * it.qty)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                        {o.file_path ? (
                                            <a href={`/api/uploads/${o.id}`} className={styles.fileLink} target="_blank" rel="noreferrer">
                                                <FileText size={16} /> {o.file_name} <Download size={14} />
                                            </a>
                                        ) : (
                                            <span className={styles.muted} style={{ fontSize: '0.88rem' }}>
                                                {o.kind === 'print' ? 'No file attached' : `${items.length} product${items.length === 1 ? '' : 's'}`}
                                            </span>
                                        )}
                                        <strong style={{ fontSize: '1.1rem' }}>
                                            {o.amount > 0 ? money(o.amount) : <span className={styles.muted} style={{ fontWeight: 400, fontSize: '0.9rem' }}>Quote pending</span>}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}
