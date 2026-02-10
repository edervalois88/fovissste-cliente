'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  FilePlus, 
  Search, 
  Settings, 
  FileText,
} from 'lucide-react';
import { hasPermission } from '@/lib/permissions';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard/stats', icon: LayoutDashboard },
  { name: 'Bandeja de Entrada', href: '/dashboard/inbox', icon: Inbox },
  { name: 'Nuevo Oficio', href: '/dashboard/register', icon: FilePlus },
  { name: 'Búsqueda', href: '/dashboard/search', icon: Search },
  { name: 'Reportes', href: '/dashboard/reports', icon: FileText },
  { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Get role safely on client side
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            setUserRole(user.role || 'Usuario');
        } catch {
            setUserRole('Usuario');
        }
    } else {
        // Fallback or could wait for auth check
        setUserRole('Usuario'); 
    }
  }, []);

  // Filter items based on role
  const visibleItems = userRole 
    ? menuItems.filter(item => hasPermission(item.href, userRole))
    : []; // Show nothing while loading role (or skeleton)

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col hidden lg:flex font-montserrat animate-in fade-in duration-300">
      <div className="p-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Menú Principal</p>
        <ul className="space-y-2">
          {visibleItems.map((item) => {
            const isActive = pathname.startsWith(item.href); // Better matching than strict equality
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-[#9D2449] text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#9D2449]'
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto p-6 border-t border-gray-100">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="text-xs text-gray-500 text-center">
                Soporte Técnico <br/>
                <span className="font-bold text-gray-800">ext. 1234</span>
            </p>
        </div>
      </div>
    </aside>
  );
};
