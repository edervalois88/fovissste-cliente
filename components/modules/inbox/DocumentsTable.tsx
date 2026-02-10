'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Document {
  id: number;
  folio_oficio: string;
  reception_date: string;
  sender_agency: string;
  sender_name: string;
  status: string;
  description: string;
}

interface DocumentsTableProps {
  documents: Document[];
  isLoading: boolean;
}

export const DocumentsTable = ({ documents, isLoading }: DocumentsTableProps) => {
  if (isLoading) {
    return <div className="text-center p-10">Cargando documentos...</div>;
  }

  if (documents.length === 0) {
    return (
      <div className="text-center p-10 bg-base-100 rounded-lg border border-base-200">
        <h3 className="font-bold text-lg text-gray-500">No hay documentos en la bandeja</h3>
        <p className="text-sm text-gray-400">Los nuevos oficios registrados aparecerán aquí.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <table className="table table-zebra w-full">
        {/* head */}
        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
          <tr>
            <th>Folio</th>
            <th>Fecha Recepción</th>
            <th>Remitente</th>
            <th>Asunto</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="hover">
              <td className="font-mono font-bold text-primary">
                {doc.folio_oficio}
              </td>
              <td className="text-sm">
                {doc.reception_date ? format(new Date(doc.reception_date), 'dd MMM yyyy', { locale: es }) : '-'}
              </td>
              <td>
                <div className="flex flex-col">
                  <span className="font-bold text-xs">{doc.sender_agency}</span>
                  <span className="text-xs text-gray-500">{doc.sender_name}</span>
                </div>
              </td>
              <td className="max-w-xs truncate text-sm" title={doc.description}>
                {doc.description || 'Sin descripción'}
              </td>
              <td>
                <div className={`badge badge-sm gap-2 ${
                  doc.status === 'PENDIENTE' ? 'badge-warning' : 
                  doc.status === 'ATENDIDO' ? 'badge-success text-white' : 'badge-ghost'
                }`}>
                  {doc.status}
                </div>
              </td>
              <td>
                <button className="btn btn-xs btn-ghost text-primary">Ver Detalle</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
