'use client';

import { Users, Shield, Building2, ScrollText, History, Settings2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const configModules = [
  {
    title: 'Gestión de Usuarios',
    description: 'Administre el acceso del personal, cree nuevas cuentas y gestione estados (Activo/Inactivo).',
    icon: Users,
    href: '/dashboard/settings/users',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'Roles y Permisos',
    description: 'Defina qué acciones pueden realizar los usuarios según su nivel de responsabilidad.',
    icon: Shield,
    href: '/dashboard/settings/roles',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    title: 'Estructura Organizacional',
    description: 'Configure las Unidades Administrativas, Departamentos y Áreas receptoras de documentos.',
    icon: Building2,
    href: '/dashboard/settings/departments',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    title: 'Tipos de Documento',
    description: 'Personalice el catálogo de documentos permitidos (Oficios, Circulares, Memorándums, etc.).',
    icon: ScrollText,
    href: '/dashboard/config/catalogos',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    title: 'Auditoría del Sistema',
    description: 'Consulte el historial de acciones críticas realizadas en la plataforma para seguridad y control.',
    icon: History,
    href: '/dashboard/admin/logs',
    color: 'text-gray-600',
    bg: 'bg-gray-50',
  },
  {
    title: 'Configuraciones Generales',
    description: 'Ajustes globales del sistema, notificaciones y preferencias de la interfaz.',
    icon: Settings2,
    href: '/dashboard/settings/general',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
  },
];

export default function SettingsPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#9D2449] font-montserrat">Configuración del Sistema</h1>
        <p className="text-gray-500 mt-2 text-lg">Administre todos los aspectos operativos de la plataforma desde un solo lugar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configModules.map((module) => {
          const Icon = module.icon;
          return (
            <Link 
              key={module.title} 
              href={module.href}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${module.bg}`}>
                  <Icon className={`w-8 h-8 ${module.color}`} />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                    <ArrowRight size={20} />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2 font-montserrat group-hover:text-[#9D2449] transition-colors">
                {module.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {module.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
