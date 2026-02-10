'use client';

import React, { useState, useEffect } from 'react';
import { DepartmentDTO } from '@/lib/services/department.service';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, CheckCircle, FolderTree } from 'lucide-react';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  allDepartments: DepartmentDTO[];
}

export const DepartmentModal = ({ isOpen, onClose, onSubmit, initialData, allDepartments }: DepartmentModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    parent_id: '',
    level: 'Departamento'
  });

  useEffect(() => {
    if (initialData) {
        setFormData({
            name: initialData.name || '',
            code: initialData.code || '',
            description: initialData.description || '',
            parent_id: initialData.parent?.id || initialData.parent_id || '',
            level: initialData.level || 'Departamento'
        });
    } else {
        setFormData({
            name: '',
            code: '',
            description: '',
            parent_id: '',
            level: 'Departamento'
        });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const isFormValid = formData.name.trim() !== '' && formData.code.trim() !== '';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal modal-open flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="modal-box w-11/12 max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden p-0 relative"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#9D2449] to-[#751a36] p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                    <Building2 size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-xl font-montserrat tracking-wide">
                        {initialData ? 'Editar Área' : 'Nueva Área'}
                    </h3>
                    <p className="text-xs text-white/80">Gestión de estructura organizacional.</p>
                </div>
            </div>
            <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm text-white/80 hover:bg-white/20 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            
            {/* Clave */}
            <div className="form-control w-full">
                <label className="label py-1">
                    <span className="label-text font-semibold text-xs uppercase text-gray-500">Clave Presupuestal / ID</span>
                </label>
                <input 
                    type="text" 
                    name="code" 
                    placeholder="Ej. 100, 110, DAF" 
                    className="input input-bordered w-full focus:border-[#9D2449] focus:ring-1 focus:ring-[#9D2449]" 
                    value={formData.code}
                    onChange={handleChange}
                />
            </div>

            {/* Nombre */}
            <div className="form-control w-full">
                <label className="label py-1">
                    <span className="label-text font-semibold text-xs uppercase text-gray-500">Nombre de la Unidad</span>
                </label>
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Ej. Dirección de Administración" 
                    className="input input-bordered w-full focus:border-[#9D2449] focus:ring-1 focus:ring-[#9D2449]" 
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

             {/* Nivel */}
             <div className="form-control w-full">
                <label className="label py-1">
                    <span className="label-text font-semibold text-xs uppercase text-gray-500">Nivel Jerárquico</span>
                </label>
                <select 
                    name="level" 
                    className="select select-bordered w-full focus:border-[#9D2449]"
                    value={formData.level}
                    onChange={handleChange}
                >
                    <option>Dirección General</option>
                    <option>Subdirección</option>
                    <option>Jefatura de Servicios</option>
                    <option>Jefatura de Departamento</option>
                    <option>Unidad</option>
                </select>
            </div>

            {/* Padre */}
            <div className="form-control w-full">
                <label className="label py-1">
                    <span className="label-text font-semibold text-xs uppercase text-gray-500">Depende de (Área Superior)</span>
                </label>
                <select 
                    name="parent_id" 
                    className="select select-bordered w-full focus:border-[#9D2449]"
                    value={formData.parent_id}
                    onChange={handleChange}
                >
                    <option value="">-- Sin dependencia (Nivel Superior) --</option>
                    {allDepartments
                        .filter(d => d.id !== initialData?.id) // Prevent circular dependency with self
                        .map((dept) => (
                        <option key={dept.id} value={dept.id}>
                            {dept.code} - {dept.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Descripción */}
            <div className="form-control w-full">
                <label className="label py-1">
                    <span className="label-text font-semibold text-xs uppercase text-gray-500">Descripción (Opcional)</span>
                </label>
                <textarea 
                    name="description" 
                    className="textarea textarea-bordered h-20 w-full focus:border-[#9D2449]" 
                    placeholder="Detalles sobre las funciones del área..."
                    value={formData.description}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="modal-action mt-6">
                <button type="button" onClick={onClose} className="btn btn-ghost">Cancelar</button>
                <button 
                    type="button" 
                    onClick={() => onSubmit(formData)} 
                    className={`btn bg-[#9D2449] hover:bg-[#801c3a] text-white gap-2 ${!isFormValid && 'btn-disabled opacity-50'}`}
                >
                    <CheckCircle size={18} />
                    Guardar
                </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
