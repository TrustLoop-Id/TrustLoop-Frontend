import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TrustLoop - Decentralized Rotating Saving Platform',
  description: 'Secure, transparent, and automated arisan groups on Base blockchain',
  keywords: ['arisan', 'defi', 'base', 'blockchain', 'mini-app'],
  authors: [{ name: 'Daniel Sukamto' }],
  creator: 'Daniel Sukamto & Vermount William',
  publisher: 'TrustLoop',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://arisanlink.app',
    title: 'TrustLoop - Decentralized Rotating Saving Platform',
    description: 'Secure, transparent, and automated arisan groups on Base blockchain',
    siteName: 'TrustLoop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrustLoop - Decentralized Rotating Saving Platform',
    description: 'Secure, transparent, and automated arisan groups on Base blockchain',
    creator: '@TrustLoop',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#17212b' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}