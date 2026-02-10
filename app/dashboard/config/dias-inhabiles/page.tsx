'use client';
import { useState, useEffect } from 'react';
import { HolidaysCalendar } from '@/components/modules/dashboard/config/HolidaysCalendar';
import { Calendar, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export default function HolidaysConfigPage() {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch only to show list summary if needed, but Calendar handles its own fetch.
  // We can delegate to Calendar component.

  return (
    <div className="w-full font-montserrat animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-100 pb-4">
        <div>
            <h1 className="text-3xl font-extrabold text-[#9D2449] flex items-center gap-3">
                <Calendar className="w-8 h-8" />
                Días Inhábiles
            </h1>
            <p className="text-gray-500 text-sm mt-1 max-w-xl">
                Configure el calendario oficial. Los días marcados aquí no contarán para el cálculo de fechas límite (SLA) de los documentos.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
              <div className="alert alert-info shadow-sm mb-6 flex items-start text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                      <h3 className="font-bold">Importante</h3>
                      <p>Los cambios en el calendario afectan inmediatamente el cálculo de nuevos documentos. Los documentos ya registrados mantendrán su fecha límite original.</p>
                  </div>
              </div>

              <HolidaysCalendar />
          </div>

          <div className="bg-gray-50 p-6 rounded-lg h-fit border border-gray-200">
              <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                  Próximos Días Inhábiles
              </h3>
              {/* Could be a list summary here */}
              <p className="text-xs text-gray-400 italic">
                  Seleccione un día en el calendario para ver detalles o agregar nuevo.
              </p>
          </div>
      </div>
    </div>
  );
}
