'use client';

import { useState } from 'react';
import { UserDTO } from '@/lib/services/user.service';
import { Search, Edit, CheckCircle2, AlertCircle } from 'lucide-react';
import { ROLES_LIST } from './constants';
import { motion } from 'framer-motion';

interface UsersTabProps {
    users: UserDTO[];
    onUpdateRole: (id: number, role: string) => Promise<void>;
    isLoading: boolean;
}

export const UsersTab = ({ users, onUpdateRole, isLoading }: UsersTabProps) => {
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [selectedUserRole, setSelectedUserRole] = useState('');

    const startEdit = (user: UserDTO) => {
        setEditingId(user.id!);
        setSelectedUserRole(user.role || 'Usuario');
    };

    const handleSave = async (id: number) => {
        await onUpdateRole(id, selectedUserRole);
        setEditingId(null);
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) || 
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Header / Search */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar usuario..." 
                        className="input input-sm input-bordered pl-10 w-full bg-white focus:outline-primary"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div className="flex gap-2 text-xs font-bold text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error"></span> Admin</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning"></span> Gestor</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-info"></span> Auditor</span>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="p-12 text-center text-gray-400">
                    <span className="loading loading-spinner text-primary loading-lg"></span>
                    <p className="mt-4 text-sm">Cargando usuarios...</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                            <tr>
                                <th className="pl-6 py-4">Usuario</th>
                                <th>Departamento</th>
                                <th>Rol Asignado</th>
                                <th className="text-right pr-6">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <motion.tr 
                                        key={user.id} 
                                        className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                        layout
                                    >
                                        <td className="pl-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`avatar placeholder ${user.role === 'Admin' ? 'online' : ''}`}>
                                                    <div className="bg-primary text-primary-content rounded-xl w-10 shadow-sm">
                                                        <span className="text-sm font-bold">{user.name.charAt(0)}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800">{user.name}</div>
                                                    <div className="text-xs text-gray-500 font-mono">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium border border-gray-200">
                                                {typeof user.department === 'object' ? user.department?.name : 'General'}
                                            </span>
                                        </td>
                                        <td>
                                            {editingId === user.id ? (
                                                <select 
                                                    className="select select-sm select-bordered w-32 focus:border-primary focus:ring-1 focus:ring-primary"
                                                    value={selectedUserRole}
                                                    onChange={(e) => setSelectedUserRole(e.target.value)}
                                                    autoFocus
                                                >
                                                    {ROLES_LIST.map(r => <option key={r} value={r}>{r}</option>)}
                                                </select>
                                            ) : (
                                                <span className={`badge border-none text-white font-bold py-3 shadow-sm ${
                                                    user.role === 'Admin' ? 'badge-error' : 
                                                    user.role === 'Gestor' ? 'badge-warning' : 
                                                    user.role === 'Auditor' ? 'badge-info' : 'badge-ghost text-gray-500 bg-gray-200'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-right pr-6">
                                            {editingId === user.id ? (
                                                <div className="join shadow-sm">
                                                    <button onClick={() => handleSave(user.id!)} className="btn btn-sm btn-success join-item text-white border-0"><CheckCircle2 size={16}/></button>
                                                    <button onClick={handleCancel} className="btn btn-sm btn-ghost join-item text-gray-500 bg-gray-100"><AlertCircle size={16}/></button>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => startEdit(user)}
                                                    className="btn btn-sm btn-ghost text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-gray-400 italic">
                                        No se encontraron usuarios que coincidan con la búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
