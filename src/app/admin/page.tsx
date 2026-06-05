import Link from 'next/link';
import { Package, Users, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { listAllOrders, listClients } from '@/lib/store';
import { money, formatDate } from '@/lib/format';
import { StatusBadge, PaymentBadge } from '@/components/StatusBadge';
import styles from '@/components/dashboard.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminOverview() {
    const allOrders = listAllOrders();
    const totalOrders = allOrders.length;
    const clients = listClients().length;
    const pending = allOrders.filter((o) => o.status === 'pending').length;
    const revenue = allOrders.filter((o) => o.payment_status === 'paid').reduce((s, o) => s + o.amount, 0);
    const due = allOrders.filter((o) => o.payment_status === 'unpaid').reduce((s, o) => s + o.amount, 0);

    const recent = allOrders.slice(0, 8);

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
