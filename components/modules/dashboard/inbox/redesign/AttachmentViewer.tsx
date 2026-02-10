'use client';

import { useState, useEffect } from 'react';
import { Lock, FileText, X, AlertCircle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api'; // Axios instance with Auth Interceptor

interface AttachmentViewerProps {
    filename: string;
    isEncrypted: boolean;
    onUnlock: (password: string) => Promise<boolean>;
    onClose: () => void;
    url?: string;
}

export const AttachmentViewer = ({ filename, isEncrypted, onUnlock, onClose, url }: AttachmentViewerProps) => {
    const [password, setPassword] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(!isEncrypted);
    const [unlockError, setUnlockError] = useState('');
    const [loading, setLoading] = useState(false);
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [fetchError, setFetchError] = useState(false);

    // 1. Fetch PDF with Auth Headers once unlocked
    useEffect(() => {
        let active = true;

        const loadContent = async () => {
            if (isUnlocked && url) {
                setLoading(true);
                setFetchError(false);
                try {
                    // We must fetch via Axios to include the "Authorization: Bearer <token>" header.
                    // An iframe src="..." request DOES NOT send the local storage token.
                    const response = await api.get(url, { responseType: 'blob' });
                    
                    if (active) {
                        const newBlobUrl = URL.createObjectURL(response.data);
                        setBlobUrl(newBlobUrl);
                    }
                } catch (error) {
                    console.error("Failed to load secure document:", error);
                    if (active) setFetchError(true);
                } finally {
                    if (active) setLoading(false);
                }
            }
        };

        if (isUnlocked && url && !blobUrl) {
            loadContent();
        }

        return () => {
            active = false;
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, [isUnlocked, url]); // Intentionally verify blobUrl separately to avoid loops if cleared

    const handleManualDownload = async () => {
        if (!url) return;
        setLoading(true);
        try {
            const response = await api.get(url, { responseType: 'blob' });
            const blobUrl = URL.createObjectURL(response.data);
            
            // Create link and click it
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename || 'documento.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Cleanup
            setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        } catch (error) {
            console.error("Download failed", error);
            setFetchError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setUnlockError('');
        try {
            const success = await onUnlock(password);
            if (success) {
                setIsUnlocked(true);
            } else {
                setUnlockError('Contraseña incorrecta');
            }
        } catch (e) {
            setUnlockError('Error al validar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center bg-white border-b border-gray-100 p-4 shrink-0 shadow-sm z-10">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isEncrypted ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                {isEncrypted && !isUnlocked ? <Lock size={20} /> : <FileText size={20} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg leading-tight">{filename}</h3>
                                <p className="text-xs text-gray-400 font-medium">
                                    {isEncrypted ? (isUnlocked ? 'Desencriptado y Visible' : 'Documento Protegido') : 'Visualización de Documento'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost text-gray-500 hover:bg-gray-100">
                            <X size={22} />
                        </button>
                    </div>

                    <div className="flex-1 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                        {!isUnlocked ? (
                            <div className="text-center p-8 max-w-md bg-white rounded-2xl shadow-lg border border-gray-100">
                                <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
                                    <Lock size={48} strokeWidth={1.5} />
                                
                                </div>
                                <h4 className="text-2xl font-black text-gray-800 mb-2">Acceso Restringido</h4>
                                <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                                    Este documento contiene información sensible y está protegido. <br/>
                                    Por favor ingrese sus credenciales de seguridad.
                                </p>
                                
                                <form onSubmit={handleUnlock} className="flex flex-col gap-4">
                                    <div className="relative">
                                         <input 
                                            type="password" 
                                            placeholder="Ingrese Clave de Acceso" 
                                            className="input input-lg input-bordered w-full text-center tracking-widest font-mono font-bold focus:border-[#9D2449] focus:outline-none"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                   
                                    {unlockError && (
                                        <div className="flex items-center justify-center gap-2 text-red-500 text-xs font-bold animate-pulse">
                                            <AlertCircle size={14} /> {unlockError}
                                        </div>
                                    )}
                                    
                                    <button 
                                        type="submit" 
                                        className="btn btn-lg bg-[#9D2449] hover:bg-[#801c3a] text-white border-none w-full shadow-lg shadow-[#9D2449]/30"
                                        disabled={loading || !password}
                                    >
                                        {loading ? <span className="loading loading-dots loading-sm"></span> : 'DESBLOQUEAR AHORA'}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            // Render Content
                            loading ? (
                                <div className="flex flex-col items-center gap-4 text-gray-400 animate-pulse">
                                    <span className="loading loading-spinner loading-lg text-[#9D2449]"></span>
                                    <p className="font-medium">Descargando y desencriptando documento...</p>
                                </div>
                            ) : fetchError ? (
                                <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-sm">
                                    <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
                                    <h4 className="font-bold text-gray-800 mb-2">Error de Carga</h4>
                                    <p className="text-gray-500 text-sm mb-4">No se pudo obtener el documento. Verifique su conexión o permisos.</p>
                                    <button onClick={handleManualDownload} className="btn btn-outline btn-sm">
                                        Reintentar Descarga Segura
                                    </button>
                                </div>
                            ) : blobUrl ? (
                                <iframe src={blobUrl} className="w-full h-full border-none bg-white shadow-inner" title="Document Viewer" />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <FileText size={64} className="mx-auto mb-4 opacity-20" />
                                    <p>No hay vista previa disponible.</p>
                                </div>
                            )
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
