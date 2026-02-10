
import { format, subDays, isSameDay, parseISO, startOfDay, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';

export const aggregateStats = (documents: any[]) => {
    // Helper to determine status if not provided by backend
    const getStatus = (doc: any) => {
        if (!doc.deadline) return doc.status; // Fallback
        
        const now = new Date();
        const deadline = new Date(doc.deadline);
        
        // Check if overdue
        if (doc.status !== 'ATENDIDO' && doc.status !== 'CANCELADO' && isAfter(now, deadline)) {
            return 'VENCIDO';
        }
        return doc.status;
    };

    // 1. By Department (sender_dependency or assigned_department)
    const deptMap: Record<string, number> = {};
    documents.forEach(doc => {
        // Use assigned_department.name if available (relation), else sender_dependency
        const dept = doc.assigned_department?.name || doc.sender_dependency || 'Sin Asignar';
        const cleanDept = dept.length > 20 ? dept.substring(0, 20) + '...' : dept;
        deptMap[cleanDept] = (deptMap[cleanDept] || 0) + 1;
    });
    
    // Convert to array and sort
    const byArea = Object.keys(deptMap).map(key => ({
        name: key,
        value: deptMap[key]
    })).sort((a, b) => b.value - a.value).slice(0, 6); // Top 6

    // 2. Trend (Last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), 6 - i);
        return {
            date: format(d, 'dd MMM', { locale: es }),
            rawDate: startOfDay(d),
            incoming: 0,
            completed: 0
        };
    });

    documents.forEach(doc => {
        if (!doc.reception_date) return;
        const receptionDate = startOfDay(new Date(doc.reception_date));
        
        const dayStat = last7Days.find(d => isSameDay(d.rawDate, receptionDate));
        if (dayStat) {
            dayStat.incoming++;
        }

        if (doc.status === 'ATENDIDO' && doc.attended_at) {
             const attendedDate = startOfDay(new Date(doc.attended_at));
             const dayStatAttended = last7Days.find(d => isSameDay(d.rawDate, attendedDate));
             if (dayStatAttended) {
                 dayStatAttended.completed++;
             }
        }
    });

    // 3. Status Distribution
    const statusMap = {
        'Pendiente': 0,
        'En Trámite': 0,
        'Atendido': 0,
        'Vencido': 0
    };

    documents.forEach(doc => {
        const computedStatus = getStatus(doc);
        const statusKey = computedStatus.toUpperCase();

        if (statusKey === 'VENCIDO') statusMap['Vencido']++;
        else if (statusKey === 'ATENDIDO') statusMap['Atendido']++;
        else if (statusKey === 'EN_PROCESO' || statusKey === 'EN_TRAMITE') statusMap['En Trámite']++;
        else statusMap['Pendiente']++;
    });

    const byStatus = Object.keys(statusMap).map(key => ({
        name: key,
        value: statusMap[key as keyof typeof statusMap]
    })).filter(item => item.value > 0); // Only positive values

    // 4. Calculate KPI summaries from full list (source of truth)
    const kpiSummary = {
        total: documents.length,
        pendientes: statusMap['Pendiente'],
        en_tramite: statusMap['En Trámite'],
        atendidos: statusMap['Atendido'],
        vencidos: statusMap['Vencido']
    };

    return {
        byArea,
        trend: last7Days,
        byStatus,
        kpiSummary
    };
};
