'use client';
import { useState, useEffect } from 'react';
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import { Trash2, CalendarDays, Loader2, Save } from 'lucide-react';
import api from '@/lib/api';

export const HolidaysCalendar = () => {
    const [holidays, setHolidays] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [description, setDescription] = useState('');
    const [recurring, setRecurring] = useState(false);
    
    // Fetch Holidays
    const fetchHolidays = async () => {
        setLoading(true);
        try {
            const response = await api.get('/holidays');
            setHolidays(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHolidays();
    }, []);

    // Convert API dates to Date objects for DayPicker
    // Need to handle timezone issues. API returns YYYY-MM-DD string likely.
    // If backend returns Date type, it might be ISO string.
    // Let's parse strictly as local date at noon to avoid timezone shift.
    const parseDate = (dateStr: string) => {
        const [y, m, d] = dateStr.split('T')[0].split('-').map(Number);
        return new Date(y, m - 1, d);
    };

    const holidayDates = holidays.map(h => parseDate(h.date));
    
    const modifiers = {
        holiday: holidayDates
    };
    
    const modifiersStyles = {
        holiday: {
            color: 'white',
            backgroundColor: '#9D2449', // Guinda
            fontWeight: 'bold',
            borderRadius: '50%'
        }
    };
    
    // Check if currently selected date is a holiday
    const selectedHoliday = selectedDate ? holidays.find(h => {
             const hDate = parseDate(h.date);
             return hDate.getDate() === selectedDate.getDate() && 
                    hDate.getMonth() === selectedDate.getMonth() && 
                    hDate.getFullYear() === selectedDate.getFullYear();
    }) : null;

    useEffect(() => {
        if (selectedHoliday) {
            setDescription(selectedHoliday.description);
            setRecurring(selectedHoliday.recurring);
        } else {
            setDescription('');
            setRecurring(false);
        }
    }, [selectedHoliday]);

    const handleSelect: SelectSingleEventHandler = (day) => {
        setSelectedDate(day);
    };

    const handleAdd = async () => {
        if (!selectedDate || !description) return;
        try {
            await api.post('/holidays', {
                date: format(selectedDate, 'yyyy-MM-dd'),
                description,
                recurring
            });
            await fetchHolidays();
            // Keep selected date but reload data to update modifiers
            alert('Día guardado correctamente');
        } catch (error) {
            alert('Error al guardar día inhábil');
        }
    };

    const handleDelete = async () => {
        if (!selectedHoliday) return;
        if (!confirm('¿Eliminar día inhábil?')) return;

        try {
            await api.delete(`/holidays/${selectedHoliday.id}`);
            await fetchHolidays();
            setDescription('');
            setRecurring(false);
            alert('Día eliminado');
        } catch (error) {
            alert('Error al eliminar');
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start animate-in zoom-in-95 duration-300">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <DayPicker 
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                    locale={es}
                    showOutsideDays
                    className="rdp-custom"
                />
                
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <div className="w-3 h-3 rounded-full bg-[#9D2449]"></div> Días Inhábiles
                </div>
            </div>

            <div className="flex-1 w-full md:max-w-xs">
                {selectedDate ? (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-all">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <div className="bg-[#9D2449]/10 p-3 rounded-lg text-[#9D2449]">
                                <CalendarDays size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Fecha Seleccionada</p>
                                <h3 className="font-bold text-gray-800 text-lg capitalize">
                                    {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
                                </h3>
                            </div>
                        </div>
                        
                        {selectedHoliday ? (
                            <div className="space-y-5">
                                <div className="alert alert-warning py-3 text-xs bg-amber-50 text-amber-800 border-amber-200">
                                    <span className="font-bold">¡Atención!</span> Este día ya está marcado como inhábil.
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100/50">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Motivo</label>
                                    <p className="font-semibold text-gray-800 text-sm">{selectedHoliday.description}</p>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100/50">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Recurrencia</label>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${selectedHoliday.recurring ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <p className="text-sm font-medium text-gray-600">
                                            {selectedHoliday.recurring ? 'Se repite anualmente' : 'Solo este año'}
                                        </p>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleDelete}
                                    className="btn btn-error btn-sm w-full mt-2 text-white shadow-md shadow-red-200 hover:shadow-red-300 transition-shadow"
                                >
                                    <Trash2 size={16} /> Eliminar Día Inhábil
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
                                <p className="text-sm text-gray-500 italic mb-4">
                                    Este es un día hábil normal. Configure los detalles abajo para marcarlo como inhábil.
                                </p>

                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text font-semibold text-gray-700 text-xs uppercase">Descripción / Motivo</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        className="input input-bordered w-full focus:border-[#9D2449] focus:ring-1 focus:ring-[#9D2449] h-10 text-sm" 
                                        placeholder="Ej. Aniversario Revolución"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="form-control bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <label className="label cursor-pointer justify-start gap-3 p-0">
                                        <input 
                                            type="checkbox" 
                                            className="checkbox checkbox-sm checkbox-primary border-gray-300" 
                                            checked={recurring}
                                            onChange={e => setRecurring(e.target.checked)}
                                        />
                                        <span className="label-text text-sm font-medium text-gray-600">¿Se repite cada año?</span>
                                    </label>
                                </div>

                                <button 
                                    onClick={handleAdd}
                                    className="btn bg-[#9D2449] text-white hover:bg-[#801b39] w-full shadow-lg shadow-[#9D2449]/20 hover:shadow-[#9D2449]/40 border-none transition-all gap-2"
                                    disabled={!description}
                                >
                                    <Save size={16} /> Guardar Inhábil
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center h-full flex flex-col items-center justify-center text-gray-400">
                        <CalendarDays className="w-12 h-12 mb-2 opacity-50" />
                        <p className="text-sm">Seleccione una fecha en el calendario para comenzar.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
