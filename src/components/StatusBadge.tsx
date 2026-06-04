import { STATUS_META, PAYMENT_META } from '@/lib/format';

export function StatusBadge({ status }: { status: string }) {
    const m = STATUS_META[status] ?? { label: status, color: '#374151', bg: '#f3f4f6' };
    return (
        <span style={badgeStyle(m.color, m.bg)}>{m.label}</span>
    );
}

export function PaymentBadge({ status }: { status: string }) {
    const m = PAYMENT_META[status] ?? PAYMENT_META.unpaid;
    return (
        <span style={badgeStyle(m.color, m.bg)}>{m.label}</span>
    );
}

function badgeStyle(color: string, bg: string): React.CSSProperties {
    return {
        display: 'inline-block',
        padding: '0.3rem 0.7rem',
        borderRadius: '999px',
        fontSize: '0.78rem',
        fontWeight: 700,
        color,
        background: bg,
        whiteSpace: 'nowrap',
    };
}
