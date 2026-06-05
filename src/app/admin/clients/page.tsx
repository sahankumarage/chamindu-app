import { Users, Mail } from 'lucide-react';
import { dbAll } from '@/lib/db';
import { money, formatDate } from '@/lib/format';
import styles from '@/components/dashboard.module.css';

export const dynamic = 'force-dynamic';

type ClientRow = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    order_count: number;
    total_spent: number;
    outstanding: number;
};

export default async function AdminClients() {
    const clients = await dbAll<ClientRow>(`
      SELECT
        u.id, u.name, u.email, u.created_at,
        COUNT(o.id) AS order_count,
        COALESCE(SUM(CASE WHEN o.payment_status = 'paid' THEN o.amount ELSE 0 END), 0) AS total_spent,
        COALESCE(SUM(CASE WHEN o.payment_status = 'unpaid' THEN o.amount ELSE 0 END), 0) AS outstanding
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.id
      WHERE u.role = 'client'
      GROUP BY u.id
      ORDER BY u.id DESC
    `);

    return (
        <>
            <div className={styles.pageHead}>
                <div>
                    <h1>Clients</h1>
                    <p>Everyone with a C Printing account.</p>
                </div>
            </div>

            <div className={styles.panel}>
                <div className={styles.panelHead}><h2>{clients.length} client{clients.length === 1 ? '' : 's'}</h2></div>
                {clients.length === 0 ? (
                    <div className={styles.empty}><Users size={36} /><p>No clients have signed up yet.</p></div>
                ) : (
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr><th>Client</th><th>Email</th><th>Joined</th><th>Orders</th><th>Spent</th><th>Outstanding</th></tr>
                            </thead>
                            <tbody>
                                {clients.map((c) => (
                                    <tr key={c.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                                                <span className={styles.avatar} style={{ width: 36, height: 36, fontSize: '0.9rem' }}>
                                                    {c.name.charAt(0).toUpperCase()}
                                                </span>
                                                <strong>{c.name}</strong>
                                            </div>
                                        </td>
                                        <td>
                                            <a href={`mailto:${c.email}`} className={styles.fileLink} style={{ fontWeight: 400 }}>
                                                <Mail size={14} /> {c.email}
                                            </a>
                                        </td>
                                        <td className={styles.muted}>{formatDate(c.created_at)}</td>
                                        <td>{c.order_count}</td>
                                        <td><strong>{money(c.total_spent)}</strong></td>
                                        <td>{c.outstanding > 0 ? <span style={{ color: '#b45309', fontWeight: 600 }}>{money(c.outstanding)}</span> : <span className={styles.muted}>—</span>}</td>
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
