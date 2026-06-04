'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Package, Plus, Receipt, Users, LogOut, type LucideIcon,
} from 'lucide-react';
import { logoutAction } from '@/lib/actions';
import Logo from './Logo';
import styles from './dashboard.module.css';

type NavLink = { href: string; label: string; icon: LucideIcon };

const portalLinks: NavLink[] = [
    { href: '/portal', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/portal/orders', label: 'My Orders', icon: Package },
    { href: '/portal/orders/new', label: 'New Print Order', icon: Plus },
    { href: '/portal/billing', label: 'Billing', icon: Receipt },
];

const adminLinks: NavLink[] = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Orders', icon: Package },
    { href: '/admin/billing', label: 'Billing', icon: Receipt },
    { href: '/admin/clients', label: 'Clients', icon: Users },
];

export default function DashboardShell({
    variant,
    user,
    children,
}: {
    variant: 'portal' | 'admin';
    user: { name: string; email: string; role: string };
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const links = variant === 'admin' ? adminLinks : portalLinks;

    const isActive = (href: string) =>
        href === '/portal' || href === '/admin' ? pathname === href : pathname.startsWith(href);

    return (
        <div className={styles.shell}>
            <aside className={styles.sidebar}>
                <div className={styles.sideTop}>
                    <Logo />
                    <span className={styles.roleTag}>
                        {variant === 'admin' ? 'Admin Panel' : 'Client Portal'}
                    </span>
                </div>

                <nav className={styles.nav}>
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={isActive(l.href) ? `${styles.navLink} ${styles.navActive}` : styles.navLink}
                        >
                            <l.icon size={19} /> {l.label}
                        </Link>
                    ))}
                </nav>

                <div className={styles.sideFoot}>
                    <div className={styles.profile}>
                        <span className={styles.avatar}>{user.name.charAt(0).toUpperCase()}</span>
                        <div className={styles.profileInfo}>
                            <strong>{user.name}</strong>
                            <small>{user.email}</small>
                        </div>
                    </div>
                    <form action={logoutAction}>
                        <button type="submit" className={styles.logout}>
                            <LogOut size={17} /> Sign out
                        </button>
                    </form>
                </div>
            </aside>

            <div className={styles.main}>{children}</div>
        </div>
    );
}
