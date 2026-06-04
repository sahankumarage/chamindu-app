'use client';

import Link from 'next/link';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from './CartContext';
import styles from './CartBar.module.css';

export default function CartBar() {
    const { count, total } = useCart();
    if (count === 0) return null;

    return (
        <Link href="/cart" className={styles.bar}>
            <span className={styles.left}>
                <ShoppingCart size={20} />
                <strong>{count}</strong> item{count === 1 ? '' : 's'} · ${total.toFixed(2)}
            </span>
            <span className={styles.right}>View cart <ArrowRight size={16} /></span>
        </Link>
    );
}
