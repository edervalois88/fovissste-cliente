'use client';

import { ActivityStep } from './constants';
import { 
    Clock, 
    CheckCircle2, 
    Edit2,
    Upload,
    Trash2,
    FolderInput,
    ArrowRight,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';



interface DocumentLifecycleProps {
    steps: ActivityStep[];
    onClose: () => void;
    currentStatus?: string;
}

const TYPE_CONFIG = {
    'edit': { icon: Edit2, color: 'text-blue-500', bg: 'bg-blue-100' },
    'upload': { icon: Upload, color: 'text-indigo-500', bg: 'bg-indigo-100' },
    'delete': { icon: Trash2, color: 'text-red-500', bg: 'bg-red-100' },
    'move': { icon: FolderInput, color: 'text-blue-400', bg: 'bg-blue-50' },
    'create': { icon: FileText, color: 'text-green-500', bg: 'bg-green-100' },
    'attend': { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-100' },
};

export const DocumentLifecycle = ({ steps, onClose, currentStatus = 'Pendiente' }: DocumentLifecycleProps) => {
    // Determine the pending step if status is not 'Atendido'
    const isPending = currentStatus !== 'Atendido';

    return (
        <div className="w-80 h-full p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-gray-800 text-lg">Actividad del Archivo</h3>
                <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                    <ArrowRight size={18} />
                </button>
            </div>

            <div className="relative pl-4 space-y-8 before:absolute before:left-8 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                {steps.map((step, idx) => {
                    const config = TYPE_CONFIG[step.type] || TYPE_CONFIG['create'];
                    const Icon = config.icon;

                    return (
                        <motion.div 
                            key={step.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative flex gap-4 items-start"
                        >
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm
                                ${config.bg} ${config.color}
                            `}>
                                <Icon size={14} />
                            </div>
                            
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{step.user}</p>
                                <p className="text-xs text-gray-500 mt-0.5 leading-snug">{step.description}</p>
                                <p className="text-[10px] text-gray-400 font-medium mt-1">{step.timestamp}</p>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Pendiente Step - Grayed out */}
                {isPending && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: steps.length * 0.1 }}
                        className="relative flex gap-4 items-start"
                    >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm bg-gray-200 text-gray-500">
                            <Clock size={14} />
                        </div>
                        
                        <div>
                            <p className="font-bold text-gray-400 text-sm italic">Siguiente Paso...</p>
                            <p className="text-xs text-gray-400 mt-0.5 leading-snug">Esperando atención o firma</p>
                        </div>
                    </motion.div>
                )}

                <div className="relative flex gap-4 items-center pt-4">
                     <button className="btn btn-sm btn-ghost w-full bg-blue-50 text-blue-600 hover:bg-blue-100 normal-case">
                        Ver Actividad Completa
                     </button>
                </div>
            </div>
        </div>
    );
};
