import type { Metadata } from 'next';
import { PenTool, Palette, Package, LayoutTemplate, Type, Sparkles } from 'lucide-react';
import ServicePage from '@/components/ServicePage';

export const metadata: Metadata = {
    title: 'Design Services — C Printing',
    description: 'Logos, brand identity, packaging, and print-ready layouts crafted by designers who sweat every pixel.',
};

export default function DesigningPage() {
    return (
        <ServicePage
            eyebrow="Designing"
            title="Design that makes you memorable"
            accent="linear-gradient(120deg,#7c3aed,#ec1e79)"
            accentColor="#7c3aed"
            intro="Great print starts with great design. Our in-house creatives shape logos, brand systems, packaging and layouts that look stunning on screen and flawless on paper — all ready to print the moment they're approved."
            heroStats={[
                { value: '500+', label: 'Brands designed' },
                { value: '3', label: 'Free concepts' },
            ]}
            highlights={[
                'Logo & brand identity',
                'Packaging & label design',
                'Print-ready layouts',
                'Unlimited proof revisions',
            ]}
            features={[
                { icon: PenTool, title: 'Logo design', text: 'Distinctive, versatile marks delivered in every format you\'ll ever need, plus usage guidelines.' },
                { icon: Palette, title: 'Brand identity', text: 'Color palettes, typography and visual systems that make your brand instantly recognizable.' },
                { icon: Package, title: 'Packaging design', text: 'Dielines, labels and structural design that protect your product and sell it on the shelf.' },
                { icon: LayoutTemplate, title: 'Layout & artwork', text: 'Brochures, menus, reports and catalogs laid out for clarity and print-perfect output.' },
                { icon: Type, title: 'Typography', text: 'Type pairings and hierarchy that make every piece readable, elegant and unmistakably yours.' },
                { icon: Sparkles, title: 'Creative direction', text: 'Campaign concepts and art direction that tie all your touchpoints into one cohesive story.' },
            ]}
            offerings={[
                { title: 'Logo & identity', text: 'A complete mark and brand kit you can use everywhere with confidence.', tag: 'Popular' },
                { title: 'Stationery suite', text: 'Business cards, letterheads and envelopes designed as one polished set.' },
                { title: 'Marketing collateral', text: 'Flyers, brochures, posters and social graphics, all on-brand.' },
                { title: 'Packaging & labels', text: 'Eye-catching packaging that earns a place in the cart.' },
                { title: 'Menus & price lists', text: 'Beautifully organized menus that are a pleasure to read and easy to update.' },
                { title: 'Brand guidelines', text: 'A clear rulebook so your brand stays consistent across every team and vendor.' },
            ]}
            process={[
                { title: 'Discover', text: 'We learn your goals, audience and the look you\'re after.' },
                { title: 'Concepts', text: 'Receive multiple original directions to react to.' },
                { title: 'Refine', text: 'We polish your favorite with revisions until it\'s perfect.' },
                { title: 'Deliver', text: 'Get final files plus print-ready artwork and guidelines.' },
            ]}
            ctaTitle="Need a brand that turns heads?"
            ctaText="Tell us about your vision and we'll show you concepts you'll be proud to put your name on."
        />
    );
}
