'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

import PageLoader from '@/components/ui/PageLoader';

export const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user data");
            }
        }
    }
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Give time for the animation to start and be perceived by the user
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Clear Session
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Force hard refresh to clear any in-memory state if needed, or just push
    // router.push('/') is usually enough, but window.location.href ensures clean slate
    window.location.href = '/'; 
  };

  return (
    <>
    <PageLoader isVisible={isLoggingOut} text="Cerrando Sesión..." />
    
    <nav className="bg-white border-b-4 border-[#9D2449] px-8 py-4 flex justify-between items-center shadow-sm z-50 relative">
      {/* Logos Institucionales */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-extrabold text-[#1F2937] tracking-tighter">FOVISSSTE</span>
        <span className="text-xl font-light text-gray-300">|</span>
        <span className="text-xs sm:text-sm text-gray-500 font-light uppercase tracking-wide">
          Sistema de Gestión Documental
        </span>
      </div>

      {/* Información de Usuario */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block leading-tight">
          <p className="font-bold text-sm text-gray-800">{user?.name || 'Usuario'}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wide">
              {user?.department?.name || user?.job_title || 'Sin Asignación'}
          </p>
        </div>
        
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-600 font-bold shadow-inner">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <button 
          onClick={handleLogout}
          className="text-[#9D2449] text-xs font-bold hover:underline ml-2 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
    </>
  );
};
