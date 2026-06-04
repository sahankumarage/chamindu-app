'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    as?: 'div' | 'section' | 'li' | 'article';
};

export default function Reveal({ children, delay = 0, className = '', as = 'div' }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    obs.disconnect();
                }
            },
            { threshold: 0.12 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const Tag = as as 'div';

    return (
        <Tag
            ref={ref}
            className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {children}
        </Tag>
    );
}
