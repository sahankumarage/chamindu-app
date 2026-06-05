import Link from 'next/link';
import { Package, Users, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { dbGet, dbAll, type OrderWithUser } from '@/lib/db';
import { money, formatDate } from '@/lib/format';
import { StatusBadge, PaymentBadge } from '@/components/StatusBadge';
import styles from '@/components/dashboard.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminOverview() {
    const totalOrders = (await dbGet<{ c: number }>('SELECT COUNT(*) AS c FROM orders'))!.c;
    const clients = (await dbGet<{ c: number }>("SELECT COUNT(*) AS c FROM users WHERE role = 'client'"))!.c;
    const pending = (await dbGet<{ c: number }>("SELECT COUNT(*) AS c FROM orders WHERE status = 'pending'"))!.c;
    const revenue = (await dbGet<{ s: number }>("SELECT COALESCE(SUM(amount),0) AS s FROM orders WHERE payment_status = 'paid'"))!.s;
    const due = (await dbGet<{ s: number }>("SELECT COALESCE(SUM(amount),0) AS s FROM orders WHERE payment_status = 'unpaid'"))!.s;

    const recent = await dbAll<OrderWithUser>(`
      SELECT o.*, u.name AS user_name, u.email AS user_email
      FROM orders o JOIN users u ON u.id = o.user_id
      ORDER BY o.id DESC LIMIT 8
    `);

    const stats = [
        { icon: Package, value: String(totalOrders), label: 'Total orders', grad: 'linear-gradient(135deg,#06b6d4,#3b82f6)' },
        { icon: Clock, value: String(pending), label: 'Pending', grad: 'linear-gradient(135deg,#7c3aed,#ec1e79)' },
        { icon: DollarSign, value: money(revenue), label: 'Revenue (paid)', grad: 'linear-gradient(135deg,#16a34a,#06b6d4)' },
        { icon: Users, value: String(clients), label: 'Clients', grad: 'linear-gradient(135deg,#f59e0b,#ec1e79)' },
    ];

    return (
        <>
            <div className={styles.pageHead}>
                <div>
                    <h1>Overview</h1>
                    <p>A snapshot of orders, revenue and clients.</p>
                </div>
            </div>

            <div className={styles.statRow}>
                {stats.map((s) => (
                    <div key={s.label} className={styles.statBox}>
                        <div className="icon" style={{ background: s.grad }}><s.icon size={22} /></div>
                        <div className="value">{s.value}</div>
                        <div className="label">{s.label}</div>
                    </div>
                ))}
            </div>

            {due > 0 && (
                <div style={{ marginBottom: '2rem', background: '#fef3c7', border: '1px solid #fde68a', color: '#92600a', padding: '1rem 1.3rem', borderRadius: 'var(--radius-sm)', fontWeight: 500 }}>
                    💰 {money(due)} in outstanding invoices awaiting payment.
                </div>
            )}

            <div className={styles.panel}>
                <div className={styles.panelHead}>
                    <h2>Latest orders</h2>
                    <Link href="/admin/orders" className={styles.fileLink}>Manage orders <ArrowRight size={15} /></Link>
                </div>
                {recent.length === 0 ? (
                    <div className={styles.empty}><Package size={36} /><p>No orders yet.</p></div>
                ) : (
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr><th>Order</th><th>Client</th><th>Type</th><th>Date</th><th>Status</th><th>Amount</th><th>Payment</th></tr>
                            </thead>
                            <tbody>
                                {recent.map((o) => (
                                    <tr key={o.id}>
                                        <td><strong>#{o.id}</strong> · {o.title}</td>
                                        <td>{o.user_name}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{o.kind}</td>
                                        <td className={styles.muted}>{formatDate(o.created_at)}</td>
                                        <td><StatusBadge status={o.status} /></td>
                                        <td>{o.amount > 0 ? money(o.amount) : <span className={styles.muted}>TBD</span>}</td>
                                        <td><PaymentBadge status={o.payment_status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
