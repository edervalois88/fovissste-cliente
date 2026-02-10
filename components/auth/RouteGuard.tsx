'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { hasPermission } from '@/lib/permissions';
import PageLoader from '@/components/ui/PageLoader';

interface RouteGuardProps {
    children: React.ReactNode;
}

export const RouteGuard = ({ children }: RouteGuardProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // 1. Get User/Token from Storage
        const userStr = localStorage.getItem('user');
        
        if (!userStr) {
            router.push('/'); // Redirect to Login
            return;
        }

        try {
            const user = JSON.parse(userStr);
            const userRole = user.role || 'Usuario'; // Fallback to basic user

            // 2. Check Permission
            if (pathname.includes('/dashboard')) { // Only protect dashboard routes
                const isAllowed = hasPermission(pathname, userRole);
                if (isAllowed) {
                    setAuthorized(true);
                } else {
                    router.push('/dashboard/unauthorized'); // Create this page or redirect to index
                }
            } else {
                setAuthorized(true); // Public routes (like login)
            }
        } catch (e) {
            console.error('Invalid user data', e);
            router.push('/');
        }
    }, [pathname, router]);

    // Simple loading or empty state while checking
    if (!authorized) {
        return (
            <PageLoader isVisible={true} text="Verificando Acceso..." />
        );
    }

    return <>{children}</>;
};
