'use client';
import { Shield, Lock, UserCheck } from 'lucide-react';

interface RolesHeaderProps {
    activeTab: 'matrix' | 'users';
    setActiveTab: (tab: 'matrix' | 'users') => void;
}

export const RolesHeader = ({ activeTab, setActiveTab }: RolesHeaderProps) => {
    return (
        <header className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center animate-in slide-in-from-top-2 duration-300">
            <div>
                <h1 className="text-3xl font-extrabold text-primary flex items-center gap-3">
                    <Shield className="fill-primary/10" size={32} />
                    Control de Accesos
                </h1>
                <p className="text-gray-500 mt-2 font-medium ml-1">Administre roles y configure permisos detallados.</p>
            </div>
            
            {/* Main View Toggles */}
            <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex gap-1 self-start md:self-auto">
                <button 
                    onClick={() => setActiveTab('matrix')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'matrix' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Lock size={16} /> Configurar Permisos
                </button>
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <UserCheck size={16} /> Asignar Roles
                </button>
            </div>
        </header>
    );
};
