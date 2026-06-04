'use client';

import { useActionState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Printer, Check, LogIn } from 'lucide-react';
import { loginAction, type FormState } from '@/lib/actions';
import styles from '@/components/auth.module.css';

function LoginForm() {
    const params = useSearchParams();
    const redirect = params.get('redirect') || '';
    const [state, action, pending] = useActionState<FormState, FormData>(loginAction, undefined);

    return (
        <div className={styles.card}>
            <h1>Welcome back</h1>
            <p className={styles.sub}>Sign in to manage your orders, files and billing.</p>

            <form action={action} className={styles.form}>
                {redirect && <input type="hidden" name="redirect" value={redirect} />}
                {state?.error && <div className={styles.error}>{state.error}</div>}

                <label className={styles.field}>
                    <span>Email</span>
                    <input type="email" name="email" placeholder="you@email.com" required autoComplete="email" />
                </label>
                <label className={styles.field}>
                    <span>Password</span>
                    <input type="password" name="password" placeholder="••••••••" required autoComplete="current-password" />
                </label>

                <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={pending}>
                    {pending ? 'Signing in…' : <>Sign in <LogIn size={18} /></>}
                </button>
            </form>

            <div className={styles.demo}>
                Admin demo: <strong>admin@cprinting.com</strong> / <strong>admin123</strong>
            </div>

            <p className={styles.alt}>
                New to C Printing? <Link href="/signup">Create an account</Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className={styles.wrap}>
            <aside className={styles.aside}>
                <div className={styles.asideInner}>
                    <Printer size={40} />
                    <h2>Your projects, all in one place.</h2>
                    <p>Track orders, upload print-ready files and pay invoices from your personal dashboard.</p>
                    <ul className={styles.points}>
                        <li><Check size={20} /> Place print &amp; store orders</li>
                        <li><Check size={20} /> Upload PDFs securely</li>
                        <li><Check size={20} /> View billing &amp; order status</li>
                    </ul>
                </div>
            </aside>
            <section className={styles.panel}>
                <Suspense fallback={null}>
                    <LoginForm />
                </Suspense>
            </section>
        </div>
    );
}
