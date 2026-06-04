export function money(n: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export function formatDate(iso: string): string {
    // SQLite datetime('now') returns "YYYY-MM-DD HH:MM:SS" in UTC.
    const d = new Date(iso.replace(' ', 'T') + 'Z');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pending', color: '#92600a', bg: '#fef3c7' },
    in_production: { label: 'In Production', color: '#1e40af', bg: '#dbeafe' },
    ready: { label: 'Ready', color: '#5b21b6', bg: '#ede9fe' },
    completed: { label: 'Completed', color: '#166534', bg: '#dcfce7' },
    cancelled: { label: 'Cancelled', color: '#991b1b', bg: '#fee2e2' },
};

export const PAYMENT_META: Record<string, { label: string; color: string; bg: string }> = {
    paid: { label: 'Paid', color: '#166534', bg: '#dcfce7' },
    unpaid: { label: 'Unpaid', color: '#92600a', bg: '#fef3c7' },
};

export const STATUS_OPTIONS = ['pending', 'in_production', 'ready', 'completed', 'cancelled'];
