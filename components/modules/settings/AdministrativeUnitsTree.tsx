'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, ChevronRight, ChevronDown, Plus, Edit, Users, 
  Trash2, FolderOpen, Folder 
} from 'lucide-react';
import { DepartmentService, DepartmentDTO } from '@/lib/services/department.service';

interface OrgTreeNodeProps {
  node: DepartmentDTO;
  level: number;
  onSelect: (node: DepartmentDTO) => void;
  onAdd: (node: DepartmentDTO) => void;
  onEdit: (node: DepartmentDTO) => void;
  expandedNodes: Set<string>;
  toggleNode: (id: string) => void;
}

const OrgTreeNode = ({ node, level, onSelect, onAdd, onEdit, expandedNodes, toggleNode }: OrgTreeNodeProps) => {
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`
          flex items-center gap-2 p-2 rounded-lg mb-1 cursor-pointer transition-colors
          ${level === 0 ? 'bg-gray-100 border border-gray-200' : 'hover:bg-gray-50'}
        `}
        style={{ marginLeft: `${level * 24}px` }}
        onClick={() => toggleNode(node.id)}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); toggleNode(node.id); }}
          className={`p-1 rounded-md hover:bg-gray-200 text-gray-500 ${!hasChildren ? 'opacity-0' : ''}`}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        <div className={`p-2 rounded-lg ${level === 0 ? 'bg-[#9D2449] text-white' : 'bg-white border text-gray-700'} shadow-sm`}>
          {isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />}
        </div>

        <div className="flex-1">
          <div className="font-semibold text-sm">
            {node.code && <span className="opacity-70 mr-2 font-mono text-xs">[{String(node.code)}]</span>}
             {String(node.name)}
          </div>
          <div className="text-xs opacity-60 flex gap-2">
             <span>Level: {String(level)}</span>
             {node.children?.length ? <span>• {node.children.length} sub-areas</span> : null}
             {node.level && <span className="badge badge-xs">{String(node.level)}</span>}
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <button onClick={(e) => { e.stopPropagation(); onAdd(node); }} className="btn btn-ghost btn-xs text-[#9D2449]" title="Agregar Sub-área">
             <Plus size={14} />
           </button>
           <button onClick={(e) => { e.stopPropagation(); onEdit(node); }} className="btn btn-ghost btn-xs text-blue-600" title="Editar">
             <Edit size={14} />
           </button>
           <button onClick={(e) => { e.stopPropagation(); onSelect(node); }} className="btn btn-ghost btn-xs text-gray-600" title="Ver Usuarios">
             <Users size={14} />
           </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {node.children?.map(child => (
              <OrgTreeNode 
                key={child.id} 
                node={child} 
                level={level + 1} 
                onSelect={onSelect}
                onAdd={onAdd}
                onEdit={onEdit}
                expandedNodes={expandedNodes}
                toggleNode={toggleNode}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AdministrativeUnitsTree() {
  const [treeData, setTreeData] = useState<DepartmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTree();
  }, []);

  const loadTree = async () => {
    try {
      setLoading(true);
      const data = await DepartmentService.getTree();
      setTreeData(data);
      // Expand root by default
      if (data.length > 0) {
        setExpandedNodes(new Set([data[0].id]));
      }
    } catch (error) {
      console.error('Failed to load org tree', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedNodes(newExpanded);
  };

  const handleAdd = (parent: DepartmentDTO) => {
    console.log('Add child to', parent.name);
    // TODO: Open Modal
  };

  const handleEdit = (node: DepartmentDTO) => {
    console.log('Edit', node.name);
    // TODO: Open Modal
  };

  const handleSelect = (node: DepartmentDTO) => {
    console.log('View users for', node.name);
    // TODO: Show users list side panel
  };

  if (loading) return <div>Cargando estructura...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Building className="text-[#9D2449]" /> Estructura Orgánica
        </h2>
        <button className="btn btn-sm btn-outline gap-2">
            <Plus size={16} /> Nueva Dirección
        </button>
      </div>

      <div className="space-y-1">

        {treeData.length === 0 && (
            <div className="text-center py-10 text-gray-400">
                No hay unidades administrativas registradas.
            </div>
        )}
      </div>
    </div>
  );
}
