
import { UserRole } from '@/lib/services/user.service'; // We might need to export UserRole type or define it here if not available

// Should match the roles used in the app
export type AppRole = 'Admin' | 'Gestor' | 'Auditor' | 'Usuario';

// Initial Route Configuration
// Maps a URL path prefix to the list of roles allowed to access it
export const ROUTE_PERMISSIONS: Record<string, AppRole[]> = {
    '/dashboard/stats': ['Admin', 'Gestor', 'Auditor', 'Usuario'], // Public for all logged users
    '/dashboard/inbox': ['Admin', 'Gestor', 'Auditor', 'Usuario'],
    '/dashboard/register': ['Admin', 'Gestor'], // Only creators
    '/dashboard/search': ['Admin', 'Gestor', 'Auditor', 'Usuario'],
    '/dashboard/reports': ['Admin', 'Auditor'], // Managers
    '/dashboard/settings/users': ['Admin'],
    '/dashboard/settings/roles': ['Admin'],
    '/dashboard/settings': ['Admin'], // Configuration root
};

export const hasPermission = (pathname: string, userRole: string): boolean => {
    // 1. Exact Match
    if (ROUTE_PERMISSIONS[pathname]) {
        return ROUTE_PERMISSIONS[pathname].includes(userRole as AppRole);
    }

    // 2. Prefix Match (Recursive check for nested routes like /settings/users/edit/1)
    // We check from longest prefix to shortest to be specific
    const protectedRoutes = Object.keys(ROUTE_PERMISSIONS).sort((a, b) => b.length - a.length);
    
    for (const route of protectedRoutes) {
        if (pathname.startsWith(route)) {
            return ROUTE_PERMISSIONS[route].includes(userRole as AppRole);
        }
    }

    // Default: If route is not listed, assume it's open or handle as 404 (Here we assume open for Dashboard sub-pages if not restricted)
    // But for security, better to default to TRUE (Allow) within dashboard if not explicitly blocked, 
    // OR restrict everything. 
    // Given the list above covers most, let's default to ALLOW for dashboard pages not listed (like /profile)
    return true; 
};
