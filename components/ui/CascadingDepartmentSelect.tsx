'use client';

import React, { useState, useEffect } from 'react';
import { DepartmentService, DepartmentDTO } from '@/lib/services/department.service';
import { ChevronRight } from 'lucide-react';

interface CascadingDepartmentSelectProps {
  onSelect: (departmentId: string) => void;
  selectedId?: string;
  className?: string;
}

export const CascadingDepartmentSelect = ({ onSelect, selectedId, className }: CascadingDepartmentSelectProps) => {
  const [level1, setLevel1] = useState<DepartmentDTO[]>([]); // Subdirecciones
  const [level2, setLevel2] = useState<DepartmentDTO[]>([]); // Jefaturas/Areas
  const [level3, setLevel3] = useState<DepartmentDTO[]>([]); // Departamentos

  const [selectedL1, setSelectedL1] = useState<string>('');
  const [selectedL2, setSelectedL2] = useState<string>('');
  const [selectedL3, setSelectedL3] = useState<string>('');

  const [loading, setLoading] = useState(false);

  // Cargar Nivel 1 (Subdirecciones - Roots of tree or by explicit filter if api supports)
  // Since getTree returns roots, usage of getTree is good. Or use specific endpoint if needed.
  // Using getTree() might be heavy if tree is huge, but it's small.
  // However, `getDirectDescendants` is better for cascading.
  // But to get roots, we need to know what parent_id is null.
  // I'll assume getDirectDescendants('null') works? Or need a way to get roots.
  // DepartmentsService.getTree() returns hierarchy. I can use that and filter locally, or add getRoots().
  // Given previous implementation: getTree returns roots.

  useEffect(() => {
    loadRoots();
  }, []);

  const loadRoots = async () => {
    try {
        setLoading(true);
        const roots = await DepartmentService.getTree();
        setLevel1(roots);
    } catch (e) {
        console.error('Error loading roots', e);
    } finally {
        setLoading(false);
    }
  };

  const handleL1Change = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = e.target.value;
      setSelectedL1(id);
      setSelectedL2('');
      setSelectedL3('');
      setLevel2([]);
      setLevel3([]);
      onSelect(id); // Select parent if no children selected yet

      if (id) {
          try {
              setLoading(true);
              const children = await DepartmentService.getDirectDescendants(id);
              setLevel2(children);
          } catch(e) {
              console.error(e);
          } finally {
              setLoading(false);
          }
      }
  };

  const handleL2Change = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = e.target.value;
      setSelectedL2(id);
      setSelectedL3('');
      setLevel3([]);
      onSelect(id);

      if (id) {
          try {
              setLoading(true);
              const children = await DepartmentService.getDirectDescendants(id);
              setLevel3(children);
          } catch(e) {
              console.error(e);
          } finally {
              setLoading(false);
          }
      }
  };

  const handleL3Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = e.target.value;
      setSelectedL3(id);
      onSelect(id);
  };

  return (
    <div className={`space-y-3 ${className}`}>
        {/* Nivel 1: Subdirección */}
        <div className="form-control w-full">
            <label className="label py-1">
                <span className="label-text-alt font-semibold text-gray-500">Subdirección / Área Principal</span>
            </label>
            <select 
                className="select select-bordered select-sm w-full bg-gray-50 focus:border-[#9D2449]"
                value={selectedL1}
                onChange={handleL1Change}
                disabled={loading && level1.length === 0}
            >
                <option value="">Seleccione una opción...</option>
                {level1.map(d => (
                    <option key={String(d.id)} value={String(d.id)}>{String(d.name)}</option>
                ))}
            </select>
        </div>

        {/* Nivel 2: Jefatura */}
        {level2.length > 0 && (
            <div className="form-control w-full animate-in fade-in slide-in-from-top-2">
                <label className="label py-1">
                    <span className="label-text-alt font-semibold text-gray-500">Jefatura de Servicio / Coordinación</span>
                </label>
                <select 
                    className="select select-bordered select-sm w-full bg-gray-50 focus:border-[#9D2449]"
                    value={selectedL2}
                    onChange={handleL2Change}
                    disabled={loading}
                >
                    <option value="">Seleccione una opción...</option>
                    {level2.map(d => (
                        <option key={String(d.id)} value={String(d.id)}>{String(d.name)}</option>
                    ))}
                </select>
            </div>
        )}

        {/* Nivel 3: Departamento */}
        {level3.length > 0 && (
            <div className="form-control w-full animate-in fade-in slide-in-from-top-2">
                <label className="label py-1">
                    <span className="label-text-alt font-semibold text-gray-500">Departamento</span>
                </label>
                <select 
                    className="select select-bordered select-sm w-full bg-gray-50 focus:border-[#9D2449]"
                    value={selectedL3}
                    onChange={handleL3Change}
                    disabled={loading}
                >
                    <option value="">Seleccione una opción...</option>
                    {level3.map(d => (
                        <option key={String(d.id)} value={String(d.id)}>{String(d.name)}</option>
                    ))}
                </select>
            </div>
        )}
    </div>
  );
};
