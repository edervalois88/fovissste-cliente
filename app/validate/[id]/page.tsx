
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle, XCircle, FileText, Calendar, Building2, User } from 'lucide-react';
import { FovisssteLogo } from '@/components/ui/FovisssteLogo';

const ValidatePage = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const fetchDoc = async () => {
        try {
            const res = await api.get(`/documents/validate/${id}`);
            setDoc(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al validar documento');
        } finally {
            setLoading(false);
        }
    };
    
    fetchDoc();
  }, [id]);

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
              <div className="loading loading-spinner text-[#9D2449] loading-lg"></div>
              <p className="text-gray-500">Verificando autenticidad...</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header simple */}
        <header className="bg-white shadow-sm py-4 border-b-4 border-[#9D2449]">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <FovisssteLogo className="w-48" />
                <div className="text-right hidden md:block">
                    <h1 className="text-sm font-bold text-gray-800">VALIDACIÓN DE DOCUMENTOS</h1>
                    <p className="text-xs text-gray-500">Sistema de Gestión Documental</p>
                </div>
            </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
            <div className="max-w-xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
                {error ? (
                    <div className="p-8 text-center">
                        <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="text-red-600" size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Documento No Válido</h2>
                        <p className="text-red-500 font-medium mb-6">{error}</p>
                        <p className="text-sm text-gray-400">
                            El código proporcionado no corresponde a ningún documento registrado o ha sido eliminado.
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="bg-green-50 p-6 border-b border-green-100 text-center">
                            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <CheckCircle className="text-green-600" size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-green-800">DOCUMENTO AUTÉNTICO</h2>
                            <p className="text-green-600 text-sm">Registrado en Sistema Institucional</p>
                        </div>

                        <div className="p-6 space-y-6">
                            
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <FileText className="text-[#9D2449] mt-1" />
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase">Asunto</h3>
                                    <p className="text-gray-800 font-semibold">{doc.description}</p>
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-2 px-2 py-1 bg-white border rounded text-xs text-gray-600">
                                            <span className="font-bold">Folio:</span> {doc.official_number}
                                        </span>
                                        {doc.is_encrypted && (
                                            <span className="inline-flex items-center gap-2 px-2 py-1 bg-amber-100 border border-amber-200 rounded text-xs text-amber-700">
                                                Este documento está protegido criptográficamente
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase">
                                        <Calendar size={14} /> Fecha Recepción
                                    </div>
                                    <p className="text-sm">{format(new Date(doc.reception_date), "d MMM yyyy, HH:mm", { locale: es })}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase">
                                        <Building2 size={14} /> Remitente
                                    </div>
                                    <p className="text-sm line-clamp-1" title={doc.sender_dependency}>{doc.sender_dependency}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 text-center">Estatus Actual</h3>
                                <div className="flex justify-center">
                                    <span className={`badge badge-lg py-4 px-6 ${
                                        doc.status === 'ATENDIDO' ? 'badge-success text-white' : 
                                        doc.status === 'RECHAZADO' ? 'badge-error text-white' : 
                                        'badge-info text-white'
                                    }`}>
                                        {doc.status}
                                    </span>
                                </div>
                                {doc.response_summary && (
                                    <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-800">
                                        <strong>Respuesta:</strong> {doc.response_summary}
                                    </div>
                                )}
                            </div>
                            
                            <div className="text-center text-[10px] text-gray-400 font-mono mt-4">
                                UUID: {doc.id}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
        
        <footer className="bg-[#333] text-gray-400 py-6 text-center text-xs">
            <p className="mb-2">Fondo de la Vivienda del Instituto de Seguridad y Servicios Sociales de los Trabajadores del Estado</p>
            <p>gob.mx/fovissste</p>
        </footer>
    </div>
  );
};

export default ValidatePage;
