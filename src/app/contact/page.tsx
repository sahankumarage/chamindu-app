'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { MapPin, Phone, Mail, Clock, Send, ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import styles from './page.module.css';

const services = ['Printing', 'Designing', 'Advertising', 'Store / Supplies', 'Something else'];

const info = [
    { icon: MapPin, title: 'Visit us', lines: ['24 Market Street', 'City Center, 10100'] },
    { icon: Phone, title: 'Call us', lines: ['+1 (000) 000-0000', 'Mon–Sat, 9am–7pm'] },
    { icon: Mail, title: 'Email us', lines: ['hello@cprinting.com', 'quotes@cprinting.com'] },
    { icon: Clock, title: 'Opening hours', lines: ['Mon–Fri: 9am – 7pm', 'Sat: 10am – 4pm'] },
];

export default function ContactPage() {
    const [sending, setSending] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);
        const form = e.currentTarget;
        setTimeout(() => {
            setSending(false);
            form.reset();
            toast.success('Thanks! We\'ll get back to you within one business day.');
        }, 900);
    };

    return (
        <>
            <section className={styles.hero}>
                <span className="blob" style={{ background: '#ec1e79', width: 340, height: 340, top: -120, right: -60 }} />
                <span className="blob" style={{ background: '#06b6d4', width: 300, height: 300, bottom: -160, left: -80, opacity: 0.35 }} />
                <div className="container">
                    <Reveal className={styles.heroInner}>
                        <span className="eyebrow">Contact Us</span>
                        <h1 className="display" style={{ marginTop: '1.2rem' }}>
                            Let&apos;s make something <span className="gradient-text">great</span>
                        </h1>
                        <p className="lead" style={{ margin: '1.2rem auto 0' }}>
                            Tell us about your project and we&apos;ll send a free, no-obligation quote
                            within one business day. Prefer to talk? We&apos;d love to hear from you.
                        </p>
                    </Reveal>
                </div>
            </section>

            <section className="section-tight">
                <div className={`container ${styles.layout}`}>
                    {/* Form */}
                    <Reveal className={styles.formWrap}>
                        <h2 className={styles.formTitle}>Request a quote</h2>
                        <p className={styles.formSub}>Fill in a few details and we&apos;ll take it from there.</p>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.row}>
                                <label>
                                    <span>Name</span>
                                    <input type="text" name="name" placeholder="Jane Doe" required />
                                </label>
                                <label>
                                    <span>Email</span>
                                    <input type="email" name="email" placeholder="jane@email.com" required />
                                </label>
                            </div>
                            <div className={styles.row}>
                                <label>
                                    <span>Phone</span>
                                    <input type="tel" name="phone" placeholder="+1 (000) 000-0000" />
                                </label>
                                <label>
                                    <span>Service</span>
                                    <select name="service" defaultValue="">
                                        <option value="" disabled>Choose a service</option>
                                        {services.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </label>
                            </div>
                            <label>
                                <span>Project details</span>
                                <textarea name="message" rows={5} placeholder="Tell us what you need — quantity, sizes, deadline, anything helpful." required />
                            </label>
                            <button type="submit" className="btn btn-primary" disabled={sending}>
                                {sending ? 'Sending…' : <>Send message <Send size={17} /></>}
                            </button>
                        </form>
                    </Reveal>

                    {/* Info */}
                    <Reveal delay={120} className={styles.infoCol}>
                        <div className={styles.infoGrid}>
                            {info.map((item) => (
                                <div key={item.title} className={styles.infoCard}>
                                    <div className={styles.infoIcon}><item.icon size={22} /></div>
                                    <strong>{item.title}</strong>
                                    {item.lines.map((l) => <small key={l}>{l}</small>)}
                                </div>
                            ))}
                        </div>

                        <div className={styles.mapCard}>
                            <div className={styles.mapPin}><MapPin size={26} /></div>
                            <div>
                                <strong>Find our studio</strong>
                                <p>24 Market Street, City Center — free parking and walk-ins welcome.</p>
                                <a href="#" className={styles.mapLink}>Get directions <ArrowRight size={15} /></a>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>
        </>
    );
}
