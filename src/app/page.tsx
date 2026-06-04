import Link from 'next/link';
import {
    Printer, PenTool, Megaphone, ShoppingBag,
    ArrowRight, Star, Sparkles, Clock, Award, Leaf, Check,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import styles from './page.module.css';

const services = [
    {
        href: '/services/printing',
        icon: Printer,
        title: 'Printing',
        text: 'Business cards, brochures, flyers, large-format banners and more — sharp, vivid and on time.',
        grad: 'linear-gradient(135deg,#06b6d4,#3b82f6)',
    },
    {
        href: '/services/designing',
        icon: PenTool,
        title: 'Designing',
        text: 'Logos, branding, packaging and layouts crafted by designers who care about every pixel.',
        grad: 'linear-gradient(135deg,#7c3aed,#ec1e79)',
    },
    {
        href: '/services/advertising',
        icon: Megaphone,
        title: 'Advertising',
        text: 'Signage, billboards, vehicle wraps and campaigns that put your brand where it matters.',
        grad: 'linear-gradient(135deg,#ec1e79,#f6c945)',
    },
    {
        href: '/store',
        icon: ShoppingBag,
        title: 'Store',
        text: 'Premium paper, inks, stationery and creative supplies — ready to pick up or ship.',
        grad: 'linear-gradient(135deg,#f59e0b,#06b6d4)',
    },
];

const stats = [
    { value: '12+', label: 'Years in business' },
    { value: '8,400+', label: 'Projects delivered' },
    { value: '98%', label: 'Happy clients' },
    { value: '24h', label: 'Express turnaround' },
];

const why = [
    { icon: Award, title: 'Premium quality', text: 'Calibrated presses and rich CMYK output mean colors that pop and text that stays crisp.' },
    { icon: Clock, title: 'Fast turnaround', text: 'Express options get urgent jobs done in as little as 24 hours without cutting corners.' },
    { icon: Sparkles, title: 'In-house design', text: 'Print and design under one roof — no back-and-forth between vendors, just results.' },
    { icon: Leaf, title: 'Eco-conscious', text: 'Recycled stocks, soy-based inks and low-waste workflows for printing you can feel good about.' },
];

const testimonials = [
    { name: 'Maya R.', role: 'Café Owner', text: 'Our menus and signage have never looked better. Fast, friendly and the colors are stunning.' },
    { name: 'Daniel K.', role: 'Startup Founder', text: 'They designed our logo and printed everything from cards to banners. One team, zero hassle.' },
    { name: 'Priya S.', role: 'Event Planner', text: 'Last-minute 500 invitations? Delivered the next morning, flawless. Absolute lifesavers.' },
];

export default function Home() {
    return (
        <>
            {/* ---------- Hero ---------- */}
            <section className={styles.hero}>
                <span className="blob" style={{ background: '#06b6d4', width: 420, height: 420, top: -140, left: -100 }} />
                <span className="blob" style={{ background: '#ec1e79', width: 380, height: 380, top: 40, right: -120 }} />
                <span className="blob" style={{ background: '#f6c945', width: 300, height: 300, bottom: -120, left: '40%', opacity: 0.35 }} />

                <div className={`container ${styles.heroInner}`}>
                    <Reveal>
                        <span className="eyebrow"><Sparkles size={14} /> Printing · Design · Advertising · Store</span>
                        <h1 className={`display ${styles.heroTitle}`}>
                            Bring your ideas to life with <span className="gradient-text">C&nbsp;Printing</span>
                        </h1>
                        <p className="lead" style={{ marginTop: '1.4rem' }}>
                            From a single business card to a city-wide campaign, we design it,
                            print it and make it impossible to ignore. Quality ink, sharp design,
                            real impact — all under one roof.
                        </p>
                        <div className={styles.heroBtns}>
                            <Link href="/contact" className="btn btn-primary">Get a Free Quote <ArrowRight size={18} /></Link>
                            <Link href="/services/printing" className="btn btn-ghost">Explore Services</Link>
                        </div>
                        <div className={styles.heroMeta}>
                            <div className={styles.stars}>
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f6c945" stroke="#f6c945" />)}
                            </div>
                            <span>Rated 4.9/5 by 1,200+ local businesses</span>
                        </div>
                    </Reveal>

                    <Reveal delay={150} className={styles.heroArt}>
                        <div className={`${styles.swatch} ${styles.cyan}`}><span>C</span><small>Cyan</small></div>
                        <div className={`${styles.swatch} ${styles.magenta}`}><span>M</span><small>Magenta</small></div>
                        <div className={`${styles.swatch} ${styles.yellow}`}><span>Y</span><small>Yellow</small></div>
                        <div className={`${styles.swatch} ${styles.key}`}><span>K</span><small>Key</small></div>
                        <div className={styles.artBadge}>
                            <Printer size={20} />
                            <div>
                                <strong>Print-ready</strong>
                                <small>True CMYK color</small>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ---------- Stats strip ---------- */}
            <section className="container">
                <div className={styles.statStrip}>
                    {stats.map((s) => (
                        <div key={s.label} className={styles.statItem}>
                            <span className="gradient-text">{s.value}</span>
                            <small>{s.label}</small>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------- Services ---------- */}
            <section className="section">
                <div className="container">
                    <div className="section-head">
                        <span className="eyebrow">What we do</span>
                        <h2 className="section-title" style={{ marginTop: '0.8rem' }}>Four services, one creative partner</h2>
                        <p className="lead">Everything you need to look professional and stand out — handled by people who genuinely love the craft.</p>
                    </div>
                    <div className="grid cols-4">
                        {services.map((s, i) => (
                            <Reveal as="article" key={s.title} delay={i * 90}>
                                <Link href={s.href} className={`card ${styles.serviceCard}`}>
                                    <div className="card-icon" style={{ background: s.grad }}>
                                        <s.icon size={26} />
                                    </div>
                                    <h3>{s.title}</h3>
                                    <p>{s.text}</p>
                                    <span className={styles.cardLink}>Learn more <ArrowRight size={16} /></span>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- Why us ---------- */}
            <section className="section" style={{ background: 'var(--surface-soft)' }}>
                <div className="container">
                    <div className={styles.whyGrid}>
                        <Reveal className={styles.whyIntro}>
                            <span className="eyebrow">Why C Printing</span>
                            <h2 className="section-title" style={{ marginTop: '0.8rem' }}>The details are the difference</h2>
                            <p className="lead" style={{ marginTop: '1rem' }}>
                                We obsess over color accuracy, paper feel and deadlines so you don&apos;t
                                have to. Here&apos;s what working with us actually feels like.
                            </p>
                            <ul className="check-list" style={{ marginTop: '1.5rem' }}>
                                <li><Check size={18} /> Free proofs &amp; color matching</li>
                                <li><Check size={18} /> Transparent, upfront pricing</li>
                                <li><Check size={18} /> Local pickup or nationwide shipping</li>
                            </ul>
                        </Reveal>
                        <div className="grid cols-2">
                            {why.map((w, i) => (
                                <Reveal as="article" key={w.title} delay={i * 80}>
                                    <div className={`card ${styles.whyCard}`}>
                                        <w.icon className={styles.whyIcon} size={28} />
                                        <h3>{w.title}</h3>
                                        <p>{w.text}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------- Testimonials ---------- */}
            <section className="section">
                <div className="container">
                    <div className="section-head">
                        <span className="eyebrow">Loved locally</span>
                        <h2 className="section-title" style={{ marginTop: '0.8rem' }}>What our clients say</h2>
                    </div>
                    <div className="grid cols-3">
                        {testimonials.map((t, i) => (
                            <Reveal as="article" key={t.name} delay={i * 90}>
                                <div className={`card ${styles.quote}`}>
                                    <div className={styles.stars}>
                                        {[...Array(5)].map((_, j) => <Star key={j} size={15} fill="#f6c945" stroke="#f6c945" />)}
                                    </div>
                                    <p>&ldquo;{t.text}&rdquo;</p>
                                    <div className={styles.author}>
                                        <span className={styles.avatar}>{t.name.charAt(0)}</span>
                                        <div>
                                            <strong>{t.name}</strong>
                                            <small>{t.role}</small>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- CTA ---------- */}
            <section className="container">
                <Reveal>
                    <div className={styles.cta}>
                        <span className="blob" style={{ background: '#f6c945', width: 260, height: 260, top: -80, right: 40, opacity: 0.4 }} />
                        <div className={styles.ctaContent}>
                            <h2>Ready to make something great?</h2>
                            <p>Tell us about your project and get a free, no-obligation quote within one business day.</p>
                            <div className={styles.heroBtns}>
                                <Link href="/contact" className={`btn ${styles.ctaWhite}`}>Get a Free Quote <ArrowRight size={18} /></Link>
                                <Link href="/about" className="btn btn-ghost" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>About Us</Link>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </section>
        </>
    );
}
