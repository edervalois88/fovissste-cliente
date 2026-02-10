
import { 
  Eye, Plus, Edit, Trash2, CheckCircle2, XCircle, Download, FileText
} from 'lucide-react';

export type PermissionAction = 'read' | 'create' | 'update' | 'delete' | 'export' | 'approve' | 'reject';
export type ModuleName = 'documents' | 'users' | 'reports' | 'settings' | 'departments';

export interface ModuleConfig {
    id: ModuleName;
    label: string;
    description: string;
}

export const MODULES: ModuleConfig[] = [
    { id: 'documents', label: 'Gestión Documental', description: 'Control de oficios y expedientes' },
    { id: 'users', label: 'Usuarios y Roles', description: 'Administración de acceso' },
    { id: 'departments', label: 'Estructura Orgánica', description: 'Áreas y jerarquías' },
    { id: 'reports', label: 'Reportes', description: 'Estadísticas del sistema' },
    { id: 'settings', label: 'Configuración', description: 'Catálogos y ajustes globales' },
];

export const STANDARD_ACTIONS = [
    { id: 'read', label: 'Ver', icon: Eye },
    { id: 'create', label: 'Crear', icon: Plus },
    { id: 'update', label: 'Editar', icon: Edit },
    { id: 'delete', label: 'Eliminar', icon: Trash2 },
];

export const EXTRA_ACTIONS_MAP: Record<ModuleName, PermissionAction[]> = {
    'documents': ['approve', 'reject', 'export'],
    'users': [],
    'departments': [],
    'reports': ['export'],
    'settings': []
};

// Map for nice labels locally
export const SPECIAL_ACTION_LABELS: Record<string, string> = {
    'approve': 'Aprobar',
    'reject': 'Rechazar',
    'export': 'Exportar'
};

export const ROLES_LIST = ['Admin', 'Gestor', 'Auditor', 'Usuario'];
