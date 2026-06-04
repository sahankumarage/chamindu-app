import { Receipt, Wallet, CheckCircle2 } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { db, type Order } from '@/lib/db';
import { money, formatDate } from '@/lib/format';
import { PaymentBadge } from '@/components/StatusBadge';
import styles from '@/components/dashboard.module.css';

export const dynamic = 'force-dynamic';

export default async function PortalBilling() {
    const user = (await getCurrentUser())!;
    const invoices = db
        .prepare('SELECT * FROM orders WHERE user_id = ? AND amount > 0 ORDER BY id DESC')
        .all(user.id) as Order[];

    const due = invoices.filter((o) => o.payment_status === 'unpaid').reduce((s, o) => s + o.amount, 0);
    const paid = invoices.filter((o) => o.payment_status === 'paid').reduce((s, o) => s + o.amount, 0);

    return (
        <>
            <div className={styles.pageHead}>
                <div>
                    <h1>Billing</h1>
                    <p>Your invoices and payment history.</p>
                </div>
            </div>

            <div className={styles.statRow} style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
                <div className={styles.statBox}>
                    <div className="icon" style={{ background: 'linear-gradient(135deg,#ec1e79,#f6c945)' }}><Wallet size={22} /></div>
                    <div className="value">{money(due)}</div>
                    <div className="label">Outstanding balance</div>
                </div>
                <div className={styles.statBox}>
                    <div className="icon" style={{ background: 'linear-gradient(135deg,#16a34a,#06b6d4)' }}><CheckCircle2 size={22} /></div>
                    <div className="value">{money(paid)}</div>
                    <div className="label">Total paid</div>
                </div>
                <div className={styles.statBox}>
                    <div className="icon" style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)' }}><Receipt size={22} /></div>
                    <div className="value">{invoices.length}</div>
                    <div className="label">Invoices</div>
                </div>
            </div>

            <div className={styles.panel}>
                <div className={styles.panelHead}><h2>Invoices</h2></div>
                {invoices.length === 0 ? (
                    <div className={styles.empty}>
                        <Receipt size={36} />
                        <p>No invoices yet. Once we quote an order, it&apos;ll appear here.</p>
                    </div>
                ) : (
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr><th>Invoice</th><th>Order</th><th>Date</th><th>Amount</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {invoices.map((o) => (
                                    <tr key={o.id}>
                                        <td><strong>INV-{String(o.id).padStart(4, '0')}</strong></td>
                                        <td>{o.title}</td>
                                        <td className={styles.muted}>{formatDate(o.created_at)}</td>
                                        <td><strong>{money(o.amount)}</strong></td>
                                        <td><PaymentBadge status={o.payment_status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {due > 0 && (
                    <div style={{ padding: '1.2rem 1.5rem', borderTop: '1px solid var(--border)', color: 'var(--muted)', fontSize: '0.9rem' }}>
                        💳 To settle your balance, visit us in store or contact us — online payments coming soon.
                    </div>
                )}
            </div>
        </>
    );
}
