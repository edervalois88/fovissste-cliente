'use client';

import { motion } from 'framer-motion';
import { MoreHorizontal, Lock, Save } from 'lucide-react';
import { 
    MODULES, 
    STANDARD_ACTIONS, 
    EXTRA_ACTIONS_MAP, 
    SPECIAL_ACTION_LABELS, 
    PermissionAction,
    ModuleName
} from './constants';

interface PermissionsMatrixProps {
  activeRole: string;
  permissions: Record<string, Record<string, PermissionAction[]>>;
  onToggle: (module: string, action: PermissionAction) => void;
  onSave: () => void;
  hasChanges: boolean;
}

export const PermissionsMatrix = ({ activeRole, permissions, onToggle, onSave, hasChanges }: PermissionsMatrixProps) => {
    return (
        <div className="bg-white rounded-b-xl rounded-tr-xl shadow-xl border border-gray-100 overflow-hidden relative animate-in fade-in duration-300">
             {/* Floating Save Button */}
             {hasChanges && (
                <div className="absolute bottom-6 right-6 z-20">
                    <button 
                        onClick={onSave}
                        className="btn btn-lg btn-success text-white border-none shadow-2xl flex gap-2 items-center hover:scale-105 transition-transform"
                    >
                        <Save size={20} /> Guardar Cambios
                    </button>
                </div>
            )}

            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Permisos para: <span className="text-primary">{activeRole}</span></h2>
                    <p className="text-xs text-gray-500 mt-1">
                        {activeRole === 'Admin' 
                            ? 'Acceso total y sin restricciones. No editable.' 
                            : 'Configure las acciones permitidas para este rol.'}
                    </p>
                </div>
                {activeRole === 'Admin' && (
                    <div className="badge badge-warning gap-2 p-3 font-bold text-white shadow-sm">
                        <Lock size={14} /> Modo Solo Lectura
                    </div>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50/80 text-left border-b border-gray-100">
                            <th className="py-4 px-6 font-bold text-gray-600 w-1/3">Módulo</th>
                            {STANDARD_ACTIONS.map(action => (
                                <th key={action.id} className="py-4 px-4 text-center font-bold text-gray-600 w-32">
                                    <div className="flex flex-col items-center gap-1">
                                        <action.icon size={16} className="text-primary" />
                                        <span className="text-xs">{action.label}</span>
                                    </div>
                                </th>
                            ))}
                            <th className="py-4 px-6 text-center font-bold text-gray-600">
                                <div className="flex flex-col items-center gap-1">
                                    <MoreHorizontal size={16} className="text-gray-400" />
                                    <span className="text-xs">Esp.</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {MODULES.map((module, idx) => {
                             // Use type assertion for ModuleName
                            const moduleId = module.id as ModuleName;
                            
                            return (
                                <motion.tr 
                                    key={moduleId} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="py-5 px-6">
                                        <p className="font-bold text-gray-800">{module.label}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{module.description}</p>
                                    </td>
                                    
                                    {STANDARD_ACTIONS.map(action => {
                                        const isChecked = permissions[activeRole]?.[moduleId]?.includes(action.id as PermissionAction);
                                        const isDisabled = activeRole === 'Admin';

                                        return (
                                            <td key={action.id} className="text-center p-4">
                                                <label className={`relative inline-flex items-center cursor-pointer ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer"
                                                        checked={isChecked}
                                                        disabled={isDisabled}
                                                        onChange={() => onToggle(moduleId, action.id as PermissionAction)}
                                                    />
                                                    <div className={`
                                                        w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                                                        peer-checked:after:translate-x-full peer-checked:after:border-white 
                                                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                                        after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                                                        after:transition-all peer-checked:bg-primary
                                                        shadow-inner
                                                    `}></div>
                                                </label>
                                            </td>
                                        );
                                    })}

                                    <td className="text-center py-4 px-6">
                                        <div className="flex gap-2 justify-center flex-wrap">
                                            {EXTRA_ACTIONS_MAP[moduleId]?.map(action => {
                                                const isChecked = permissions[activeRole]?.[moduleId]?.includes(action);
                                                const isDisabled = activeRole === 'Admin';
                                                
                                                return (
                                                    <button
                                                        key={action}
                                                        onClick={() => !isDisabled && onToggle(moduleId, action)}
                                                        className={`
                                                            px-2 py-1 text-[10px] uppercase font-bold rounded border transition-all
                                                            ${isChecked 
                                                                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-400 grayscale'
                                                            }
                                                            ${isDisabled ? 'cursor-not-allowed opacity-60' : 'hover:scale-105 active:scale-95'}
                                                        `}
                                                    >
                                                        {SPECIAL_ACTION_LABELS[action] || action}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
