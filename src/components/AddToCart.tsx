'use client';

import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from './CartContext';

export default function AddToCart({
    name,
    price,
    className,
}: {
    name: string;
    price: number;
    className?: string;
}) {
    const { add } = useCart();
    const [added, setAdded] = useState(false);

    return (
        <button
            className={className}
            aria-label={`Add ${name} to cart`}
            onClick={() => {
                add({ name, price });
                setAdded(true);
                setTimeout(() => setAdded(false), 1200);
            }}
        >
            {added ? <Check size={16} /> : <ShoppingBag size={16} />}
        </button>
    );
}
