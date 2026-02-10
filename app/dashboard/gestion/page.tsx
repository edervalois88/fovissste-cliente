'use client';
import { useState, useEffect } from 'react';
import { ManagementTable } from '@/components/modules/dashboard/management/ManagementTable';
import { DocumentService } from '@/lib/services/document.service';
import { FolderKanban, Loader2 } from 'lucide-react';
import { ReassignModal } from '@/components/modules/dashboard/management/ReassignModal';
import { RejectModal } from '@/components/modules/dashboard/management/RejectModal';
import api from '@/lib/api';

export default function ManagementPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const fetchManagementDocs = async () => {
      setLoading(true);
      try {
          const response = await api.get('/documents/management/subordinates');
          setDocuments(response.data);
      } catch (error) {
          console.error(error);
          alert('Error cargando documentos de gestión. Verifique permisos.');
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchManagementDocs();
  }, []);

  const handleReassign = (doc: any) => {
      setSelectedDoc(doc);
      setIsReassignOpen(true);
  };

  const handleReject = (doc: any) => {
      setSelectedDoc(doc);
      setIsRejectOpen(true);
  };

  const handleSuccess = () => {
      fetchManagementDocs();
  };

  return (
    <div className="w-full font-montserrat animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-extrabold text-[#9D2449]">Gestión Documental</h1>
            <p className="text-gray-500 text-sm mt-1">Supervisión y control del flujo documental de áreas subordinadas.</p>
        </div>
        <button 
            className="btn btn-sm btn-outline hover:bg-[#9D2449] hover:text-white transition-colors gap-2" 
            onClick={fetchManagementDocs}
        >
            <FolderKanban size={16} />
            Actualizar Vista
        </button>
      </div>

      {loading ? (
          <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-10 h-10 text-[#9D2449] animate-spin" />
                  <p className="text-xs font-bold text-gray-400 animate-pulse">CARGANDO ESTRUCTURA...</p>
              </div>
          </div>
      ) : (
          <ManagementTable 
            documents={documents} 
            onReassign={handleReassign} 
            onReject={handleReject} 
          />
      )}

      {selectedDoc && (
        <>
            <ReassignModal 
                isOpen={isReassignOpen}
                document={selectedDoc}
                onClose={() => setIsReassignOpen(false)}
                onSuccess={handleSuccess}
            />

            <RejectModal 
                isOpen={isRejectOpen}
                document={selectedDoc}
                onClose={() => setIsRejectOpen(false)}
                onSuccess={handleSuccess}
            />
        </>
      )}
    </div>
  );
}
