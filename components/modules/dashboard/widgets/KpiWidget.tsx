'use client';

import React from 'react';
import CountUp from 'react-countup';

interface KpiWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: number;
  trend?: string;
  icon?: React.ReactNode; 
}

export const KpiWidget: React.FC<KpiWidgetProps> = ({ title, value, trend, icon, className, style, ...props }) => {
    return (
      <div 
        className={`bg-white rounded-xl p-6 flex flex-col relative transition-all duration-300 hover:shadow-lg ${className || 'shadow-md border-t-4 border-[#9D2449]'}`}
        style={style}
        {...props}
      >
        <div className="flex-grow flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-widest font-montserrat opacity-90">
                        {title}
                    </p>
                    <h3 className="text-4xl font-black text-gray-900 mt-2 font-montserrat tracking-tight leading-none">
                        <CountUp end={value} duration={2.5} separator="," />
                    </h3>
                </div>
                {/* Renderizamos el icono si existe */}
                {icon && <div className="ml-4 flex-shrink-0 text-gray-600 opacity-90 scale-110">{icon}</div>}
            </div>
            
            {trend && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs font-bold text-gray-500 flex items-center tracking-wide">
                    <span className="text-[#B38E5D] mr-2 animate-pulse w-2 h-2 rounded-full bg-[#B38E5D]"></span> {trend}
                </div>
            )}
        </div>
      </div>
    );
};
