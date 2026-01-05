'use client';

import { useState } from 'react';
import { login, register } from '../actions';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        const action = isLogin ? login : register;
        const res = await action(formData);

        if (res.success) {
            if (isLogin) {
                toast.success('Welcome back!');
                router.push('/admin');
            } else {
                toast.success('Account created! Please login.');
                setIsLogin(true);
            }
        } else {
            toast.error(res.message);
        }
    }

    return (
        <main className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>
                    {isLogin ? 'Admin Login' : 'Admin Register'}
                </h1>

                <form action={handleSubmit} className={styles.form}>
                    <input name="email" type="email" placeholder="Email" required className={styles.input} />
                    <input name="password" type="password" placeholder="Password" required className={styles.input} />

                    <button type="submit" className="btn btn-primary w-full">
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                <p className={styles.toggle}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className={styles.link}>
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </main>
    );
}
