'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, UploadCloud, FileText, Send } from 'lucide-react';
import { createPrintOrder, type FormState } from '@/lib/actions';
import styles from './page.module.css';

export default function NewPrintOrder() {
    const [state, action, pending] = useActionState<FormState, FormData>(createPrintOrder, undefined);
    const [fileName, setFileName] = useState<string | null>(null);

    return (
        <div className={styles.wrap}>
            <Link href="/portal/orders" className={styles.back}><ArrowLeft size={16} /> Back to orders</Link>

            <h1 className={styles.title}>New print order</h1>
            <p className={styles.sub}>Tell us what you need printed and upload your print-ready PDF. We&apos;ll review it and send a quote.</p>

            <form action={action} className={styles.form}>
                {state?.error && <div className={styles.error}>{state.error}</div>}

                <label className={styles.field}>
                    <span>Order title <em>*</em></span>
                    <input type="text" name="title" placeholder="e.g. 500 matte business cards" required />
                </label>

                <label className={styles.field}>
                    <span>Project details</span>
                    <textarea name="description" rows={5} placeholder="Quantity, size, paper, finish, deadline — anything that helps us quote accurately." />
                </label>

                <div className={styles.field}>
                    <span>Print-ready PDF</span>
                    <label className={styles.dropzone}>
                        <input
                            type="file"
                            name="file"
                            accept="application/pdf"
                            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                        />
                        {fileName ? (
                            <div className={styles.dzFile}><FileText size={26} /><strong>{fileName}</strong><small>Click to replace</small></div>
                        ) : (
                            <div className={styles.dzEmpty}>
                                <UploadCloud size={30} />
                                <strong>Click to upload a PDF</strong>
                                <small>Max 25 MB · PDF only</small>
                            </div>
                        )}
                    </label>
                </div>

                <button type="submit" className="btn btn-primary" disabled={pending}>
                    {pending ? 'Submitting…' : <>Submit order <Send size={17} /></>}
                </button>
            </form>
        </div>
    );
}
