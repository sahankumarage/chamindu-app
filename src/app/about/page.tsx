import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Target, Eye, Leaf, Users, Award, ArrowRight, Quote } from 'lucide-react';
import Reveal from '@/components/Reveal';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'About Us — C Printing',
    description: 'Meet C Printing — a full-service print, design and advertising studio obsessed with quality, color and craft.',
};

const values = [
    { icon: Heart, title: 'Craft first', text: 'We treat every job — big or small — like our name is on it. Because it is.' },
    { icon: Target, title: 'On time, always', text: 'Deadlines are promises. We plan our presses and people to keep every one.' },
    { icon: Leaf, title: 'Sustainable', text: 'Recycled stocks, soy inks and low-waste workflows are our default, not an upsell.' },
    { icon: Users, title: 'People over print', text: 'Real humans who answer the phone, solve problems and remember your name.' },
];

const stats = [
    { value: '2012', label: 'Founded' },
    { value: '8,400+', label: 'Projects delivered' },
    { value: '1,200+', label: 'Loyal clients' },
    { value: '30+', label: 'Team members' },
];

const team = [
    { name: 'Chamindu Perera', role: 'Founder & Master Printer', initial: 'C', grad: 'linear-gradient(135deg,#06b6d4,#7c3aed)' },
    { name: 'Aisha Fernando', role: 'Creative Director', initial: 'A', grad: 'linear-gradient(135deg,#7c3aed,#ec1e79)' },
    { name: 'Marcus Lee', role: 'Head of Production', initial: 'M', grad: 'linear-gradient(135deg,#ec1e79,#f6c945)' },
    { name: 'Sofia Ramos', role: 'Client Success Lead', initial: 'S', grad: 'linear-gradient(135deg,#f59e0b,#06b6d4)' },
];

export default function AboutPage() {
    return (
        <>
            <section className={styles.hero}>
                <span className="blob" style={{ background: '#7c3aed', width: 360, height: 360, top: -120, left: -80 }} />
                <span className="blob" style={{ background: '#06b6d4', width: 320, height: 320, bottom: -140, right: -60, opacity: 0.35 }} />
                <div className="container">
                    <Reveal className={styles.heroInner}>
                        <span className="eyebrow">Our Story</span>
                        <h1 className="display" style={{ marginTop: '1.2rem' }}>
                            We&apos;ve been turning ideas into ink since <span className="gradient-text">2012</span>
                        </h1>
                        <p className="lead" style={{ margin: '1.2rem auto 0' }}>
                            C Printing started as a single press in a small workshop with one belief:
                            that great printing should be accessible, beautiful and stress-free.
                            Today we&apos;re a full-service studio for print, design and advertising —
                            but that belief hasn&apos;t changed one bit.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* Stats */}
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

            {/* Story + Mission/Vision */}
            <section className="section">
                <div className={`container ${styles.storyGrid}`}>
                    <Reveal>
                        <span className="eyebrow">How we got here</span>
                        <h2 className="section-title" style={{ margin: '0.8rem 0 1rem' }}>From one press to your full creative partner</h2>
                        <p className={styles.para}>
                            What began with business cards for neighborhood shops grew — one happy
                            customer at a time — into a studio that handles everything from brand
                            identities to billboards. Along the way we added designers, large-format
                            presses, a creative supply store and a finishing department.
                        </p>
                        <p className={styles.para}>
                            We invested in better technology, but we never automated away the part
                            that matters most: people who genuinely care that your project turns out
                            right. That&apos;s still the heart of C Printing.
                        </p>
                        <Link href="/contact" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                            Work with us <ArrowRight size={18} />
                        </Link>
                    </Reveal>

                    <div className={styles.mvWrap}>
                        <Reveal className={`${styles.mvCard} ${styles.mission}`}>
                            <Target size={26} />
                            <h3>Our Mission</h3>
                            <p>To make professional-quality printing, design and advertising effortless for every business — from the corner café to the national brand.</p>
                        </Reveal>
                        <Reveal delay={120} className={`${styles.mvCard} ${styles.vision}`}>
                            <Eye size={26} />
                            <h3>Our Vision</h3>
                            <p>To be the most trusted creative partner in the region — known for color you can count on, deadlines we always hit, and service that feels personal.</p>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section" style={{ background: 'var(--surface-soft)' }}>
                <div className="container">
                    <div className="section-head">
                        <span className="eyebrow">What we stand for</span>
                        <h2 className="section-title" style={{ marginTop: '0.8rem' }}>Values that show up in the work</h2>
                    </div>
                    <div className="grid cols-4">
                        {values.map((v, i) => (
                            <Reveal as="article" key={v.title} delay={i * 80}>
                                <div className="card" style={{ height: '100%' }}>
                                    <div className="card-icon" style={{ background: 'var(--grad-brand)' }}>
                                        <v.icon size={26} />
                                    </div>
                                    <h3>{v.title}</h3>
                                    <p>{v.text}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quote band */}
            <section className="container">
                <Reveal>
                    <div className={styles.quoteBand}>
                        <Quote size={40} className={styles.quoteMark} />
                        <p>&ldquo;We don&apos;t just print things. We help people show up in the world looking like the best version of themselves.&rdquo;</p>
                        <div className={styles.quoteWho}>
                            <Award size={18} /> Chamindu Perera, Founder
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* Team */}
            <section className="section">
                <div className="container">
                    <div className="section-head">
                        <span className="eyebrow">The people</span>
                        <h2 className="section-title" style={{ marginTop: '0.8rem' }}>Meet the team behind the ink</h2>
                    </div>
                    <div className="grid cols-4">
                        {team.map((m, i) => (
                            <Reveal as="article" key={m.name} delay={i * 80}>
                                <div className={styles.member}>
                                    <span className={styles.memberAvatar} style={{ background: m.grad }}>{m.initial}</span>
                                    <strong>{m.name}</strong>
                                    <small>{m.role}</small>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
