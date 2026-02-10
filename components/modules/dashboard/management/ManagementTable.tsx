'use client';
import { useState } from 'react';
import { Search, Filter, ArrowRightLeft, XCircle, CheckCircle, Clock, AlertCircle, Printer } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { VolanteDocumento } from '../documents/pdf/VolanteDocumento';
import QRCode from 'qrcode';

interface ManagementTableProps {
  documents: any[];
  onReassign: (doc: any) => void;
  onReject: (doc: any) => void;
}

export const ManagementTable = ({ documents, onReassign, onReject }: ManagementTableProps) => {
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredDocs = documents.filter(doc => {
      const matchesText = 
        doc.official_number?.toLowerCase().includes(filterText.toLowerCase()) || 
        doc.description?.toLowerCase().includes(filterText.toLowerCase()) ||
        doc.sender_name?.toLowerCase().includes(filterText.toLowerCase());
      
      const matchesStatus = statusFilter ? doc.status === statusFilter : true;
      
      return matchesText && matchesStatus;
  });

  const handlePrint = async (doc: any) => {
      try {
        const qrUrl = await QRCode.toDataURL(`https://sgd.fovissste.gob.mx/validate/${doc.id}`);
        const blob = await pdf(<VolanteDocumento document={doc} qrCodeUrl={qrUrl} />).toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } catch (e) {
        console.error("PDF Error", e);
        alert("Error generando PDF");
      }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Filters Toolbar */}
      <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between bg-gray-50">
          <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Buscar por folio, asunto o remitente..." 
                    className="input input-sm input-bordered w-full pl-9 focus:border-[#9D2449]"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                />
          </div>
          <div className="flex gap-2">
              <select 
                className="select select-sm select-bordered"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                  <option value="">Todos los Estatus</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="EN_PROCESO">En Proceso</option>
                  <option value="ATENDIDO">Atendido</option>
              </select>
          </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-xs w-full">
            <thead className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider">
            <tr>
                <th className="w-10 text-center">Estatus</th>
                <th>Folio</th>
                <th>Asunto</th>
                <th>Área Asignada</th>
                <th>Fecha Límite</th>
                <th className="text-right pr-4">Gestión</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
            {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-blue-50 transition-colors h-14 group">
                    <td className="text-center align-middle">
                        {doc.status === 'PENDIENTE' && <Clock size={16} className="text-gray-400 mx-auto" />}
                        {doc.status === 'EN_PROCESO' && <Clock size={16} className="text-amber-500 mx-auto" />}
                        {doc.status === 'ATENDIDO' && <CheckCircle size={16} className="text-green-500 mx-auto" />}
                    </td>
                    <td className="font-mono font-bold text-gray-700 align-middle text-xs">{String(doc.official_number)}</td>
                    <td className="max-w-xs align-middle py-2">
                        <div className="truncate font-semibold text-gray-800 text-xs" title={String(doc.description)}>{String(doc.description)}</div>
                        <div className="text-[10px] text-gray-400 truncate">{String(doc.sender_name)} - {String(doc.sender_dependency)}</div>
                    </td>
                    <td className="align-middle">
                        <span className="badge badge-ghost badge-sm text-[10px] whitespace-nowrap">
                            {doc.assigned_department?.name || 'Sin Asignar'}
                        </span>
                    </td>
                    <td className="align-middle text-xs text-gray-500">
                        {new Date(doc.deadline).toLocaleDateString()}
                    </td>
                    <td className="text-right align-middle pr-4">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                className="btn btn-xs btn-outline hover:bg-gray-600 hover:text-white text-gray-500"
                                title="Imprimir Volante"
                                onClick={() => handlePrint(doc)}
                            >
                                <Printer size={12} />
                            </button>
                            <button 
                                className="btn btn-xs btn-outline hover:bg-blue-600 hover:text-white"
                                title="Reasignar"
                                onClick={() => onReassign(doc)}
                            >
                                <ArrowRightLeft size={12} />
                            </button>
                            <button 
                                className="btn btn-xs btn-outline hover:bg-red-600 hover:text-white border-red-200 text-red-400"
                                title="Rechazar"
                                onClick={() => onReject(doc)}
                            >
                                <XCircle size={12} />
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
      
      {filteredDocs.length === 0 && (
          <div className="text-center py-12 text-gray-400">
              No se encontraron documentos con los filtros actuales.
          </div>
      )}
    </div>
  );
};
