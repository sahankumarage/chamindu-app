import Link from 'next/link';
import { Check, ArrowRight, type LucideIcon } from 'lucide-react';
import Reveal from './Reveal';
import styles from './ServicePage.module.css';

export type Feature = { icon: LucideIcon; title: string; text: string };
export type Step = { title: string; text: string };
export type Offering = { title: string; text: string; tag?: string };

export type ServicePageProps = {
    eyebrow: string;
    title: string;
    accent: string; // gradient css
    accentColor: string;
    intro: string;
    heroStats: { value: string; label: string }[];
    highlights: string[];
    features: Feature[];
    offerings: Offering[];
    process: Step[];
    ctaTitle: string;
    ctaText: string;
};

export default function ServicePage(p: ServicePageProps) {
    return (
        <>
            {/* Hero */}
            <section className={styles.hero}>
                <span className="blob" style={{ background: p.accentColor, width: 380, height: 380, top: -120, right: -80 }} />
                <span className="blob" style={{ background: '#06b6d4', width: 300, height: 300, bottom: -140, left: -60, opacity: 0.35 }} />
                <div className="container">
                    <div className={styles.heroInner}>
                        <Reveal>
                            <span className="eyebrow" style={{ color: p.accentColor, background: 'rgba(0,0,0,0.04)' }}>{p.eyebrow}</span>
                            <h1 className="display" style={{ marginTop: '1.2rem' }}>
                                <span style={{ backgroundImage: p.accent, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                                    {p.title}
                                </span>
                            </h1>
                            <p className="lead" style={{ marginTop: '1.2rem' }}>{p.intro}</p>
                            <div className={styles.heroBtns}>
                                <Link href="/contact" className="btn btn-primary">Start a Project <ArrowRight size={18} /></Link>
                                <Link href="/store" className="btn btn-ghost">Browse Store</Link>
                            </div>
                        </Reveal>

                        <Reveal delay={120} className={styles.statCard}>
                            {p.heroStats.map((s) => (
                                <div key={s.label} className={styles.stat}>
                                    <span className={styles.statValue} style={{ backgroundImage: p.accent, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{s.value}</span>
                                    <span className={styles.statLabel}>{s.label}</span>
                                </div>
                            ))}
                            <div className={styles.highlights}>
                                <ul className="check-list">
                                    {p.highlights.map((h) => (
                                        <li key={h}><Check size={18} /> {h}</li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section">
                <div className="container">
                    <div className="section-head">
                        <span className="eyebrow">What you get</span>
                        <h2 className="section-title" style={{ marginTop: '0.8rem' }}>Built for quality &amp; speed</h2>
                    </div>
                    <div className="grid cols-3">
                        {p.features.map((f, i) => (
                            <Reveal as="article" key={f.title} delay={i * 80}>
                                <div className="card" style={{ height: '100%' }}>
                                    <div className="card-icon" style={{ background: p.accent }}>
                                        <f.icon size={26} />
                                    </div>
                                    <h3>{f.title}</h3>
                                    <p>{f.text}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Offerings */}
            <section className="section" style={{ background: 'var(--surface-soft)' }}>
                <div className="container">
                    <div className="section-head">
                        <span className="eyebrow">Our offerings</span>
                        <h2 className="section-title" style={{ marginTop: '0.8rem' }}>Everything under one roof</h2>
                    </div>
                    <div className="grid cols-2">
                        {p.offerings.map((o, i) => (
                            <Reveal as="article" key={o.title} delay={i * 60}>
                                <div className={styles.offering}>
                                    <div className={styles.offeringTop}>
                                        <h3>{o.title}</h3>
                                        {o.tag && <span className={styles.tag} style={{ background: p.accent }}>{o.tag}</span>}
                                    </div>
                                    <p>{o.text}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className="section">
                <div className="container">
                    <div className="section-head">
                        <span className="eyebrow">How it works</span>
                        <h2 className="section-title" style={{ marginTop: '0.8rem' }}>A simple, transparent process</h2>
                    </div>
                    <div className="grid cols-4">
                        {p.process.map((s, i) => (
                            <Reveal key={s.title} delay={i * 80}>
                                <div className={styles.step}>
                                    <span className={styles.stepNum} style={{ backgroundImage: p.accent, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                                        0{i + 1}
                                    </span>
                                    <h3>{s.title}</h3>
                                    <p>{s.text}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="container">
                <Reveal>
                    <div className={styles.cta} style={{ backgroundImage: p.accent }}>
                        <div>
                            <h2>{p.ctaTitle}</h2>
                            <p>{p.ctaText}</p>
                        </div>
                        <Link href="/contact" className={`btn ${styles.ctaBtn}`}>Request a Quote <ArrowRight size={18} /></Link>
                    </div>
                </Reveal>
            </section>
        </>
    );
}
