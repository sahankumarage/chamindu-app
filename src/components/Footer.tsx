import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';
import Logo from './Logo';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.grid}`}>
                <div className={styles.brand}>
                    <Logo light />
                    <p>
                        Your full-service partner for printing, design, advertising and
                        creative supplies. We turn ideas into ink, pixels and impact.
                    </p>
                    <div className={styles.social}>
                        <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
                        <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
                        <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
                    </div>
                </div>

                <div className={styles.col}>
                    <h4>Services</h4>
                    <Link href="/services/printing">Printing</Link>
                    <Link href="/services/designing">Designing</Link>
                    <Link href="/services/advertising">Advertising</Link>
                    <Link href="/store">Store</Link>
                </div>

                <div className={styles.col}>
                    <h4>Company</h4>
                    <Link href="/about">About Us</Link>
                    <Link href="/contact">Contact</Link>
                    <Link href="/contact">Get a Quote</Link>
                </div>

                <div className={styles.col}>
                    <h4>Get in touch</h4>
                    <a href="#" className={styles.contact}><MapPin size={16} /> 24 Market Street, City Center</a>
                    <a href="tel:+10000000000" className={styles.contact}><Phone size={16} /> +1 (000) 000-0000</a>
                    <a href="mailto:hello@cprinting.com" className={styles.contact}><Mail size={16} /> hello@cprinting.com</a>
                </div>
            </div>

            <div className={styles.bottom}>
                <div className="container">
                    <span>© {2026} C Printing. All rights reserved.</span>
                    <span>Designed &amp; printed with care.</span>
                </div>
            </div>
        </footer>
    );
}
