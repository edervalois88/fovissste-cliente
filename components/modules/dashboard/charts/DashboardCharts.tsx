'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { motion } from 'framer-motion';

// Chart Colors (Brand + Complimentary)
const COLORS = ['#9D2449', '#B38E5D', '#D4C19C', '#285C4D', '#A5D6A7', '#13322B'];

interface ChartContainerProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

const ChartContainer = ({ title, description, children }: ChartContainerProps) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-white shadow-md border border-gray-200 flex flex-col h-[400px] hover:shadow-lg transition-shadow rounded-xl overflow-hidden"
    >
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">{title}</h3>
                {description && <p className="text-xs text-gray-500 font-medium mt-1">{description}</p>}
            </div>
             <motion.div 
                whileHover={{ rotate: 180 }}
                className="btn btn-ghost btn-xs btn-circle text-gray-400 hover:text-gray-700"
            >
                ⋮
            </motion.div>
        </div>
        <div className="flex-1 w-full h-full p-6 relative">
             {children}
        </div>
    </motion.div>
);

// --- 1. Bar Chart: Documents by Department ---
interface BarChartProps {
    data: { name: string; value: number }[];
}

export const DocumentsByAreaChart = ({ data }: BarChartProps) => { // Expect data like [{name: 'Juridico', value: 12}]
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-white p-3 border border-gray-200 shadow-xl rounded-lg text-xs z-50">
              <p className="font-bold text-gray-800 mb-1">{label}</p>
              <p className="text-[#9D2449] font-bold"> Total: {payload[0].value} oficios</p>
            </div>
          );
        }
        return null;
    };

    if (!data || data.length === 0) {
        return (
            <ChartContainer title="Carga de Trabajo por Área" description="Distribución de oficios asignados">
                 <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <p className="font-bold text-sm">Sin datos para mostrar</p>
                 </div>
            </ChartContainer>
        );
    }

    return (
        <ChartContainer title="Carga de Trabajo por Área" description="Distribución de oficios asignados">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: '#4B5563', fontWeight: 600 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" fill="#9D2449" radius={[0, 4, 4, 0]} barSize={24} animationDuration={1500}>
                         {/* Optional: Label list inside or outside */}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};


// --- 2. Area Chart: Trend over time ---
interface TrendChartProps {
    data: { date: string; incoming: number; completed: number }[];
}

export const DocumentsTrendChart = ({ data }: TrendChartProps) => {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-white p-3 border border-gray-200 shadow-xl rounded-lg text-xs z-50">
              <p className="font-bold text-gray-600 mb-2 border-b border-gray-100 pb-1">{label}</p>
              <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#9D2449]"></div>
                  <span className="text-gray-700 font-medium">Recibidos: <span className="font-bold">{payload[0].value}</span></span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#B38E5D]"></div>
                  <span className="text-gray-700 font-medium">Atendidos: <span className="font-bold">{payload[1].value}</span></span>
              </div>
            </div>
          );
        }
        return null;
    };

    if (!data || data.length === 0 || data.every(d => d.incoming === 0 && d.completed === 0)) {
        return (
            <ChartContainer title="Tendencia de Recepción" description="Últimos 7 días">
                 <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <p className="font-bold text-sm">Sin actividad reciente</p>
                 </div>
            </ChartContainer>
        );
    }

    return (
        <ChartContainer title="Tendencia de Recepción" description="Últimos 7 días">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9D2449" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#9D2449" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#B38E5D" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#B38E5D" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{fontSize: 11, fill: '#6B7280', fontWeight: 500}} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{fontSize: 11, fill: '#6B7280', fontWeight: 500}} axisLine={false} tickLine={false} dx={-10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                        type="monotone" 
                        dataKey="incoming" 
                        stroke="#9D2449" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorIncoming)" 
                        animationDuration={2000}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="completed" 
                        stroke="#B38E5D" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorCompleted)" 
                        animationDuration={2000}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};


// --- 3. Donut Chart: Status ---
interface PieChartProps {
    data: { name: string; value: number }[];
}

export const StatusDistributionChart = ({ data }: PieChartProps) => {
    // Calculate total for percentage
    const total = data ? data.reduce((sum, entry) => sum + entry.value, 0) : 0;

    const renderActiveShape = (props: any) => {
        return (
            <g>
                <text x={props.cx} y={props.cy} dy={8} textAnchor="middle" fill="#333" className="text-2xl font-bold">
                    {total}
                </text>
                 <text x={props.cx} y={props.cy + 25} textAnchor="middle" fill="#999" className="text-xs uppercase tracking-wider">
                    Total
                </text>
            </g>
        );
    };

    if (!data || data.length === 0) {
        return (
           <ChartContainer title="Estatus General" description="Proporción de estados">
                 <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <p className="font-bold text-sm">Sin datos para mostrar</p>
                 </div>
            </ChartContainer>
        );
    }

    return (
        <ChartContainer title="Estatus General" description="Proporción de estados">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1500}
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number | undefined) => [`${value} oficios`, 'Cantidad']} itemStyle={{fontSize: 12, fontWeight: 600, color: '#374151'}} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '11px', fontWeight: 600, color: '#4B5563'}} />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};
