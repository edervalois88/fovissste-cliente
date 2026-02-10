'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Edit2, Trash2, Save, X, ToggleLeft, ToggleRight, ArrowUp, ArrowDown } from 'lucide-react';

const CATEGORIES = [
  { id: 'DOC_TYPE', label: 'Tipos de Documento' },
  { id: 'INSTRUCTION', label: 'Instrucciones de Turnado' },
  { id: 'RECEPTION_MODE', label: 'Modos de Recepción' },
  { id: 'EXTERNAL_ENTITY', label: 'Dependencias Externas' },
];

export default function CatalogosPage() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isCreating, setIsCreating] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
        const res = await api.get(`/catalogs?category=${selectedCategory}`);
        setItems(res.data);
    } catch (error) {
        console.error("Error fetching catalogs", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    setIsCreating(false);
    setEditingId(null);
  }, [selectedCategory]);

  const handleEdit = (item: any) => {
      setEditingId(item.id);
      setEditForm({ ...item, metadataString: JSON.stringify(item.metadata || {}) });
  };

  const handleCreate = () => {
      setIsCreating(true);
      const nextOrder = items.length > 0 ? Math.max(...items.map(i => i.order || 0)) + 1 : 1;
      setEditForm({ 
          category: selectedCategory, 
          name: '', 
          code: '', 
          is_active: true, 
          order: nextOrder,
          metadataString: '{}' 
      });
  };

  const handleSave = async () => {
      try {
          const metadata = JSON.parse(editForm.metadataString || '{}');
          const payload = { ...editForm, metadata, order: parseInt(editForm.order) };
          delete payload.metadataString;

          if (isCreating) {
              await api.post('/catalogs', payload);
          } else {
              await api.patch(`/catalogs/${editingId}`, payload);
          }
          
          setIsCreating(false);
          setEditingId(null);
          fetchItems();
      } catch (error) {
          console.error("Error saving catalog", error);
          alert("Error al guardar. Verifique los datos y formato JSON.");
      }
  };

  const handleToggleActive = async (item: any) => {
      try {
          await api.patch(`/catalogs/${item.id}`, { is_active: !item.is_active });
          fetchItems(); // Or optimistic update
      } catch (e) {
          console.error("Error toggling", e);
      }
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-[#9D2449]">Catálogos del Sistema</h1>
                <p className="text-gray-500 text-sm">Gestiona las listas maestras del sistema.</p>
            </div>
            {!isCreating && !editingId && (
                <button 
                    onClick={handleCreate}
                    className="btn btn-sm bg-[#9D2449] text-white hover:bg-[#801d3a] gap-2"
                >
                    <Plus size={16} /> Nuevo Elemento
                </button>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar / Tabs */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-2 md:col-span-1 h-fit">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                            selectedCategory === cat.id 
                            ? 'bg-blue-50 text-[#9D2449] border-l-4 border-[#9D2449]' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="md:col-span-3 bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="p-4 border-b bg-gray-50 font-semibold text-gray-700 flex justify-between">
                    <span>Elementos de {CATEGORIES.find(c => c.id === selectedCategory)?.label}</span>
                    <span className="text-xs font-normal text-gray-500">Ordenados por "Orden"</span>
                </div>
                
                {loading ? (
                    <div className="p-8 text-center"><span className="loading loading-spinner text-[#9D2449]"></span></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table table-sm w-full">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500">
                                    <th className="w-10">Activo</th>
                                    <th className="w-10">Orden</th>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Metadatos (JSON)</th>
                                    <th className="text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isCreating && (
                                    <tr className="bg-blue-50">
                                        <td><input type="checkbox" className="toggle toggle-xs toggle-success" checked={editForm.is_active} onChange={e => setEditForm({...editForm, is_active: e.target.checked})} /></td>
                                        <td><input type="number" className="input input-xs input-bordered w-12" value={editForm.order} onChange={e => setEditForm({...editForm, order: e.target.value})} /></td>
                                        <td><input className="input input-xs input-bordered w-full" value={editForm.code} onChange={e => setEditForm({...editForm, code: e.target.value})} placeholder="CODE" /></td>
                                        <td><input className="input input-xs input-bordered w-full" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Nombre" /></td>
                                        <td><input className="input input-xs input-bordered w-full font-mono" value={editForm.metadataString} onChange={e => setEditForm({...editForm, metadataString: e.target.value})} /></td>
                                        <td className="text-right flex gap-1 justify-end">
                                            <button onClick={handleSave} className="btn btn-xs btn-success text-white"><Save size={14} /></button>
                                            <button onClick={() => setIsCreating(false)} className="btn btn-xs btn-ghost text-red-500"><X size={14} /></button>
                                        </td>
                                    </tr>
                                )}

                                {items.map(item => (
                                    <tr key={item.id} className={editingId === item.id ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                                        <td>
                                            {editingId === item.id ? (
                                                <input type="checkbox" className="toggle toggle-xs toggle-success" checked={editForm.is_active} onChange={e => setEditForm({...editForm, is_active: e.target.checked})} />
                                            ) : (
                                                <button onClick={() => handleToggleActive(item)} className="btn btn-ghost btn-xs">
                                                    {item.is_active ? <ToggleRight className="text-green-600" /> : <ToggleLeft className="text-gray-400" />}
                                                </button>
                                            )}
                                        </td>
                                        <td>
                                            {editingId === item.id ? (
                                                <input type="number" className="input input-xs input-bordered w-12" value={editForm.order} onChange={e => setEditForm({...editForm, order: e.target.value})} />
                                            ) : <span className="font-mono text-xs">{item.order}</span>}
                                        </td>
                                        <td className="font-mono text-xs font-bold text-gray-500">
                                            {editingId === item.id ? (
                                                 <span className="text-gray-400 cursor-not-allowed" title="No editable">{item.code}</span>
                                            ) : item.code}
                                        </td>
                                        <td>
                                            {editingId === item.id ? (
                                                <input className="input input-xs input-bordered w-full" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                                            ) : <span className="font-medium text-gray-800">{item.name}</span>}
                                        </td>
                                        <td className="font-mono text-[10px] text-gray-500 truncate max-w-xs">
                                            {editingId === item.id ? (
                                                <input className="input input-xs input-bordered w-full" value={editForm.metadataString} onChange={e => setEditForm({...editForm, metadataString: e.target.value})} />
                                            ) : JSON.stringify(item.metadata)}
                                        </td>
                                        <td className="text-right">
                                            {editingId === item.id ? (
                                                <div className="flex gap-1 justify-end">
                                                    <button onClick={handleSave} className="btn btn-xs btn-success text-white"><Save size={14} /></button>
                                                    <button onClick={() => setEditingId(null)} className="btn btn-xs btn-ghost text-red-500"><X size={14} /></button>
                                                </div>
                                            ) : (
                                                <button onClick={() => handleEdit(item)} className="btn btn-ghost btn-xs text-blue-600">
                                                    <Edit2 size={14} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
