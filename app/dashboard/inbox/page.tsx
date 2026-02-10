'use client';

import { useState, useEffect } from 'react';
import { InboxTable } from '@/components/modules/dashboard/inbox/InboxTable';
import { AttachmentViewer } from '@/components/modules/dashboard/inbox/redesign/AttachmentViewer';
import { DocumentLifecycle } from '@/components/modules/dashboard/inbox/redesign/DocumentLifecycle';
import { ActivityStep } from '@/components/modules/dashboard/inbox/redesign/constants';
import { Search, ChevronDown, MoreVertical, RefreshCw, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentService } from '@/lib/services/document.service';

import { DEPARTMENTS } from '@/components/modules/dashboard/inbox/redesign/constants';
import { SummaryCards } from '@/components/modules/dashboard/inbox/redesign/SummaryCards';

// Mock Data (To be replaced by API in future steps)
const MOCK_HISTORY: ActivityStep[] = [
    { id: '1', user: 'Oficialía de Partes', action: 'created', description: 'Registro inicial del oficio', timestamp: '10 Feb 2024 - 09:30 AM', type: 'create' },
    { id: '2', user: 'Director General', action: 'move', description: 'Turnado a Subdirección de Crédito', timestamp: '10 Feb 2024 - 10:15 AM', type: 'move' },
    { id: '3', user: 'Juan Pérez', action: 'edit', description: 'Asignó prioridad URGENTE', timestamp: '10 Feb 2024 - 11:00 AM', type: 'edit' },
];

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pendientes' | 'urgentes' | 'atendidos' | 'vencidos'>('all');
  const [selectedArea, setSelectedArea] = useState('all');
  
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [originalDocs, setOriginalDocs] = useState<any[]>([]); // For client-side filtering demo

  // Interaction State
  const [showLifecycle, setShowLifecycle] = useState(false);
  const [viewingAttachment, setViewingAttachment] = useState<{url: string, encrypted: boolean} | null>(null);
  const [historySteps, setHistorySteps] = useState<ActivityStep[]>([]);
  const [selectedDocStatus, setSelectedDocStatus] = useState('Pendiente');

  const fetchInbox = async () => {
    setLoading(true);
    try {
      const data = await DocumentService.getInbox();
      setDocuments(data);
      setOriginalDocs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  // Filter Logic
  useEffect(() => {
      let filtered = [...originalDocs];

      // 1. By Filter Tab
      if (activeTab === 'pendientes') {
          filtered = filtered.filter(d => d.status === 'PENDIENTE');
      } else if (activeTab === 'urgentes') {
          filtered = filtered.filter(d => d.priority === 'Urgente');
      } else if (activeTab === 'atendidos') {
          filtered = filtered.filter(d => d.status === 'ATENDIDO');
      } else if (activeTab === 'vencidos') {
          filtered = filtered.filter(d => d.time_status === 'VENCIDO');
      }

      // 2. By Area Dropdown (Simple includes check on name or ID)
      if (selectedArea !== 'all') {
          const selectedLabel = DEPARTMENTS.find(d => d.value === selectedArea)?.label || selectedArea;
          filtered = filtered.filter(d => {
              const assigned = d.assigned_department?.name || d.assigned_department_id || '';
              const sender = d.sender_dependency || '';
              return assigned.includes(selectedLabel) || 
                     sender.includes(selectedLabel) || 
                     assigned === selectedArea;
          });
      }

      setDocuments(filtered);
  }, [activeTab, selectedArea, originalDocs]);

  const handleShowHistory = (docId: string) => {
      const specificHistory = [...MOCK_HISTORY]; 
      
      const doc = documents.find(d => d.id === docId);
      if (doc) {
          setSelectedDocStatus(doc.status === 'ATENDIDO' ? 'Atendido' : 'Pendiente');
          if (doc.status === 'ATENDIDO') {
              specificHistory.push({
                  id: '99',
                  user: 'Usuario Actual',
                  action: 'attend',
                  description: 'Oficio atendido y cerrado',
                  timestamp: 'Hace un momento',
                  type: 'attend'
              });
          }
      }

      setHistorySteps(specificHistory);
      setShowLifecycle(true);
  };

  // Use Relative URL for Attachment to leverage Axios baseURL & Interceptors
  const handleShowAttachment = (path: string, encrypted: boolean) => {
      if (!path) return;
      // We pass the path as-is (e.g. /documents/uuid/download)
      setViewingAttachment({ url: path, encrypted: !!encrypted });
  };

  // KPIs Calculation
  const stats = {
      total: originalDocs.length,
      pendientes: originalDocs.filter(d => d.status === 'PENDIENTE').length,
      urgentes: originalDocs.filter(d => d.priority === 'Urgente').length,
      atendidos: originalDocs.filter(d => d.status === 'ATENDIDO').length,
      vencidos: originalDocs.filter(d => d.time_status === 'VENCIDO').length,
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50/50 overflow-hidden font-montserrat">
        
        {/* Top Header & Filters */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 shrink-0 z-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                     <h1 className="text-2xl font-extrabold text-[#9D2449]">Bandeja de Entrada</h1>
                     <p className="text-sm text-gray-500">Gestiona y da seguimiento a los documentos oficiales de tu área.</p>
                </div>
                
                {/* Area Filter (Tom Select Style) */}
                <div className="w-72">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Filtrar por Área</label>
                    <div className="relative">
                        <select 
                            className="select select-bordered select-sm w-full font-medium text-gray-700 focus:outline-[#9D2449] border-gray-300"
                            value={selectedArea}
                            onChange={(e) => setSelectedArea(e.target.value)}
                        >
                            {DEPARTMENTS.map(dept => (
                                <option key={dept.value} value={dept.value}>{dept.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* KPI Cards as Filters */}
            <SummaryCards 
                stats={stats} 
                activeFilter={activeTab as any} 
                onFilterChange={(tab) => setActiveTab(tab as any)}
            />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 flex overflow-hidden relative">
            <div className={`flex-1 overflow-y-auto p-6 transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
                {/* Toolbar inside content */}
                <div className="flex justify-between items-center mb-4 px-2">
                    <div className="flex items-center gap-2">
                        <button onClick={fetchInbox} className="btn btn-sm btn-ghost gap-2 text-gray-500">
                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Actualizar
                        </button>
                    </div>
                    
                    <div className="join">
                       <input className="input input-sm input-bordered join-item w-64" placeholder="Buscar por remite, folio..." />
                       <button className="btn btn-sm btn-square join-item"><Search size={16}/></button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <InboxTable 
                        documents={documents} 
                        onRefresh={fetchInbox} 
                        onShowAttachment={(url, encrypted) => {
                            if (url) handleShowAttachment(url, !!encrypted);
                        }}
                    />
                </div>
            </div>

            {/* Right Side Panel: File Activity (Conditional) */}
            <AnimatePresence>
                {showLifecycle && (
                    <motion.div 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="border-l border-gray-100 bg-white h-full shrink-0 shadow-xl z-20 absolute right-0 top-0"
                    >
                        <DocumentLifecycle 
                            steps={historySteps} 
                            currentStatus={selectedDocStatus}
                            onClose={() => setShowLifecycle(false)} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>

        {/* Modal: Attachment Viewer */}
        {viewingAttachment && (
            <AttachmentViewer 
                filename="Documento_Oficial.pdf"
                isEncrypted={viewingAttachment.encrypted}
                onUnlock={async (pwd) => {
                    // MOCK UNLOCKING to allow user access regardless of password status for now
                    // In a real scenario, this would POST /documents/unlock or similar
                    await new Promise(r => setTimeout(r, 600));
                    return true; 
                }}
                onClose={() => setViewingAttachment(null)}
                url={viewingAttachment.url}
            />
        )}
    </div>
  );
}
