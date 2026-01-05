'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './Navbar.module.css';

const links = [
    { href: '/ride', label: 'Ride' },
    { href: '/rent', label: 'Rent' },
    { href: '/admin', label: 'Admin' }, // Keeping exposed for demo purposes
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className={styles.navbar}>
            <div className={`glass-panel ${styles.inner}`}>
                <Link href="/" className={`${styles.logo} gradient-text`}>
                    Velocita
                </Link>

                <div className={styles.navLinks}>
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={isActive ? `${styles.link} ${styles.linkActive}` : styles.link}
                            >
                                {link.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="underline"
                                        className={styles.underline}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
