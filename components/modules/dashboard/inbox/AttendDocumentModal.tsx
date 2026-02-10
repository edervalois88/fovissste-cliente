'use client';
import { useState } from 'react';
import { X, Upload, CheckCircle, Clock } from 'lucide-react';
import { DocumentService } from '@/lib/services/document.service';

interface AttendDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: any;
  onSuccess: () => void;
}

export const AttendDocumentModal = ({ isOpen, onClose, document, onSuccess }: AttendDocumentModalProps) => {
  const [summary, setSummary] = useState('');
  const [status, setStatus] = useState('ATENDIDO');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary) return;
    
    setLoading(true);
    try {
      // Mapping EN_TRAMITE to EN_PROCESO as per my entity
      const backendStatus = status === 'EN_TRAMITE' ? 'EN_PROCESO' : status;
      await DocumentService.attendDocument(document.id, summary, backendStatus, file || undefined);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error al atender documento. Verifique permisos.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-[#9D2449] to-[#751a36] p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg font-montserrat">Atender Documento</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-sm text-gray-500 mb-2 p-3 bg-gray-50 rounded border border-gray-100">
            Atendiendo Folio: <span className="font-mono font-bold text-gray-800">{String(document.official_number)}</span>
            <br/>
            <span className="text-xs truncate block mt-1">{String(document.description)}</span>
          </div>

          <div>
            <label className="label font-semibold text-gray-700 text-sm">Resumen de la Respuesta / Acción <span className="text-red-500">*</span></label>
            <textarea 
              className="textarea textarea-bordered w-full h-24 focus:border-[#9D2449] focus:ring-1 focus:ring-[#9D2449] bg-white text-sm" 
              placeholder="Describa las acciones tomadas..."
              value={summary}
              onChange={e => setSummary(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label className="label font-semibold text-gray-700 text-sm">Oficio de Respuesta (Opcional)</label>
            <div className={`border-2 border-dashed ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-50'} rounded-lg p-4 text-center transition-colors cursor-pointer relative`}>
                <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    accept=".pdf"
                />
                <div className="flex flex-col items-center text-gray-500">
                    {file ? (
                        <>
                            <CheckCircle size={24} className="mb-2 text-green-600"/>
                            <span className="text-xs font-bold text-green-700">{file.name}</span>
                        </>
                    ) : (
                        <>
                            <Upload size={24} className="mb-2"/>
                            <span className="text-xs">Click para subir PDF</span>
                        </>
                    )}
                </div>
            </div>
          </div>

          <div>
             <label className="label font-semibold text-gray-700 text-sm">Nuevo Estatus</label>
             <div className="grid grid-cols-2 gap-4">
                 <button 
                    type="button"
                    onClick={() => setStatus('EN_TRAMITE')} 
                    className={`btn btn-sm ${status === 'EN_TRAMITE' ? 'bg-amber-500 hover:bg-amber-600 text-white border-none' : 'btn-outline border-gray-300 text-gray-500'}`}
                 >
                    <Clock size={16} /> En Trámite
                 </button>
                 <button 
                    type="button"
                    onClick={() => setStatus('ATENDIDO')}
                    className={`btn btn-sm ${status === 'ATENDIDO' ? 'bg-green-600 hover:bg-green-700 text-white border-none' : 'btn-outline border-gray-300 text-gray-500'}`}
                 >
                    <CheckCircle size={16} /> Concluir
                 </button>
             </div>
          </div>

          <div className="modal-action pt-4 border-t mt-6">
            <button type="button" className="btn btn-ghost text-gray-500" onClick={onClose}>Cancelar</button>
            <button 
                type="submit" 
                className="btn bg-[#9D2449] hover:bg-[#801c3a] text-white gap-2 border-none shadow-lg"
                disabled={loading}
            >
                {loading ? <span className="loading loading-spinner"></span> : 'Confirmar Atención'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
