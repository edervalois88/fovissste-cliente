'use client';

import { motion } from 'framer-motion';
import { ROLES_LIST } from './constants';

interface RoleSelectorProps {
    activeRole: string;
    onSelectRole: (role: string) => void;
}

export const RoleSelector = ({ activeRole, onSelectRole }: RoleSelectorProps) => {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {ROLES_LIST.map(role => (
                <button
                    key={role}
                    onClick={() => onSelectRole(role)}
                    className={`
                        relative px-6 py-3 rounded-t-xl font-bold text-sm transition-all border-b-2 whitespace-nowrap
                        ${activeRole === role 
                            ? 'bg-white text-primary border-primary shadow-sm z-10' 
                            : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 hover:text-gray-700'
                        }
                    `}
                >
                    {role}
                    {activeRole === role && (
                        <motion.div 
                            layoutId="activeRoleIndicator"
                            className="absolute top-0 left-0 w-full h-1 bg-primary rounded-t-xl" 
                        />
                    )}
                </button>
            ))}
        </div>
    );
};
