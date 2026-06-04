import { Package, FileText, Download, Mail } from 'lucide-react';
import { db, type OrderWithUser } from '@/lib/db';
import { money, formatDate, STATUS_OPTIONS, STATUS_META } from '@/lib/format';
import { StatusBadge, PaymentBadge } from '@/components/StatusBadge';
import { adminUpdateStatus } from '@/lib/actions';
import styles from '@/components/dashboard.module.css';

type CartItem = { name: string; price: number; qty: number };

export const dynamic = 'force-dynamic';

export default function AdminOrders() {
    const orders = db
        .prepare(`
      SELECT o.*, u.name AS user_name, u.email AS user_email
      FROM orders o JOIN users u ON u.id = o.user_id
      ORDER BY o.id DESC
    `)
        .all() as OrderWithUser[];

    return (
        <>
            <div className={styles.pageHead}>
                <div>
                    <h1>Orders</h1>
                    <p>Review every order, update its status and access uploaded files.</p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className={styles.panel}><div className={styles.empty}><Package size={36} /><p>No orders yet.</p></div></div>
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

                                <div style={{ padding: '1.3rem 1.5rem', display: 'grid', gap: '1.1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                                        <span className={styles.avatar} style={{ width: 36, height: 36, fontSize: '0.9rem' }}>
                                            {o.user_name.charAt(0).toUpperCase()}
                                        </span>
                                        <div>
                                            <strong style={{ fontSize: '0.95rem' }}>{o.user_name}</strong>
                                            <a href={`mailto:${o.user_email}`} className={styles.muted} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                                                <Mail size={13} /> {o.user_email}
                                            </a>
                                        </div>
                                    </div>

                                    {o.description && <p className={styles.muted}>{o.description}</p>}

                                    {items.length > 0 && (
                                        <ul style={{ listStyle: 'none', display: 'grid', gap: '0.4rem' }}>
                                            {items.map((it) => (
                                                <li key={it.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                                    <span>{it.qty} × {it.name}</span><span>{money(it.price * it.qty)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.1rem' }}>
                                        {o.file_path ? (
                                            <a href={`/api/uploads/${o.id}`} className={styles.fileLink} target="_blank" rel="noreferrer">
                                                <FileText size={16} /> {o.file_name} <Download size={14} />
                                            </a>
                                        ) : (
                                            <span className={styles.muted} style={{ fontSize: '0.88rem' }}>No file</span>
                                        )}

                                        <form action={adminUpdateStatus} className={styles.inlineForm}>
                                            <input type="hidden" name="id" value={o.id} />
                                            <select name="status" defaultValue={o.status} className={styles.select}>
                                                {STATUS_OPTIONS.map((s) => (
                                                    <option key={s} value={s}>{STATUS_META[s].label}</option>
                                                ))}
                                            </select>
                                            <button type="submit" className={styles.miniBtn}>Update status</button>
                                        </form>
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
