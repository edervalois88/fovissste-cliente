'use client';

import { useState } from 'react';
import { 
  Inbox, 
  Send, 
  FileText, 
  Archive, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

type FilterType = 'all' | 'pendientes' | 'urgentes' | 'atendidos' | 'vencidos';

interface SummaryCardsProps {
    stats: {
        total: number;
        pendientes: number;
        urgentes: number;
        atendidos: number;
        vencidos: number;
    };
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

export const SummaryCards = ({ stats, activeFilter, onFilterChange }: SummaryCardsProps) => {
    
    const cards = [
        { 
            id: 'all', 
            label: 'Total Documentos', 
            count: stats.total, 
            icon: Inbox, 
            color: 'bg-blue-50 text-blue-600',
            border: 'border-blue-200' 
        },
        { 
            id: 'pendientes', 
            label: 'Pendientes', 
            count: stats.pendientes, 
            icon: Clock, 
            color: 'bg-amber-50 text-amber-600',
             border: 'border-amber-200'
        },
        { 
            id: 'urgentes', 
            label: 'Urgentes', 
            count: stats.urgentes, 
            icon: AlertCircle, 
            color: 'bg-red-50 text-red-600',
             border: 'border-red-200'
        },
        { 
            id: 'atendidos', 
            label: 'Atendidos', 
            count: stats.atendidos, 
            icon: CheckCircle2, 
            color: 'bg-green-50 text-green-600',
             border: 'border-green-200'
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cards.map((card) => {
                const isActive = activeFilter === card.id;
                const Icon = card.icon;

                return (
                    <motion.div
                        key={card.id}
                        layoutId={card.id}
                        onClick={() => onFilterChange(card.id as FilterType)}
                        className={`
                            cursor-pointer rounded-xl p-4 border transition-all relative overflow-hidden group
                            ${isActive 
                                ? `shadow-md ring-2 ring-offset-2 ring-[#9D2449]/20 border-[#9D2449] bg-white` 
                                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }
                        `}
                    >
                        <div className="flex justify-between items-start z-10 relative">
                            <div>
                                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isActive ? 'text-[#9D2449]' : 'text-gray-400'}`}>
                                    {card.label}
                                </p>
                                <h3 className="text-2xl font-black text-gray-800">{card.count}</h3>
                            </div>
                            <div className={`p-2 rounded-lg ${isActive ? 'bg-[#9D2449] text-white' : card.color}`}>
                                <Icon size={20} />
                            </div>
                        </div>
                        
                        {/* Decorative background element on hover/active */}
                        <div className={`
                            absolute -bottom-4 -right-4 opacity-10 transition-transform group-hover:scale-110
                            ${isActive ? 'text-[#9D2449]' : 'text-gray-400'}
                        `}>
                            <Icon size={80} />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};
