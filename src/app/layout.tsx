import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DeshDarshan AI | India\'s AI Tourism Operating System',
  description: 'DeshDarshan does not recommend destinations. It redistributes tourism. AI-powered load balancing, Digital Tourism Twin, ONDC commerce, and climate accounting for sustainable tourism.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-navy-950 text-slate-100 min-h-screen selection:bg-emerald-500 selection:text-navy-950">
        {children}
      </body>
    </html>
  );
}
