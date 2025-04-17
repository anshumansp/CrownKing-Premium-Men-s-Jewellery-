import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { ReduxProvider } from '@/redux/provider';
import LoadingFallback from '@/components/LoadingFallback';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'CrownKing | Premium Men\'s Jewelry',
  description: 'Discover exquisite jewelry pieces for the modern man.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex flex-col min-h-screen">
        <ReduxProvider>
          <AuthProvider>
            <LoadingProvider>
              <Suspense fallback={<LoadingFallback />}>
                <ClientLayout>
                  {children}
                </ClientLayout>
              </Suspense>
            </LoadingProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
