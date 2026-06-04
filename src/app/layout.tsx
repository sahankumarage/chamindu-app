import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/components/CartContext';
import { getSession } from '@/lib/auth';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'C Printing — Printing, Design, Advertising & Store',
  description:
    'C Printing is your full-service partner for high-quality printing, creative design, impactful advertising, and a stocked creative store. Quality ink, sharp design, real impact.',
  keywords: [
    'printing',
    'design',
    'advertising',
    'print shop',
    'business cards',
    'banners',
    'signage',
    'C Printing',
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const user = session ? { name: session.name, role: session.role } : null;

  return (
    <html lang="en">
      <body className={outfit.className}>
        <CartProvider>
          <Navbar user={user} />
          <main>{children}</main>
          <Footer />
        </CartProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
