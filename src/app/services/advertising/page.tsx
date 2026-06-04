import type { Metadata } from 'next';
import { Megaphone, MapPin, Car, MonitorPlay, Building2, Target } from 'lucide-react';
import ServicePage from '@/components/ServicePage';

export const metadata: Metadata = {
    title: 'Advertising Services — C Printing',
    description: 'Signage, billboards, vehicle wraps, displays and campaigns that put your brand where it matters most.',
};

export default function AdvertisingPage() {
    return (
        <ServicePage
            eyebrow="Advertising"
            title="Advertising that gets you seen"
            accent="linear-gradient(120deg,#ec1e79,#f6c945)"
            accentColor="#ec1e79"
            intro="We take your brand off the page and into the real world. From storefront signage and vehicle wraps to billboards and full campaigns, C Printing makes sure the right people can't miss you."
            heroStats={[
                { value: '1.2M', label: 'Daily impressions' },
                { value: '300+', label: 'Campaigns run' },
            ]}
            highlights={[
                'Signage & storefronts',
                'Billboards & hoardings',
                'Vehicle wraps & fleet',
                'Event & exhibition displays',
            ]}
            features={[
                { icon: MapPin, title: 'Signage', text: 'Illuminated signs, shopfronts, wayfinding and 3D lettering built to last and to impress.' },
                { icon: Building2, title: 'Billboards', text: 'High-impact outdoor advertising with placement guidance to reach your ideal audience.' },
                { icon: Car, title: 'Vehicle wraps', text: 'Turn cars, vans and fleets into mobile billboards with durable, vivid full wraps.' },
                { icon: MonitorPlay, title: 'Displays & stands', text: 'Roll-up banners, backdrops and exhibition stands that own the room at any event.' },
                { icon: Target, title: 'Campaign strategy', text: 'Coordinated messaging across print and place so every channel pulls in the same direction.' },
                { icon: Megaphone, title: 'Promotional kits', text: 'Branded merch, flyers and point-of-sale materials that keep your name top of mind.' },
            ]}
            offerings={[
                { title: 'Storefront signage', text: 'Make your business impossible to walk past with bold, branded signage.', tag: 'Popular' },
                { title: 'Billboards & hoardings', text: 'Large-scale outdoor presence at the locations that matter to you.' },
                { title: 'Vehicle branding', text: 'Single vehicles or full fleets wrapped to advertise everywhere you drive.' },
                { title: 'Exhibition stands', text: 'Modular displays and backdrops that make trade shows count.' },
                { title: 'Window & wall graphics', text: 'Transform glass and walls into striking branded statements.' },
                { title: 'Point-of-sale', text: 'Counter displays, shelf talkers and standees that drive in-store sales.' },
            ]}
            process={[
                { title: 'Brief', text: 'We map your goals, audience and the spaces you want to own.' },
                { title: 'Design', text: 'Our team creates standout visuals sized for every surface.' },
                { title: 'Produce', text: 'We print and fabricate using weatherproof, durable materials.' },
                { title: 'Install', text: 'Professional installation gets everything up safely and on time.' },
            ]}
            ctaTitle="Ready to be impossible to ignore?"
            ctaText="From a single sign to a city-wide campaign, let's plan how to put your brand front and center."
        />
    );
}
