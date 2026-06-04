'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { PenTool, Check, UserPlus } from 'lucide-react';
import { signupAction, type FormState } from '@/lib/actions';
import styles from '@/components/auth.module.css';

export default function SignupPage() {
    const [state, action, pending] = useActionState<FormState, FormData>(signupAction, undefined);

    return (
        <div className={styles.wrap}>
            <aside className={styles.aside}>
                <div className={styles.asideInner}>
                    <PenTool size={40} />
                    <h2>Create your free C Printing account.</h2>
                    <p>Join thousands of businesses who design, print and advertise with us — all from one dashboard.</p>
                    <ul className={styles.points}>
                        <li><Check size={20} /> Free to join, no commitment</li>
                        <li><Check size={20} /> Reorder past jobs in one click</li>
                        <li><Check size={20} /> Exclusive client pricing</li>
                    </ul>
                </div>
            </aside>

            <section className={styles.panel}>
                <div className={styles.card}>
                    <h1>Create account</h1>
                    <p className={styles.sub}>Start your first order in minutes.</p>

                    <form action={action} className={styles.form}>
                        {state?.error && <div className={styles.error}>{state.error}</div>}

                        <label className={styles.field}>
                            <span>Full name</span>
                            <input type="text" name="name" placeholder="Jane Doe" required autoComplete="name" />
                        </label>
                        <label className={styles.field}>
                            <span>Email</span>
                            <input type="email" name="email" placeholder="you@email.com" required autoComplete="email" />
                        </label>
                        <label className={styles.field}>
                            <span>Password</span>
                            <input type="password" name="password" placeholder="At least 6 characters" required minLength={6} autoComplete="new-password" />
                        </label>

                        <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={pending}>
                            {pending ? 'Creating account…' : <>Create account <UserPlus size={18} /></>}
                        </button>
                    </form>

                    <p className={styles.alt}>
                        Already have an account? <Link href="/login">Sign in</Link>
                    </p>
                </div>
            </section>
        </div>
    );
}
