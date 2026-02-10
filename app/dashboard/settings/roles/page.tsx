'use client';

import { useState, useEffect } from 'react';
import { UserService, UserDTO } from '@/lib/services/user.service';
import { Toast } from '@/components/ui/Toast';
import { AnimatePresence, motion } from 'framer-motion';
import PageLoader from '@/components/ui/PageLoader';

// Feature Components
import { RolesHeader } from '@/components/features/roles/RolesHeader';
import { RoleSelector } from '@/components/features/roles/RoleSelector';
import { PermissionsMatrix } from '@/components/features/roles/PermissionsMatrix';
import { UsersTab } from '@/components/features/roles/UsersTab';
import { PermissionAction } from '@/components/features/roles/constants';

// Initial Mock State
const INITIAL_PERMISSIONS: Record<string, Record<string, PermissionAction[]>> = {
    'Admin': {
        'documents': ['read', 'create', 'update', 'delete', 'approve', 'reject', 'export'],
        'users': ['read', 'create', 'update', 'delete'],
        'departments': ['read', 'update'],
        'reports': ['read', 'export'],
        'settings': ['update'],
    },
    'Gestor': {
        'documents': ['read', 'create', 'approve', 'reject'],
        'users': ['read'],
        'departments': ['read'],
        'reports': ['read'],
        'settings': [],
    },
    'Auditor': {
        'documents': ['read', 'export'],
        'users': ['read'],
        'departments': ['read'],
        'reports': ['read', 'export'],
        'settings': [],
    },
    'Usuario': {
        'documents': ['read'], 
        'users': [],
        'departments': [],
        'reports': [],
        'settings': [],
        'config': []
    }
};

export default function RolesPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'matrix'>('matrix');
  const [activeRole, setActiveRole] = useState('Admin'); // For Matrix
  
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' as 'success' | 'error' });
  
  // Matrix State
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      setToast({ show: true, msg: 'Error al cargar usuarios.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (id: number, role: string) => {
    try {
      await UserService.updateUser(id, { role: role as any });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: role as any } : u));
      setToast({ show: true, msg: 'Rol de usuario actualizado correctamente.', type: 'success' });
    } catch (err) {
      setToast({ show: true, msg: 'Error al actualizar el usuario.', type: 'error' });
    }
  };

  const handleTogglePermission = (module: string, action: PermissionAction) => {
      if (activeRole === 'Admin') {
          setToast({ show: true, msg: 'El rol de Admin no se puede modificar.', type: 'error' });
          return;
      }

      setPermissions(prev => {
          const rolePerms = { ...prev[activeRole] };
          const moduleActions = rolePerms[module] || [];
          
          let newModuleActions;
          if (moduleActions.includes(action)) {
              newModuleActions = moduleActions.filter(a => a !== action);
          } else {
              newModuleActions = [...moduleActions, action];
          }

          return {
              ...prev,
              [activeRole]: {
                  ...rolePerms,
                  [module]: newModuleActions
              }
          };
      });
      setHasChanges(true);
  };

  const handleSavePermissions = () => {
      setToast({ show: true, msg: 'Matriz de permisos guardada correctamente.', type: 'success' });
      setHasChanges(false);
      // API call would be: api.post('/roles/permissions', permissions);
  };

  return (
    <div className="w-full font-montserrat p-4 min-h-screen bg-gray-50/50">
      <PageLoader isVisible={loading} text="Cargando Roles y Permisos..." />
      <Toast 
        visible={toast.show} 
        message={toast.msg} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />

      <RolesHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <AnimatePresence mode="wait">
        {activeTab === 'matrix' ? (
            <motion.div 
                key="matrix"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
            >
                <div className="flex flex-col gap-0">
                    <RoleSelector activeRole={activeRole} onSelectRole={setActiveRole} />
                    
                    <PermissionsMatrix 
                        activeRole={activeRole}
                        permissions={permissions}
                        onToggle={handleTogglePermission}
                        onSave={handleSavePermissions}
                        hasChanges={hasChanges}
                    />
                </div>
            </motion.div>
        ) : (
            <motion.div 
                key="users"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
            >
                <UsersTab 
                    users={users} 
                    isLoading={loading}
                    onUpdateRole={handleUpdateUserRole}
                />
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
