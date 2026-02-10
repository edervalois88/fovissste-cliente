'use client';

import { useState, useEffect } from 'react';
import { 
    DocumentsByAreaChart, 
    DocumentsTrendChart, 
    StatusDistributionChart 
} from '@/components/modules/dashboard/charts/DashboardCharts';
import { KpiWidget } from '@/components/modules/dashboard/widgets/KpiWidget';
import { IconReceived, IconProcess, IconCompleted, IconOverdue } from '@/components/ui/AnimatedIcons';
import { DocumentService } from '@/lib/services/document.service';
import { aggregateStats } from '@/utils/statsAggregator';
import { motion } from 'framer-motion';
import { RefreshCw, Download, Calendar, FilePlus } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

interface DashboardStats {
    total: number;
    pendientes: number;
    en_tramite: number;
    atendidos: number;
    vencidos: number;
}

export default function DashboardStatsPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pendientes: 0,
    en_tramite: 0,
    atendidos: 0,
    vencidos: 0
  });

  const [chartsData, setChartsData] = useState<any>({
      byArea: [],
      trend: [],
      byStatus: []
  });

  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [hasData, setHasData] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
        // Fetch Detailed Docs for Charts & Recent List (source of truth for consistency)
        const allDocs = await DocumentService.getAllDocuments();
        
        if (allDocs.length > 0) {
            setHasData(true);
            const agg = aggregateStats(allDocs);
            
            // Update stats from aggregation (guarantees sync with charts)
            setStats({
                total: agg.kpiSummary.total,
                pendientes: agg.kpiSummary.pendientes,
                en_tramite: agg.kpiSummary.en_tramite,
                atendidos: agg.kpiSummary.atendidos,
                vencidos: agg.kpiSummary.vencidos
            });

            setChartsData({
                byArea: agg.byArea,
                trend: agg.trend,
                byStatus: agg.byStatus
            });

            // Set Recent Docs (Limit 5)
            setRecentDocs(allDocs.slice(0, 5));
        } else {
            setHasData(false);
            // Reset to 0
             setStats({ total: 0, pendientes: 0, en_tramite: 0, atendidos: 0, vencidos: 0 });
             setChartsData({ byArea: [], trend: [], byStatus: [] });
             setRecentDocs([]);
        }
        
        setLastUpdated(new Date());

    } catch (error) {
        console.error('Failed to load dashboard data', error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
  };

  return (
    <div className="w-full font-montserrat min-h-screen bg-gray-50/50 p-6 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-extrabold text-[#9D2449]">Tablero de Control</h1>
            <p className="text-gray-500 mt-1 text-sm font-medium flex items-center gap-2">
                <Calendar size={14} /> 
                {format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })}
                <span className="text-gray-300">|</span>
                <span className="text-xs">Actualizado: {format(lastUpdated, 'HH:mm')}</span>
            </p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={fetchData} 
                className="btn btn-ghost btn-sm text-gray-500 hover:bg-gray-200"
                disabled={loading}
             >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
             </button>
             {hasData && (
                 <button className="btn btn-outline btn-sm text-[#9D2449] hover:bg-[#9D2449] hover:text-white gap-2">
                    <Download size={16} /> Exportar Reporte
                 </button>
             )}
        </div>
      </div>

      {!hasData && !loading ? (
             /* Empty State */
             <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-dashed border-gray-300 p-8 shadow-sm">
                 <div className="bg-gray-50 p-6 rounded-full mb-4">
                    <FilePlus size={48} className="text-[#9D2449] opacity-50" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-800 mb-2">No hay documentos registrados</h3>
                 <p className="text-gray-500 text-center max-w-md mb-8">
                     El sistema no ha detectado oficios en la base de datos. Comienza registrando tu primer oficio para visualizar las estadísticas.
                 </p>
                 <Link href="/dashboard/register" className="btn btn-primary bg-[#9D2449] border-none hover:bg-[#801c3a] text-white gap-2">
                     <FilePlus size={18} /> Registrar Nuevo Oficio
                 </Link>
             </div>
      ) : (
          <>
            {/* KPI Grid */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                <KpiWidget 
                    title="Total Recibidos" 
                    value={stats.total} 
                    trend="Actualizado hoy" 
                    icon={<IconReceived />}
                    className="border-t-4 border-[#9D2449] bg-white" 
                />
                <KpiWidget 
                    title="En Trámite" 
                    value={stats.en_tramite + stats.pendientes} 
                    trend="Prioridad Alta" 
                    icon={<IconProcess />}
                    className="border-t-4 border-[#B38E5D] bg-white" 
                />
                <KpiWidget 
                    title="Atendidos" 
                    value={stats.atendidos} 
                    trend="Efectividad" 
                    icon={<IconCompleted />}
                    className="border-t-4 border-green-600 bg-white" 
                />
                <KpiWidget 
                    title="Vencidos" 
                    value={stats.vencidos} 
                    trend="Requiere Atención" 
                    icon={<IconOverdue />}
                    className="border-t-4 border-red-600 bg-white" 
                />
            </motion.div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    <DocumentsTrendChart data={chartsData.trend} />
                    <DocumentsByAreaChart data={chartsData.byArea} />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <StatusDistributionChart data={chartsData.byStatus} />
                    
                    {/* Quick Actions Card */}
                    <div className="card bg-[#9D2449] text-white shadow-xl hover:shadow-2xl transition-shadow">
                        <div className="card-body">
                            <h2 className="card-title text-white text-lg font-bold">Acciones Rápidas</h2>
                            <p className="text-white/90 text-sm">Gestiona tus documentos pendientes.</p>
                            <div className="card-actions justify-end mt-4">
                                <Link href="/dashboard/register" className="btn bg-white text-[#9D2449] border-none hover:bg-gray-100 w-full mb-2 font-bold">
                                    Registrar Nuevo Oficio
                                </Link>
                                <Link href="/dashboard/inbox" className="btn btn-outline text-white border-white hover:bg-white hover:text-[#9D2449] w-full font-bold">
                                    Ir a Bandeja de Entrada
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Documents Table */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-extrabold text-lg text-gray-800 uppercase tracking-wide">Últimos Oficios Registrados</h3>
                        <p className="text-xs text-gray-400 font-bold">Mostrando los {recentDocs.length} registros más recientes</p>
                    </div>
                    <Link href="/dashboard/search" className="btn btn-ghost btn-sm text-[#B38E5D] font-bold hover:bg-transparent hover:underline hover:text-[#92744b]">
                        Ver todos
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-gray-50 text-gray-600 uppercase font-black text-xs tracking-wider">
                            <tr>
                                <th>Folio</th>
                                <th>Asunto</th>
                                <th>Remitente</th>
                                <th className="text-center">Fecha</th>
                                <th className="text-center">Estatus</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentDocs.length > 0 ? recentDocs.map((doc: any) => (
                                <tr key={doc.id} className="hover:bg-gray-50 transition-colors group border-b border-gray-100 last:border-none">
                                    <td className="font-mono font-bold text-gray-700 text-xs">
                                        {doc.official_number}
                                    </td>
                                    <td className="max-w-[200px] truncate text-sm font-semibold text-gray-800 py-4">
                                        {doc.description}
                                        {doc.priority === 'Urgente' && <span className="ml-2 badge badge-error badge-xs text-white gap-1 font-bold">URGENTE</span>}
                                    </td>
                                    <td className="text-xs font-medium text-gray-500">
                                        {doc.sender_dependency}
                                    </td>
                                    <td className="text-xs font-bold text-gray-500 text-center">
                                        {doc.reception_date ? format(new Date(doc.reception_date), 'dd MMM', { locale: es }).toUpperCase() : '-'}
                                    </td>
                                    <td className="text-center">
                                        <span className={`badge badge-sm font-bold text-white border-none py-3 px-3
                                            ${doc.status === 'ATENDIDO' ? 'bg-green-500' : 
                                            doc.status === 'PENDIENTE' ? 'bg-amber-400 text-amber-900' : 
                                            doc.status === 'EN_TRAMITE' || doc.status === 'EN_PROCESO' ? 'bg-blue-500' :
                                            'bg-gray-300'}
                                        `}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-xs btn-ghost opacity-0 group-hover:opacity-100 text-[#9D2449] font-bold">VER</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-400 font-medium">
                                        No hay documentos recientes.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
          </>
      )}
    </div>
  );
}
