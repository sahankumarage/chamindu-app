'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type CartItem = { name: string; price: number; qty: number };

type CartCtx = {
    items: CartItem[];
    count: number;
    total: number;
    add: (item: { name: string; price: number }) => void;
    remove: (name: string) => void;
    setQty: (name: string, qty: number) => void;
    clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = 'cprinting-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(KEY);
            if (raw) setItems(JSON.parse(raw));
        } catch { /* ignore */ }
        setReady(true);
    }, []);

    useEffect(() => {
        if (ready) localStorage.setItem(KEY, JSON.stringify(items));
    }, [items, ready]);

    const add = useCallback((item: { name: string; price: number }) => {
        setItems((prev) => {
            const found = prev.find((i) => i.name === item.name);
            if (found) {
                return prev.map((i) => (i.name === item.name ? { ...i, qty: i.qty + 1 } : i));
            }
            return [...prev, { ...item, qty: 1 }];
        });
    }, []);

    const remove = useCallback((name: string) => {
        setItems((prev) => prev.filter((i) => i.name !== name));
    }, []);

    const setQty = useCallback((name: string, qty: number) => {
        setItems((prev) =>
            prev
                .map((i) => (i.name === name ? { ...i, qty: Math.max(1, qty) } : i))
                .filter((i) => i.qty > 0)
        );
    }, []);

    const clear = useCallback(() => setItems([]), []);

    const count = items.reduce((n, i) => n + i.qty, 0);
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);

    return (
        <Ctx.Provider value={{ items, count, total, add, remove, setQty, clear }}>
            {children}
        </Ctx.Provider>
    );
}

export function useCart() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
