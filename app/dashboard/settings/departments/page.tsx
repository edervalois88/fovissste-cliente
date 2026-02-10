'use client';

import { useState, useEffect } from 'react';
import { Building2, Search, RefreshCw, FolderTree, ChevronRight, Plus } from 'lucide-react';
import { DepartmentService, DepartmentDTO } from '@/lib/services/department.service';
import { DepartmentModal } from '@/components/modules/settings/DepartmentModal'; // Import modal
import PageLoader from '@/components/ui/PageLoader';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const fetchDepartments = async () => {
    setLoading(true);
    try {
        const data = await DepartmentService.getAllDepartments();
        // Flatten list is easier for table, assuming getAll returns flat list
        setDepartments(data);
    } catch (error) {
        console.error('Error cargando departamentos:', error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSaveDepartment = async (data: any) => {
      try {
          await DepartmentService.createDepartment(data);
          fetchDepartments();
          setIsModalOpen(false);
      } catch (error) {
          console.error(error);
          alert('Error al crear departamento');
      }
  };

  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <PageLoader isVisible={loading} text="Cargando Estructura..." />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <a href="/dashboard/settings" className="hover:text-[#9D2449]">Configuración</a>
              <span>/</span>
              <span className="font-semibold text-gray-700">Estructura</span>
           </div>
           <h1 className="text-3xl font-extrabold text-[#9D2449] font-montserrat">Estructura Organizacional</h1>
           <p className="text-gray-500">Visualice y gestione las Unidades Administrativas y Departamentos.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={fetchDepartments}
                className="btn btn-ghost btn-circle"
                title="Recargar"
            >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="btn bg-[#9D2449] hover:bg-[#801c3a] text-white border-none gap-2 px-4 shadow-md transition-transform active:scale-95"
            >
                <Plus size={18} />
                Nueva Área
            </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex items-center">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar área o clave..." 
                    className="input input-bordered w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
            <div className="p-12 text-center text-gray-500">Cargando estructura...</div>
        ) : (
            <table className="table w-full">
                <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500">
                    <tr>
                        <th className="pl-6">Clave</th>
                        <th>Nombre de la Unidad</th>
                        <th>Nivel</th>
                        <th>Depende de</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredDepartments.map((dept) => (
                        <tr key={dept.id} className="hover:bg-gray-50">
                            <td className="pl-6 font-mono text-xs font-bold text-[#9D2449]">
                                {dept.code}
                            </td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <FolderTree size={16} className="text-gray-400" />
                                    <span className="font-semibold text-gray-700">{dept.name}</span>
                                </div>
                                {dept.description && <p className="text-xs text-gray-400 ml-6">{dept.description}</p>}
                            </td>
                            <td>
                                <span className="badge badge-ghost badge-sm">{dept.level || 'N/A'}</span>
                            </td>
                            <td className="text-sm text-gray-500">
                                {dept.parent ? (
                                    <div className="flex items-center gap-1">
                                        <ChevronRight size={14} />
                                        <span>{dept.parent.name}</span>
                                    </div>
                                ) : (
                                    <span className="italic text-gray-300">Dirección General</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    {filteredDepartments.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center py-8 text-gray-500">
                                No se encontraron departamentos.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        )}
      </div>

      {isModalOpen && (
        <DepartmentModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSaveDepartment}
            allDepartments={departments}
        />
      )}
    </div>
  );
}
