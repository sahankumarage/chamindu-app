import Link from 'next/link';
import { Package, Factory, Wallet, CheckCircle2, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { db, type Order } from '@/lib/db';
import { money, formatDate } from '@/lib/format';
import { StatusBadge, PaymentBadge } from '@/components/StatusBadge';
import styles from '@/components/dashboard.module.css';

export const dynamic = 'force-dynamic';

export default async function PortalDashboard() {
    const user = (await getCurrentUser())!;
    const orders = db
        .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC')
        .all(user.id) as Order[];

    const inProduction = orders.filter((o) => o.status === 'in_production').length;
    const completed = orders.filter((o) => o.status === 'completed').length;
    const due = orders
        .filter((o) => o.payment_status === 'unpaid' && o.amount > 0)
        .reduce((s, o) => s + o.amount, 0);

    const stats = [
        { icon: Package, value: String(orders.length), label: 'Total orders', grad: 'linear-gradient(135deg,#06b6d4,#3b82f6)' },
        { icon: Factory, value: String(inProduction), label: 'In production', grad: 'linear-gradient(135deg,#7c3aed,#ec1e79)' },
        { icon: Wallet, value: money(due), label: 'Amount due', grad: 'linear-gradient(135deg,#ec1e79,#f6c945)' },
        { icon: CheckCircle2, value: String(completed), label: 'Completed', grad: 'linear-gradient(135deg,#16a34a,#06b6d4)' },
    ];

    const recent = orders.slice(0, 5);

    return (
        <>
            <div className={styles.pageHead}>
                <div>
                    <h1>Welcome back, {user.name.split(' ')[0]} 👋</h1>
                    <p>Here&apos;s what&apos;s happening with your orders.</p>
                </div>
                <Link href="/portal/orders/new" className="btn btn-primary"><Plus size={18} /> New print order</Link>
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

            <div className={styles.panel}>
                <div className={styles.panelHead}>
                    <h2>Recent orders</h2>
                    <Link href="/portal/orders" className={styles.fileLink}>View all <ArrowRight size={15} /></Link>
                </div>
                {recent.length === 0 ? (
                    <div className={styles.empty}>
                        <Package size={36} />
                        <p>No orders yet. Start your first print order or shop the store.</p>
                        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', marginTop: '1rem' }}>
                            <Link href="/portal/orders/new" className="btn btn-primary"><Plus size={18} /> New print order</Link>
                            <Link href="/store" className="btn btn-ghost"><ShoppingBag size={18} /> Shop store</Link>
                        </div>
                    </div>
                ) : (
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Order</th><th>Type</th><th>Date</th><th>Status</th><th>Amount</th><th>Payment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent.map((o) => (
                                    <tr key={o.id}>
                                        <td><strong>#{o.id}</strong> · {o.title}</td>
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
