'use client';

import React, { useState, useEffect } from 'react';
import { DepartmentService, DepartmentDTO } from '@/lib/services/department.service';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Building, Briefcase, CheckCircle, ShieldCheck } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => void;
  initialData?: any; // Si pasamos datos, es modo edición
}

export const UserModal = ({ isOpen, onClose, onSubmit, initialData }: UserModalProps) => {
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  
  const [formData, setFormData] = useState(initialData ? {
    ...initialData,
    department_id: initialData.department?.id || initialData.department_id || '',
  } : {
    name: '',
    email: '',
    password: '',
    role: 'Usuario',
    department_id: '',
    status: 'active'
  });

  useEffect(() => {
    const loadDepartments = async () => {
        try {
            const data = await DepartmentService.getAllDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('Error loading departments');
        }
    };
    if (isOpen) loadDepartments();
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal modal-open flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="modal-box w-11/12 max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden p-0 relative"
        >
          {/* Header con Gradiente Institucional */}
          <div className="bg-gradient-to-r from-[#9D2449] to-[#751a36] p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                    <UserPlusIconAnimated />
                </div>
                <div>
                    <h3 className="font-bold text-xl font-montserrat tracking-wide">
                        {initialData ? 'Editar Usuario' : 'Nuevo Usuario'}
                    </h3>
                    <p className="text-xs text-white/80">Complete la información para registrar el acceso.</p>
                </div>
            </div>
            <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm text-white/80 hover:bg-white/20 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Formulario */}
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Nombre Completo */}
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-semibold flex items-center gap-2"><User size={14} className="text-[#9D2449]"/> Nombre Completo</span>
                    </label>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Ej. Juan Pérez" 
                        className="input input-bordered w-full focus:border-[#9D2449] focus:ring-1 focus:ring-[#9D2449] bg-gray-50" 
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                {/* Correo Electrónico */}
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-semibold flex items-center gap-2"><Mail size={14} className="text-[#9D2449]"/> Correo Institucional</span>
                    </label>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="usuario@fovissste.gob.mx" 
                        className="input input-bordered w-full focus:border-[#9D2449] focus:ring-1 focus:ring-[#9D2449] bg-gray-50" 
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                {/* Departamento */}
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-semibold flex items-center gap-2"><Building size={14} className="text-[#9D2449]"/> Departamento</span>
                    </label>
                    <select 
                        name="department_id" 
                        className="select select-bordered w-full focus:border-[#9D2449] bg-gray-50"
                        value={formData.department_id}
                        onChange={handleChange}
                    >
                        <option value="" disabled>Seleccione un área</option>
                        {departments.map((dept) => (
                            <option key={String(dept.id)} value={String(dept.id)}>
                                {dept.code ? `[${String(dept.code)}] ` : ''}{String(dept.name)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Rol */}
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-semibold flex items-center gap-2"><ShieldCheck size={14} className="text-[#9D2449]"/> Rol de Acceso</span>
                    </label>
                    <div className="flex gap-2">
                        {['Admin', 'Gestor', 'Usuario'].map((role) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => setFormData((prev: any) => ({...prev, role}))}
                                className={`flex-1 btn btn-sm ${formData.role === role ? 'bg-[#9D2449] text-white hover:bg-[#801c3a]' : 'btn-outline border-gray-300 text-gray-500'}`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contraseña (Solo si es nuevo o cambio) */}
                <div className="form-control w-full md:col-span-2 relative">
                    <label className="label">
                        <span className="label-text font-semibold flex items-center gap-2"><Lock size={14} className="text-[#9D2449]"/> Contraseña</span>
                    </label>
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="••••••••" 
                        className="input input-bordered w-full focus:border-[#9D2449] bg-gray-50 pr-10" 
                        value={formData.password}
                        onChange={handleChange}
                    />
                     <div className="absolute right-3 top-[50px] text-gray-400 cursor-pointer hover:text-[#9D2449]">
                        {/* Eye Icon placeholder */}
                    </div>
                </div>
            </div>

            {/* Toggle Estado */}
            <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                    <input 
                        type="checkbox" 
                        className="toggle toggle-success" 
                        checked={formData.status === 'active'} 
                        onChange={(e) => setFormData((prev: any) => ({...prev, status: e.target.checked ? 'active' : 'inactive'}))}
                    />
                    <span className="label-text font-medium text-gray-700">
                        Usuario {formData.status === 'active' ? 'Habilitado' : 'Deshabilitado'}
                    </span>
                </label>
            </div>

            {/* Fotter de Acciones */}
            <div className="modal-action mt-8 border-t border-gray-100 pt-6">
                <button type="button" onClick={onClose} className="btn btn-ghost hover:bg-gray-100 text-gray-600">Cancelar</button>
                <button 
                    type="button" 
                    onClick={() => onSubmit(formData)} 
                    className="btn bg-[#9D2449] hover:bg-[#801c3a] text-white px-8 gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                    <CheckCircle size={18} />
                    Guardar Usuario
                </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// SVG Animado para el Header del Modal
const UserPlusIconAnimated = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="text-white"
    >
        <motion.path 
            d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
        />
        <motion.circle 
            cx="8.5" cy="7" r="4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        />
        <motion.line x1="20" y1="8" x2="20" y2="14" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} />
        <motion.line x1="23" y1="11" x2="17" y2="11" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }} />
    </svg>
);
