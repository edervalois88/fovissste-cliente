'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Edit2, Trash2, UserPlus, Loader2, RefreshCw } from 'lucide-react';
import { UserModal } from '@/components/modules/settings/UserModal';
import { UserService, UserDTO } from '@/lib/services/user.service';
import PageLoader from '@/components/ui/PageLoader';
// import { toast } from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDTO | null>(null);

  // Cargar usuarios al montar
  const fetchUsers = async () => {
    setLoading(true);
    try {
        const data = await UserService.getAllUsers();
        setUsers(data);
    } catch (error) {
        console.error('Error cargando usuarios:', error);
        // toast.error('Error al cargar usuarios');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrado simple (Frontend side por ahora)
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveUser = async (userData: UserDTO) => {
    try {
        if (editingUser && editingUser.id) {
            // Update
            await UserService.updateUser(editingUser.id, userData);
            // Optimistic update or refetch
            setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
        } else {
            // Create
            const newUser = await UserService.createUser(userData);
            setUsers(prev => [newUser, ...prev]);
        }
        setIsModalOpen(false);
        setEditingUser(null);
    } catch (error) {
        console.error('Error guardando usuario:', error);
        alert('Error al guardar usuario. Verifique la consola.');
    }
  };

  const handleDeleteUser = async (id: number) => {
      if(!confirm('¿Está seguro de eliminar este usuario?')) return;

      try {
          await UserService.deleteUser(id);
          setUsers(prev => prev.filter(u => u.id !== id));
      } catch (error) {
          console.error('Error eliminando usuario:', error);
      }
  };

  const openNewUserModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditUserModal = (user: UserDTO) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <PageLoader isVisible={loading} text="Cargando Usuarios..." />

      {/* Header de la Sección */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <a href="/dashboard/settings" className="hover:text-[#9D2449]">Configuración</a>
              <span>/</span>
              <span className="font-semibold text-gray-700">Usuarios</span>
           </div>
           <h1 className="text-3xl font-extrabold text-[#9D2449] font-montserrat">Gestión de Usuarios</h1>
           <p className="text-gray-500">Administre el acceso y roles del personal de la institución.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={fetchUsers}
                className="btn btn-ghost btn-circle"
                title="Recargar"
            >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
                onClick={openNewUserModal}
                className="btn bg-[#9D2449] hover:bg-[#801c3a] text-white border-none gap-2 px-6 shadow-md transition-transform active:scale-95"
            >
                <UserPlus size={18} />
                Nuevo Usuario
            </button>
        </div>
      </div>

      {/* Barra de Herramientas */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
            </div>
            <input 
                type="text" 
                placeholder="Buscar por nombre o correo..." 
                className="input input-bordered w-full pl-10 focus:border-[#9D2449] focus:ring-1 focus:ring-[#9D2449]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        {/* Filtros Dropdown (Visual Only for now) */}
        <div className="flex gap-2 w-full md:w-auto">
             <select className="select select-bordered select-sm w-full md:w-auto focus:border-[#9D2449]">
                <option disabled selected>Estado</option>
                <option>Activos</option>
                <option>Inactivos</option>
            </select>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[300px] relative">
        
        {loading && (
            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-[#9D2449] animate-spin mb-2" />
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cargando Usuarios...</p>
                </div>
            </div>
        )}

        <table className="table w-full">
            <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs tracking-wider">
                <tr>
                    <th className="py-4 pl-6">Usuario</th>
                    <th>Rol</th>
                    <th>Departamento</th>
                    <th>Estado</th>
                    <th>Último Acceso</th>
                    <th className="text-right pr-6">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="pl-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="avatar placeholder">
                                    <div className="bg-[#9D2449] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-sm">
                                        <span>{user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold text-gray-800">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span className={`badge border-0 font-semibold px-3 py-1 bg-opacity-20 ${
                                user.role === 'Admin' ? 'bg-red-500 text-red-700' :
                                user.role === 'Gestor' ? 'bg-blue-500 text-blue-700' :
                                user.role === 'Auditor' ? 'bg-purple-500 text-purple-700' :
                                'bg-gray-500 text-gray-700'
                            }`}>
                                {user.role || 'Usuario'}
                            </span>
                        </td>
                        <td className="text-gray-600 font-medium text-sm">
                            {user.department && typeof user.department === 'object' 
                                ? (user.department as any).name 
                                : String(user.department || '-')
                            }
                        </td>
                        <td>
                            <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className={`text-sm font-medium ${user.status === 'active' ? 'text-green-700' : 'text-gray-500'}`}>
                                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        </td>
                        <td className="text-gray-400 text-xs italic">
                            {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Nunca'}
                        </td>
                        <td className="text-right pr-6">
                            <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <button 
                                    className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50 tooltip" 
                                    data-tip="Editar"
                                    onClick={() => openEditUserModal(user)}
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    className="btn btn-ghost btn-xs text-red-600 hover:bg-red-50 tooltip" 
                                    data-tip="Eliminar"
                                    onClick={() => user.id && handleDeleteUser(user.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        {/* Empty State */}
        {!loading && filteredUsers.length === 0 && (
            <div className="text-center py-12">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-600">No se encontraron usuarios</h3>
                <p className="text-gray-500">Agregue uno nuevo para comenzar.</p>
            </div>
        )}
      </div>

      {/* Modal Integration */}
      {isModalOpen && (
        <UserModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={handleSaveUser}
            initialData={editingUser}
        />
      )}
    </div>
  );
}
