'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ShoppingCart, LayoutDashboard, LogIn } from 'lucide-react';
import Logo from './Logo';
import { useCart } from './CartContext';
import styles from './Navbar.module.css';

const services = [
    { href: '/services/printing', label: 'Printing' },
    { href: '/services/designing', label: 'Designing' },
    { href: '/services/advertising', label: 'Advertising' },
    { href: '/store', label: 'Store' },
];

type NavUser = { name: string; role: string } | null;

export default function Navbar({ user }: { user: NavUser }) {
    const pathname = usePathname();
    const { count } = useCart();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    const dashHref = user?.role === 'admin' ? '/admin' : '/portal';

    return (
        <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.inner}>
                <Logo />

                <nav className={styles.desktop}>
                    <Link href="/" className={isActive('/') ? styles.active : styles.link}>Home</Link>

                    <div className={styles.dropdown}>
                        <button className={styles.link}>Services <ChevronDown size={15} /></button>
                        <div className={styles.menu}>
                            {services.map((s) => (
                                <Link key={s.href} href={s.href} className={styles.menuItem}>{s.label}</Link>
                            ))}
                        </div>
                    </div>

                    <Link href="/about" className={isActive('/about') ? styles.active : styles.link}>About</Link>
                    <Link href="/contact" className={isActive('/contact') ? styles.active : styles.link}>Contact</Link>
                </nav>

                <div className={styles.actions}>
                    <Link href="/cart" className={styles.cartBtn} aria-label="Cart">
                        <ShoppingCart size={20} />
                        {count > 0 && <span className={styles.badge}>{count}</span>}
                    </Link>

                    {user ? (
                        <Link href={dashHref} className={`btn btn-dark ${styles.cta}`}>
                            <LayoutDashboard size={17} /> {user.role === 'admin' ? 'Admin' : 'Dashboard'}
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className={`${styles.link} ${styles.signIn}`}>Sign in</Link>
                            <Link href="/contact" className={`btn btn-primary ${styles.cta}`}>Get a Quote</Link>
                        </>
                    )}
                </div>

                <button className={styles.burger} onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
                    {open ? <X /> : <Menu />}
                </button>
            </div>

            {open && (
                <div className={styles.mobile}>
                    <Link href="/" className={isActive('/') ? styles.mActive : styles.mLink}>Home</Link>
                    {services.map((s) => (
                        <Link key={s.href} href={s.href} className={isActive(s.href) ? styles.mActive : styles.mLink}>{s.label}</Link>
                    ))}
                    <Link href="/about" className={isActive('/about') ? styles.mActive : styles.mLink}>About</Link>
                    <Link href="/contact" className={isActive('/contact') ? styles.mActive : styles.mLink}>Contact</Link>
                    <Link href="/cart" className={styles.mLink}>Cart{count > 0 ? ` (${count})` : ''}</Link>

                    {user ? (
                        <Link href={dashHref} className="btn btn-dark" style={{ marginTop: '0.5rem' }}>
                            <LayoutDashboard size={17} /> {user.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="btn btn-ghost" style={{ marginTop: '0.5rem' }}><LogIn size={17} /> Sign in</Link>
                            <Link href="/contact" className="btn btn-primary">Get a Quote</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
