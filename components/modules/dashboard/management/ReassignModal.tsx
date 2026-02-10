import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { CascadingDepartmentSelect } from '@/components/ui/CascadingDepartmentSelect';
import api from '@/lib/api';

interface ReassignModalProps {
  document: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReassignModal = ({ document, isOpen, onClose, onSuccess }: ReassignModalProps) => {
  const [targetDepartmentId, setTargetDepartmentId] = useState<string | null>(null);
  const [instruction, setInstruction] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !document) return null;

  const handleSubmit = async () => {
    // Basic validation
    if (!targetDepartmentId) return alert('Seleccione un área destino');
    if (!instruction) return alert('Escriba una instrucción');

    setIsSubmitting(true);
    try {
      await api.patch(`/documents/${document.id}/reassign`, {
        target_department_id: targetDepartmentId,
        instruction
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error en reasignación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden border border-gray-100">
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
                 Reasignar Documento
                 <span className="badge badge-sm badge-neutral">{document.official_number}</span>
             </h3>
             <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                 <X size={18} />
             </button>
        </div>

        <div className="p-6 space-y-4">
            <div className="alert alert-info py-2 text-xs">
                Se moverá de <b>{document.assigned_department?.name}</b> a la nueva área.
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold text-gray-700">Nueva Area Responsable</span>
                </label>
                <div className="border rounded-lg p-2 bg-gray-50">
                    <CascadingDepartmentSelect 
                        selectedId={targetDepartmentId || undefined}
                        onSelect={setTargetDepartmentId}
                    />
                </div>
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold text-gray-700">Instrucciones Adicionales</span>
                </label>
                <textarea 
                    className="textarea textarea-bordered h-24 focus:border-[#9D2449]" 
                    placeholder="Especifique la razón del cambio y las nuevas instrucciones..."
                    value={instruction}
                    onChange={e => setInstruction(e.target.value)}
                />
            </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
            <button className="btn btn-sm btn-ghost" onClick={onClose}>Cancelar</button>
            <button 
                className="btn btn-sm bg-[#9D2449] text-white hover:bg-[#801b39]"
                disabled={isSubmitting || !targetDepartmentId}
                onClick={handleSubmit}
            >
                {isSubmitting ? 'Procesando...' : 'Confirmar Reasignación'}
            </button>
        </div>
      </div>
    </div>
  );
};
