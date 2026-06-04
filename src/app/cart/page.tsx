'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { checkoutCart } from '@/lib/actions';
import styles from './page.module.css';

export default function CartPage() {
    const { items, total, setQty, remove, clear } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        const res = await checkoutCart(JSON.stringify(items));
        setLoading(false);
        if (!res.ok) {
            if (res.error === 'auth') {
                toast.error('Please sign in to place your order.');
                router.push('/login?redirect=/cart');
                return;
            }
            toast.error(res.error);
            return;
        }
        clear();
        toast.success('Order placed! We\'ll prepare your invoice shortly.');
        router.push('/portal/orders');
    };

    return (
        <section className="section-tight">
            <div className="container">
                <h1 className="section-title" style={{ marginBottom: '0.4rem' }}>Your cart</h1>
                <p className="lead" style={{ marginBottom: '2.5rem' }}>Review your items and check out — payment is invoiced after you order.</p>

                {items.length === 0 ? (
                    <div className={styles.empty}>
                        <ShoppingCart size={40} />
                        <h2>Your cart is empty</h2>
                        <p>Browse the store and add some supplies to get started.</p>
                        <Link href="/store" className="btn btn-primary">Go to Store <ArrowRight size={18} /></Link>
                    </div>
                ) : (
                    <div className={styles.layout}>
                        <div className={styles.items}>
                            {items.map((i) => (
                                <div key={i.name} className={styles.item}>
                                    <div className={styles.info}>
                                        <strong>{i.name}</strong>
                                        <small>${i.price.toFixed(2)} each</small>
                                    </div>
                                    <div className={styles.qty}>
                                        <button onClick={() => setQty(i.name, i.qty - 1)} aria-label="Decrease"><Minus size={15} /></button>
                                        <span>{i.qty}</span>
                                        <button onClick={() => setQty(i.name, i.qty + 1)} aria-label="Increase"><Plus size={15} /></button>
                                    </div>
                                    <span className={styles.lineTotal}>${(i.price * i.qty).toFixed(2)}</span>
                                    <button className={styles.remove} onClick={() => remove(i.name)} aria-label={`Remove ${i.name}`}>
                                        <Trash2 size={17} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <aside className={styles.summary}>
                            <h3>Order summary</h3>
                            <div className={styles.sumRow}><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
                            <div className={styles.sumRow}><span>Tax &amp; shipping</span><span>Calculated at invoicing</span></div>
                            <div className={`${styles.sumRow} ${styles.grand}`}><span>Total</span><span>${total.toFixed(2)}</span></div>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleCheckout} disabled={loading}>
                                {loading ? 'Placing order…' : <>Place order <ArrowRight size={18} /></>}
                            </button>
                            <button className={styles.clearBtn} onClick={clear}>Clear cart</button>
                        </aside>
                    </div>
                )}
            </div>
        </section>
    );
}
