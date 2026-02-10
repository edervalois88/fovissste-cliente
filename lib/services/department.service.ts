import api from '../api';

export interface DepartmentDTO {
  id: string; // Updated to UUID string
  name: string;
  code: string;
  description?: string;
  level?: string;
  titular_name?: string;
  email?: string;
  parent?: DepartmentDTO;
  children?: DepartmentDTO[];
}

export const DepartmentService = {
  // Obtener todas las áreas (para selectores)
  getAllDepartments: async () => {
    try {
      const response = await api.get('/departments');
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  getTree: async () => {
      try {
          const response = await api.get('/departments/tree');
          return response.data;
      } catch (error) {
          console.error('Error fetching department tree:', error);
          throw error;
      }
  },

  getDirectDescendants: async (id: string) => {
      try {
          const response = await api.get(`/departments/dependents/${id}`);
          return response.data;
      } catch (error) {
          console.error('Error fetching descendants:', error);
          throw error;
      }
  },

  createDepartment: async (data: Partial<DepartmentDTO> & { parent_id?: string }) => {
    try {
        const response = await api.post('/departments', data);
        return response.data;
    } catch (error) {
        console.error('Error creating department:', error);
        throw error;
    }
  },
};
