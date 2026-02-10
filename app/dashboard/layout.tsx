'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { RouteGuard } from '@/components/auth/RouteGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col font-montserrat">
        {/* 1. Navbar Institucional Fijo arriba */}
        <Navbar />

        <div className="flex flex-1">
          {/* 2. Sidebar Lateral */}
          <Sidebar />

          {/* 3. Área de Contenido Principal (Limitada a container) */}
          <main className="flex-1 p-8 overflow-y-auto">
            {/* Constrain the width to 'max-w-7xl' and center it 'mx-auto' so it doesn't span 100% on huge screens */}
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>

        <footer className="bg-gray-100 py-2 text-center text-[10px] text-gray-400 border-t border-gray-200">
            <p>FOVISSSTE © {new Date().getFullYear()} - Sistema de Gestión Documental</p>
        </footer>
      </div>
    </RouteGuard>
  );
}
