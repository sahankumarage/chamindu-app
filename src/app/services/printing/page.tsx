import type { Metadata } from 'next';
import { Printer, FileText, Image as ImageIcon, Layers, Zap, ShieldCheck } from 'lucide-react';
import ServicePage from '@/components/ServicePage';

export const metadata: Metadata = {
    title: 'Printing Services — C Printing',
    description: 'Business cards, brochures, flyers, large-format banners, packaging and more. Sharp, vivid, true-CMYK printing with express turnaround.',
};

export default function PrintingPage() {
    return (
        <ServicePage
            eyebrow="Printing"
            title="Printing that demands attention"
            accent="linear-gradient(120deg,#06b6d4,#3b82f6)"
            accentColor="#06b6d4"
            intro="From a stack of crisp business cards to towering large-format banners, we print with calibrated presses and true-CMYK color so every piece looks exactly the way you imagined — or better."
            heroStats={[
                { value: '24h', label: 'Express turnaround' },
                { value: '4K+', label: 'Print jobs / year' },
            ]}
            highlights={[
                'Digital & offset printing',
                'Large-format & banners',
                'Free color-matched proofs',
                'Recycled & premium stocks',
            ]}
            features={[
                { icon: Printer, title: 'Offset & digital', text: 'Short runs or thousands of copies — we pick the right press for the perfect price-to-quality balance.' },
                { icon: ImageIcon, title: 'Large format', text: 'Posters, banners, backdrops and signage printed in vivid, weather-resistant color up to billboard size.' },
                { icon: Layers, title: 'Finishing options', text: 'Lamination, foiling, embossing, die-cuts and binding to give your print a premium tactile finish.' },
                { icon: Zap, title: 'Express service', text: 'Need it tomorrow? Our express lane delivers rush jobs without ever compromising on quality.' },
                { icon: ShieldCheck, title: 'Color accuracy', text: 'Calibrated workflows and proofing guarantee the color you approve is the color you receive.' },
                { icon: FileText, title: 'Variable data', text: 'Personalized mailers, numbered tickets and bulk runs with unique details on every single piece.' },
            ]}
            offerings={[
                { title: 'Business cards', text: 'Matte, gloss, soft-touch, foil or recycled — the first impression that fits in a pocket.', tag: 'Popular' },
                { title: 'Brochures & flyers', text: 'Folded brochures, leaflets and flyers that tell your story and move people to act.' },
                { title: 'Banners & posters', text: 'Indoor and outdoor large-format prints that turn heads from across the street.' },
                { title: 'Stationery', text: 'Letterheads, envelopes, notepads and compliment slips that keep your brand consistent.' },
                { title: 'Packaging & labels', text: 'Custom boxes, stickers and labels that make unboxing part of the experience.' },
                { title: 'Books & booklets', text: 'Catalogs, manuals and lookbooks, perfect-bound or saddle-stitched to last.' },
            ]}
            process={[
                { title: 'Share files', text: 'Send your artwork or let us prep print-ready files for you.' },
                { title: 'Proof & approve', text: 'Review a free digital or hard proof and lock in the colors.' },
                { title: 'We print', text: 'Your job runs on the ideal press with quality checks throughout.' },
                { title: 'Pick up / ship', text: 'Collect locally or have it delivered straight to your door.' },
            ]}
            ctaTitle="Got a print job in mind?"
            ctaText="Upload your files or describe what you need — we'll send a free quote within one business day."
        />
    );
}
