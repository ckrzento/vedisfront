import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import 'tippy.js/dist/tippy.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'VEDIS Agent - Configuration des documents',
  description: 'Configurez les champs à extraire de vos documents de financement',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              border: '1px solid #E8E8E8',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            },
          }}
        />
      </body>
    </html>
  );
}
