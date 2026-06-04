import { Receipt, DollarSign, Wallet, CheckCircle2 } from 'lucide-react';
import { db, type OrderWithUser } from '@/lib/db';
import { money, formatDate } from '@/lib/format';
import { PaymentBadge } from '@/components/StatusBadge';
import { adminSetAmount, adminTogglePaid } from '@/lib/actions';
import styles from '@/components/dashboard.module.css';

export const dynamic = 'force-dynamic';

export default function AdminBilling() {
    const orders = db
        .prepare(`
      SELECT o.*, u.name AS user_name, u.email AS user_email
      FROM orders o JOIN users u ON u.id = o.user_id
      ORDER BY o.id DESC
    `)
        .all() as OrderWithUser[];

    const revenue = (db.prepare("SELECT COALESCE(SUM(amount),0) AS s FROM orders WHERE payment_status='paid'").get() as { s: number }).s;
    const due = (db.prepare("SELECT COALESCE(SUM(amount),0) AS s FROM orders WHERE payment_status='unpaid'").get() as { s: number }).s;
    const unpaidCount = orders.filter((o) => o.payment_status === 'unpaid' && o.amount > 0).length;

    return (
        <>
            <div className={styles.pageHead}>
                <div>
                    <h1>Billing</h1>
                    <p>Set quotes, issue invoices and record payments.</p>
                </div>
            </div>

            <div className={styles.statRow} style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
                <div className={styles.statBox}>
                    <div className="icon" style={{ background: 'linear-gradient(135deg,#16a34a,#06b6d4)' }}><DollarSign size={22} /></div>
                    <div className="value">{money(revenue)}</div>
                    <div className="label">Collected revenue</div>
                </div>
                <div className={styles.statBox}>
                    <div className="icon" style={{ background: 'linear-gradient(135deg,#ec1e79,#f6c945)' }}><Wallet size={22} /></div>
                    <div className="value">{money(due)}</div>
                    <div className="label">Outstanding</div>
                </div>
                <div className={styles.statBox}>
                    <div className="icon" style={{ background: 'linear-gradient(135deg,#7c3aed,#ec1e79)' }}><Receipt size={22} /></div>
                    <div className="value">{unpaidCount}</div>
                    <div className="label">Unpaid invoices</div>
                </div>
            </div>

            <div className={styles.panel}>
                <div className={styles.panelHead}><h2>All orders &amp; invoices</h2></div>
                {orders.length === 0 ? (
                    <div className={styles.empty}><Receipt size={36} /><p>No orders to bill yet.</p></div>
                ) : (
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr><th>Order</th><th>Client</th><th>Date</th><th>Quote / Amount</th><th>Payment</th><th>Action</th></tr>
                            </thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr key={o.id}>
                                        <td><strong>#{o.id}</strong> · {o.title}</td>
                                        <td>{o.user_name}</td>
                                        <td className={styles.muted}>{formatDate(o.created_at)}</td>
                                        <td>
                                            <form action={adminSetAmount} className={styles.inlineForm}>
                                                <input type="hidden" name="id" value={o.id} />
                                                <input
                                                    type="number" name="amount" step="0.01" min="0"
                                                    defaultValue={o.amount || ''}
                                                    placeholder="0.00"
                                                    className={styles.amountInput}
                                                />
                                                <button type="submit" className={styles.miniBtn}>Save</button>
                                            </form>
                                        </td>
                                        <td><PaymentBadge status={o.payment_status} /></td>
                                        <td>
                                            <form action={adminTogglePaid}>
                                                <input type="hidden" name="id" value={o.id} />
                                                <input type="hidden" name="paid" value={o.payment_status === 'paid' ? 'false' : 'true'} />
                                                <button
                                                    type="submit"
                                                    className={styles.miniBtn}
                                                    style={o.payment_status === 'paid'
                                                        ? { background: 'var(--surface-soft)', color: 'var(--ink-soft)', border: '1px solid var(--border)' }
                                                        : { background: 'linear-gradient(135deg,#16a34a,#06b6d4)' }}
                                                >
                                                    {o.payment_status === 'paid' ? 'Mark unpaid' : 'Mark paid'}
                                                </button>
                                            </form>
                                        </td>
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
