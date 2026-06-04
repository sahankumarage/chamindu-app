import Link from 'next/link';
import styles from './Logo.module.css';

export default function Logo({ light = false }: { light?: boolean }) {
    return (
        <Link href="/" className={`${styles.logo} ${light ? styles.light : ''}`}>
            <span className={styles.mark} aria-hidden>
                <i style={{ background: '#06b6d4' }} />
                <i style={{ background: '#ec1e79' }} />
                <i style={{ background: '#f6c945' }} />
                <span className={styles.c}>C</span>
            </span>
            <span className={styles.word}>
                C&nbsp;Printing
            </span>
        </Link>
    );
}
