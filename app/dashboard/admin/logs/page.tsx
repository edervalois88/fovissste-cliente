'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import PageLoader from '@/components/ui/PageLoader';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async (term = '') => {
      setLoading(true);
      try {
          // Adjust endpoint as needed. Using generic search or findAll.
          // The controller has search param.
          const res = await api.get(`/audit?search=${term}`);
          setLogs(res.data);
      } catch (err) {
          console.error("Error fetching logs", err);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchLogs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      fetchLogs(searchTerm);
  };

  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#9D2449]">Auditoría del Sistema</h1>
        <p className="text-gray-500 text-sm">Registro de actividades y eventos de seguridad.</p>

        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Buscar por usuario, acción o folio..." 
                        className="input input-sm input-bordered w-full pl-9"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-sm bg-[#9D2449] text-white hover:bg-[#801d3a]">
                    Buscar
                </button>
            </form>

            {loading ? <PageLoader /> : (
                <div className="overflow-x-auto">
                    <table className="table table-xs w-full">
                        <thead className="bg-gray-50 text-gray-600 font-bold uppercase">
                            <tr>
                                <th>Fecha</th>
                                <th>Usuario</th>
                                <th>Acción</th>
                                <th>Entidad</th>
                                <th>IP</th>
                                <th>Detalles</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="whitespace-nowrap font-mono text-xs">
                                        {format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}
                                    </td>
                                    <td>
                                        <div className="font-semibold text-xs">{log.user_email}</div>
                                        <div className="text-[10px] text-gray-400">ID: {log.user_id?.substring(0,8)}...</div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-sm ${log.method === 'DELETE' ? 'badge-error text-white' : 'badge-ghost'}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="text-xs">
                                        {log.entity} <span className="text-gray-400">#{log.entity_id}</span>
                                    </td>
                                    <td className="font-mono text-[10px]">{log.ip_address}</td>
                                    <td>
                                        {log.new_values && (
                                            <div className="dropdown dropdown-left dropdown-hover">
                                                <div tabIndex={0} role="button" className="btn btn-xs btn-ghost text-blue-600">JSON</div>
                                                <div tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-64 max-h-48 overflow-auto text-[10px] whitespace-pre-wrap">
                                                    {log.new_values}
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {logs.length === 0 && <div className="text-center py-8 text-gray-400">No se encontraron registros.</div>}
                </div>
            )}
        </div>
    </div>
  );
}
