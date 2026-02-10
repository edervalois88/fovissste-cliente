import React from 'react';

// Utility for classnames, similar to 'clsx' or 'cn'
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: string;
  className?: string;
}


export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  className 
}) => {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-md border-t-4 border-[#9D2449] p-6 hover:shadow-lg transition-all duration-300", 
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider font-montserrat">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-gray-900 mt-2 font-montserrat">
            {value}
          </h3>
        </div>
        {icon && (
          <div className="p-3 bg-gray-50 rounded-full text-[#9D2449]">
            {icon}
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-xs font-semibold text-gray-400 flex items-center">
           <span className="text-[#B38E5D] mr-1">●</span> {trend}
        </div>
      )}
    </div>
  );
};
