'use client';
import { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, FileText, ArrowRight, Lock, Paperclip, Eye, Activity } from 'lucide-react';
import { AttendDocumentModal } from './AttendDocumentModal';

// Status Icons map
const StatusIcon = ({ timeStatus }: { timeStatus: string }) => {
  if (timeStatus === 'VENCIDO') return <AlertCircle size={18} className="text-red-600" />;
  if (timeStatus === 'POR VENCER') return <Clock size={18} className="text-amber-500" />;
  return <CheckCircle size={18} className="text-green-500" />;
};

interface InboxTableProps {
    documents: any[];
    onRefresh: () => void;
    onShowLifecycle?: (docId: string) => void;
    onShowAttachment?: (docUrl?: string, encrypted?: boolean) => void;
}

export const InboxTable = ({ documents, onRefresh, onShowLifecycle, onShowAttachment }: InboxTableProps) => {
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  // Helper to safely format numbers or strings
  const formatText = (text: any) => text ? String(text) : '';

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <table className="table table-xs w-full">
        <thead className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider">
          <tr>
             <th className="w-10 text-center">Estatus</th>
            <th>Folio</th>
            <th>Asunto</th>
            <th>Remitente</th>
            <th>Fecha Límite</th>
            <th className="text-right pr-4">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {documents.map((doc) => {
            const isUrgente = doc.priority === 'Urgente';
            const hasAttachment = Boolean(doc.attachment_url); // In real app check if url exists
            const isEncrypted = Boolean(doc.is_encrypted); // Check flag

            return (
              <tr 
                key={doc.id} 
                className={`transition-colors h-14 ${
                    isUrgente ? 'bg-red-50 border-l-4 border-l-red-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                }`}
              >
                <td className="text-center align-middle">
                    <div className="tooltip" data-tip={doc.time_status}>
                        <div className="flex justify-center">
                             <StatusIcon timeStatus={doc.time_status} />
                        </div>
                    </div>
                </td>
                <td className="font-mono font-bold text-gray-700 align-middle text-xs">{formatText(doc.official_number)}</td>
                <td className="max-w-xs align-middle py-2" title={formatText(doc.description)}>
                    <div className="truncate font-semibold text-gray-800 text-xs">{formatText(doc.description)}</div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-500">
                        {hasAttachment && (
                          <span className="inline-flex items-center gap-1">
                            <Paperclip size={12} /> Adjunto
                          </span>
                        )}
                        {isEncrypted && (
                          <span className="inline-flex items-center gap-1 text-amber-700">
                            <Lock size={12} /> Cifrado
                          </span>
                        )}
                    </div>
                    {isUrgente && <span className="badge badge-error badge-xs text-white mt-1 font-bold">URGENTE</span>}
                </td>
                <td className="align-middle">
                    <div className="flex flex-col">
                        <span className="font-bold text-xs text-gray-800">{formatText(doc.sender_name)}</span>
                        <span className="text-[10px] text-gray-500 truncate max-w-[150px]">{formatText(doc.sender_dependency)}</span>
                    </div>
                </td>
                <td className="align-middle">
                    <div className="flex flex-col">
                        <span className={`font-bold text-xs ${
                            doc.time_status === 'VENCIDO' ? 'text-red-600' : 
                            doc.time_status === 'POR VENCER' ? 'text-amber-600' : 'text-gray-600'
                        }`}>
                            {doc.deadline ? new Date(doc.deadline).toLocaleDateString() : 'S/F'}
                        </span>
                        <span className={`text-[10px] font-bold ${doc.days_remaining < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                            {doc.days_remaining} días
                        </span>
                    </div>
                </td>
                <td className="text-right align-middle pr-4">
                    <div className="flex items-center justify-end gap-2">
                        {/* Action Buttons */}
                        {onShowAttachment && (
                            <button 
                                onClick={() => onShowAttachment(doc.attachment_url, isEncrypted)}
                                className="btn btn-xs btn-circle btn-ghost text-gray-400 hover:text-blue-600"
                                title="Ver Adjunto"
                            >
                                <Eye size={14} />
                            </button>
                        )}

                        {onShowLifecycle && (
                            <button 
                                onClick={() => onShowLifecycle(doc.id)}
                                className="btn btn-xs btn-circle btn-ghost text-gray-400 hover:text-orange-500"
                                title="Ver Actividad"
                            >
                                <Activity size={14} />
                            </button>
                        )}

                        <button 
                            className="btn btn-xs bg-[#9D2449] hover:bg-[#801c3a] text-white border-none gap-1 shadow-sm px-3 ml-2"
                            onClick={() => setSelectedDoc(doc)}
                        >
                            Atender <ArrowRight size={12} />
                        </button>
                    </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {documents.length === 0 && (
          <div className="text-center py-12 text-gray-400 flex flex-col items-center">
              <FileText size={48} className="mb-2 opacity-20" />
              <p className="font-medium text-sm">No hay documentos pendientes en la bandeja.</p>
          </div>
      )}

      {selectedDoc && (
        <AttendDocumentModal 
            isOpen={!!selectedDoc} 
            document={selectedDoc} 
            onSuccess={() => {
                onRefresh();
                setSelectedDoc(null);
            }}
            onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
};
