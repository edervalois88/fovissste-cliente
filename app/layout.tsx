import './globals.css';
import { Montserrat } from 'next/font/google';
import { QueryProvider } from '@/components/providers/QueryProvider';
// import { ToastProvider } from '@/components/providers/ToastProvider';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata = {
  title: 'FOVISSSTE - Sistema de Gestión Documental',
  description: 'Sistema oficial para la gestión de correspondencia y oficios.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="fovissste" className={montserrat.variable}>
      <body className="font-montserrat text-gray-800 antialiased min-h-screen bg-gray-50">
        <QueryProvider>
          {/* <ToastProvider /> */}
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
