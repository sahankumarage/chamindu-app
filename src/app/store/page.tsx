import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Truck, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import Reveal from '@/components/Reveal';
import AddToCart from '@/components/AddToCart';
import CartBar from '@/components/CartBar';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Store — C Printing',
    description: 'Premium paper, inks, stationery and creative supplies. Shop quality print materials with local pickup or nationwide shipping.',
};

const categories = ['All', 'Paper', 'Inks', 'Stationery', 'Supplies'];

const products = [
    { name: 'Premium Matte Cardstock', cat: 'Paper', value: 18, unit: '/ 100 sheets', emoji: '📄', grad: 'linear-gradient(135deg,#06b6d4,#3b82f6)', badge: 'Bestseller' },
    { name: 'CMYK Ink Cartridge Set', cat: 'Inks', value: 64, unit: '/ set of 4', emoji: '🖨️', grad: 'linear-gradient(135deg,#7c3aed,#ec1e79)', badge: '' },
    { name: 'Recycled Kraft Paper', cat: 'Paper', value: 14, unit: '/ 100 sheets', emoji: '🌿', grad: 'linear-gradient(135deg,#16a34a,#06b6d4)', badge: 'Eco' },
    { name: 'Luxury Business Card Stock', cat: 'Paper', value: 22, unit: '/ 100 cards', emoji: '💳', grad: 'linear-gradient(135deg,#f59e0b,#ec1e79)', badge: '' },
    { name: 'Pigment Ink Bottle 100ml', cat: 'Inks', value: 29, unit: '/ bottle', emoji: '🎨', grad: 'linear-gradient(135deg,#ec1e79,#f6c945)', badge: '' },
    { name: 'Gel Pen Set (12 colors)', cat: 'Stationery', value: 12, unit: '/ pack', emoji: '🖊️', grad: 'linear-gradient(135deg,#3b82f6,#7c3aed)', badge: '' },
    { name: 'Hardcover Sketchbook A4', cat: 'Stationery', value: 16, unit: '/ each', emoji: '📓', grad: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', badge: '' },
    { name: 'Lamination Pouches', cat: 'Supplies', value: 11, unit: '/ 100 pcs', emoji: '✨', grad: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', badge: '' },
    { name: 'Self-Adhesive Vinyl Roll', cat: 'Supplies', value: 38, unit: '/ roll', emoji: '📜', grad: 'linear-gradient(135deg,#f6c945,#f59e0b)', badge: 'New' },
    { name: 'Glossy Photo Paper', cat: 'Paper', value: 20, unit: '/ 50 sheets', emoji: '🖼️', grad: 'linear-gradient(135deg,#06b6d4,#7c3aed)', badge: '' },
    { name: 'Precision Craft Knife', cat: 'Supplies', value: 9, unit: '/ each', emoji: '🔪', grad: 'linear-gradient(135deg,#64748b,#0ea5e9)', badge: '' },
    { name: 'Desk Planner 2026', cat: 'Stationery', value: 15, unit: '/ each', emoji: '🗓️', grad: 'linear-gradient(135deg,#ec1e79,#7c3aed)', badge: '' },
];

const perks = [
    { icon: Truck, title: 'Fast delivery', text: 'Local pickup or shipping nationwide' },
    { icon: ShieldCheck, title: 'Quality assured', text: 'Pro-grade materials, every order' },
    { icon: Tag, title: 'Bulk discounts', text: 'Better prices the more you buy' },
];

export default function StorePage() {
    return (
        <>
            <CartBar />
            <section className={styles.hero}>
                <span className="blob" style={{ background: '#f59e0b', width: 340, height: 340, top: -120, right: -60 }} />
                <span className="blob" style={{ background: '#06b6d4', width: 300, height: 300, bottom: -140, left: -80, opacity: 0.35 }} />
                <div className="container">
                    <Reveal>
                        <span className="eyebrow"><ShoppingBag size={14} /> The Store</span>
                        <h1 className="display" style={{ marginTop: '1.2rem' }}>
                            Creative supplies, <span className="gradient-text">delivered</span>
                        </h1>
                        <p className="lead" style={{ marginTop: '1.2rem' }}>
                            Stock up on premium paper, inks, stationery and everything else you need to
                            create. The same pro-grade materials we use in our own studio — now yours.
                        </p>
                    </Reveal>
                    <Reveal delay={120} className={styles.perks}>
                        {perks.map((p) => (
                            <div key={p.title} className={styles.perk}>
                                <p.icon size={22} />
                                <div>
                                    <strong>{p.title}</strong>
                                    <small>{p.text}</small>
                                </div>
                            </div>
                        ))}
                    </Reveal>
                </div>
            </section>

            <section className="section-tight">
                <div className="container">
                    <div className={styles.filterBar}>
                        <h2 className="section-title" style={{ fontSize: '1.6rem' }}>Shop products</h2>
                        <div className="chip-list">
                            {categories.map((c, i) => (
                                <span key={c} className={`chip ${i === 0 ? styles.chipActive : ''}`}>{c}</span>
                            ))}
                        </div>
                    </div>

                    <div className={`grid ${styles.productGrid}`}>
                        {products.map((p, i) => (
                            <Reveal as="article" key={p.name} delay={(i % 4) * 70}>
                                <div className={styles.product}>
                                    <div className={styles.thumb} style={{ background: p.grad }}>
                                        <span>{p.emoji}</span>
                                        {p.badge && <em className={styles.badge}>{p.badge}</em>}
                                    </div>
                                    <div className={styles.body}>
                                        <small className={styles.cat}>{p.cat}</small>
                                        <h3>{p.name}</h3>
                                        <div className={styles.priceRow}>
                                            <span className={styles.price}>${p.value}<small>{p.unit}</small></span>
                                            <AddToCart name={p.name} price={p.value} className={styles.addBtn} />
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container">
                <Reveal>
                    <div className={styles.cta}>
                        <div>
                            <h2>Need something we don&apos;t list?</h2>
                            <p>We carry far more than fits on this page. Tell us what you need and we&apos;ll source it for you.</p>
                        </div>
                        <Link href="/contact" className="btn" style={{ background: '#fff', color: 'var(--ink)' }}>
                            Ask us <ArrowRight size={18} />
                        </Link>
                    </div>
                </Reveal>
            </section>
        </>
    );
}
