import React from 'react';

interface ChartWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    type: 'bar' | 'pie' | 'line';
}
  
export const ChartWidget: React.FC<ChartWidgetProps> = ({ title, type, className, style, ...props }) => {
    return (
      <div 
        className={`card bg-white shadow-sm border border-gray-200 flex flex-col ${className || ''}`}
        style={style}
        {...props}
      >
         <div className="p-4 border-b border-gray-100">
           <span className="font-bold text-sm text-gray-600 uppercase tracking-wide">{title}</span>
         </div>
         
         <div className="card-body flex items-center justify-center p-6 flex-grow h-full">
           {type === 'bar' && (
               <div className="text-gray-300 text-center">
                 <span className="text-5xl block mb-2 opacity-50">📊</span>
                 <p className="text-sm font-medium">Gráfica de Barras</p>
               </div>
           )}
           {type === 'pie' && (
                <div className="radial-progress text-primary font-bold text-xl" style={{"--value":70, "--size": "8rem"} as any} role="progressbar">70%</div>
           )}
         </div>
      </div>
    );
};
