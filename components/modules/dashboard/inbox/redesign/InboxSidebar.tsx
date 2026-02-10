'use client';

import { 
  Inbox, Star, FileText, Send, Trash2, 
  Briefcase, AlertCircle, Layout, PenTool, Calendar,
  Hash, Layers
} from 'lucide-react';

export interface FilterItem {
    id: string;
    label: string;
    icon: any;
    count?: number;
    color?: string; // For badges or dots
}

export const INBOX_FILTERS: FilterItem[] = [
    { id: 'inbox', label: 'Bandeja de Entrada', icon: Inbox, count: 214 },
    { id: 'marked', label: 'Marcados', icon: Star },
    { id: 'draft', label: 'Borradores', icon: FileText, count: 21 },
    { id: 'sent', label: 'Enviados', icon: Send },
    { id: 'trash', label: 'Papelera', icon: Trash2 },
];

export const WORK_FILTERS: FilterItem[] = [
    { id: 'custom_work', label: 'Trabajo Personalizado', icon: Layers, color: 'text-orange-400' },
    { id: 'important', label: 'Reuniones Importantes', icon: AlertCircle, color: 'text-green-500' },
    { id: 'work', label: 'Trabajo', icon: Briefcase, color: 'text-amber-500' },
    { id: 'design', label: 'Diseño', icon: PenTool, color: 'text-red-400' },
    { id: 'next_week', label: 'Próxima Semana', icon: Calendar, color: 'text-pink-400' },
];

interface InboxSidebarProps {
    activeFilter: string;
    onFilterChange: (id: string) => void;
    onCompose: () => void;
}

export const InboxSidebar = ({ activeFilter, onFilterChange, onCompose }: InboxSidebarProps) => {
    return (
        <div className="w-full lg:w-64 flex flex-col gap-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-full">
            <button 
                onClick={onCompose}
                className="btn btn-primary w-full text-white bg-[#5D6D9E] hover:bg-[#4a5880] border-none shadow-md gap-2 rounded-xl h-12 normal-case text-base font-medium"
            >
                <FileText size={18} /> Redactar
            </button>

            <div className="space-y-1">
                {INBOX_FILTERS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onFilterChange(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all
                            ${activeFilter === item.id 
                                ? 'bg-gray-100 text-gray-800 font-bold' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={18} className={activeFilter === item.id ? 'stroke-[2.5px]' : ''} />
                            {item.label}
                        </div>
                        {item.count && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                activeFilter === item.id 
                                    ? 'bg-gray-200 text-gray-800' 
                                    : 'bg-[#FBE9E7] text-[#D84315]' // Similar to reference image specific color
                            }`}>
                                {item.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="mt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Etiquetas</p>
                <div className="space-y-1">
                    {WORK_FILTERS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onFilterChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                                ${activeFilter === item.id 
                                    ? 'bg-gray-100 text-gray-800 font-bold' 
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                        >
                            <span className={`w-2 h-2 rounded-full ring-2 ring-transparent ${item.color?.replace('text-', 'bg-') || 'bg-gray-400'}`}></span>
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
