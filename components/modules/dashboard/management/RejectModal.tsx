import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';

interface RejectModalProps {
  document: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RejectModal = ({ document, isOpen, onClose, onSuccess }: RejectModalProps) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !document) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) return alert('Debe indicar un motivo');

    setIsSubmitting(true);
    try {
      await api.patch(`/documents/${document.id}/reject`, {
        rejection_reason: reason
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error al rechazar el documento');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-red-900/30 z-[100] flex items-center justify-center animate-in zoom-in-95 duration-200 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden border border-red-200">
        <div className="bg-red-50 px-6 py-4 flex justify-between items-center border-b border-red-100">
             <h3 className="font-bold text-red-800 flex items-center gap-2">
                 <AlertTriangle size={18} />
                 Rechazar Documento
             </h3>
             <button onClick={onClose} className="text-red-300 hover:text-red-500">
                 <X size={18} />
             </button>
        </div>

        <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">
                Está a punto de devolver el documento <b>{document.official_number}</b> por inconsistencias o error en la asignación.
            </p>

            <div className="form-control">
                <label className="label">
                    <span className="label-text font-bold text-red-700">Motivo del Rechazo *</span>
                </label>
                <textarea 
                    className="textarea textarea-bordered h-32 border-red-200 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                    placeholder="Especifique claramente por qué se rechaza el trámite..."
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                />
            </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
            <button className="btn btn-sm btn-ghost hover:bg-gray-100" onClick={onClose}>Cancelar</button>
            <button 
                className="btn btn-sm bg-red-600 text-white hover:bg-red-700 border-none"
                disabled={isSubmitting || !reason}
                onClick={handleSubmit}
            >
                {isSubmitting ? 'Procesando...' : 'Confirmar Rechazo'}
            </button>
        </div>
      </div>
    </div>
  );
};
