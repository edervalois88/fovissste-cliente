'use client';

// Moved ActivityStep definition here to avoid circular dependency
export interface ActivityStep {
    id: string;
    action: string;
    description: string;
    user: string;
    timestamp: string;
    type: 'edit' | 'upload' | 'delete' | 'move' | 'create' | 'attend';
}

// This would eventually be fetched from the backend or mapped from backend history
export const MOCK_HISTORY: Record<string, ActivityStep[]> = {
    // We can use a function to generate mock history for specific IDs if needed
};

export const getStatusConfig = (status: string) => {
    switch(status.toLowerCase()) {
        case 'pendiente': return { color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', label: 'Pendiente' };
        case 'en_revision': return { color: 'bg-indigo-50 text-indigo-600', dot: 'bg-indigo-400', label: 'En Revisión' };
        case 'atendido': return { color: 'bg-green-50 text-green-600', dot: 'bg-green-500', label: 'Atendido' };
        case 'rechazado': return { color: 'bg-red-50 text-red-600', dot: 'bg-red-500', label: 'Rechazado' };
        default: return { color: 'bg-gray-50 text-gray-500', dot: 'bg-gray-300', label: status };
    }
};

export const DEPARTMENTS = [
  { value: 'all', label: 'Todas las Áreas' },
  { value: 'SUBDIRECCION_CREDITO', label: 'Subdirección de Crédito' },
  { value: 'SUBDIRECCION_FINANZAS', label: 'Subdirección de Finanzas' },
  { value: 'SUBDIRECCION_JURIDICA', label: 'Subdirección Jurídica' },
  { value: 'SUBDIRECCION_TECNICA', label: 'Subdirección Técnica' },
];

export const STATUS_FILTERS = [
    { id: 'all', label: 'Todos', count: 0 },
    { id: 'pendientes', label: 'Pendientes', count: 0, color: 'text-red-500' },
    { id: 'atendidos', label: 'Atendidos', count: 0, color: 'text-green-500' },
    { id: 'turnados', label: 'Turnados', count: 0, color: 'text-blue-500' },
];
