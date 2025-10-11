
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppHeader } from '@/components/shared/app-header';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { FacebookIcon, TikTokIcon } from '@/components/shared/social-icons';

export const metadata: Metadata = {
  title: 'ReflectAI',
  description: 'Your Personal AI Stylist',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/*
          The Google Fonts links have been removed to prevent network errors
          in restricted environments. The app will now use the fallback fonts
          defined in tailwind.config.ts (serif and sans-serif).
        */}
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <div className="flex min-h-screen w-full flex-col">
            <AppHeader />
            <main className="flex-1 py-12">{children}</main>
            <footer className="border-t py-8 md:py-10">
              <div className="container text-center text-sm text-muted-foreground">
                <div className="flex justify-center gap-6 mb-6">
                  <Link href="https://instagram.com/your-username" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                    <Instagram className="h-6 w-6" />
                  </Link>
                  <Link href="https://facebook.com/your-username" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                    <FacebookIcon className="h-6 w-6" />
                  </Link>
                  <Link href="https://tiktok.com/@your-username" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                    <TikTokIcon className="h-6 w-6" />
                  </Link>
                </div>
                <div className="flex justify-center gap-x-4 mb-4">
                   <p>
                    &copy; {new Date().getFullYear()} ReflectAI. All rights
                    reserved.
                  </p>
                  <Link href="/about-us" className="hover:text-primary transition-colors">
                    About Us
                  </Link>
                  <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </div>
                <p className="mt-2">
                  This is a style improvement service intended to enhance your personal aesthetic, not a provider of medical advice.
                </p>
              </div>
            </footer>
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
