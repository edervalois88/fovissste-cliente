import api from '../api';

export interface UserDTO {
  id?: number;
  name: string;
  email: string;
  department?: string | any; // Allow object or string for display
  department_id?: string; // For assignment
  role?: 'Admin' | 'Gestor' | 'Auditor' | 'Usuario';
  status?: 'active' | 'inactive';
  password?: string;
  last_login?: string;
}

export const UserService = {
  
  // Obtener todos los usuarios
  getAllUsers: async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
  },

  // Crear usuario (Local o Importado)
  createUser: async (userData: UserDTO) => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
  },

  // Actualizar usuario existente
  updateUser: async (id: number, userData: Partial<UserDTO>) => {
    try {
        const response = await api.patch(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error(`Error updating user ${id}:`, error);
        throw error;
    }
  },

  // Eliminar usuario (Soft Delete o Hard Delete según backend)
  deleteUser: async (id: number) => {
    try {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting user ${id}:`, error);
        throw error;
    }
  },

  // Futura integración: Forzar sincronización LDAP manual
  syncLdap: async () => {
      try {
          const response = await api.post('/users/ldap/sync');
          return response.data;
      } catch (error) {
          console.error('LDAP Sync failed:', error);
          throw error;
      }
  }
};
