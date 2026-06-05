import { Users, Mail } from 'lucide-react';
import { listClients } from '@/lib/store';
import { money, formatDate } from '@/lib/format';
import styles from '@/components/dashboard.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminClients() {
    const clients = listClients();

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
