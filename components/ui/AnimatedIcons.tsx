import React from 'react';

// 1. Total Recibidos: Bandeja con documento entrando (Bounce)
export const IconReceived = () => (
<div className="relative w-12 h-12 flex items-center justify-center bg-blue-50 rounded-full">
    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
    <div className="absolute top-0 right-0 animate-bounce">
        <svg className="w-4 h-4 text-blue-500 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
    </div>
</div>
);

// 2. En Trámite: Engranajes / Proceso (Spin / Pulse)
export const IconProcess = () => (
<div className="relative w-12 h-12 flex items-center justify-center bg-orange-50 rounded-full">
    <svg className="w-7 h-7 text-orange-500 animate-[spin_4s_linear_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
    <div className="absolute pb-1 pl-1">
        <svg className="w-3 h-3 text-orange-400 animate-ping" fill="currentColor" viewBox="0 0 24 24">
             <circle cx="12" cy="12" r="10"/>
        </svg>
    </div>
</div>
);

// 3. Atendidos: Checkmark verificado (Scale / Pulse)
export const IconCompleted = () => (
<div className="relative w-12 h-12 flex items-center justify-center bg-green-50 rounded-full group">
    <svg className="w-6 h-6 text-green-600 transition-transform group-hover:scale-110 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div className="absolute top-0 right-0">
        <span className="flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
    </div>
</div>
);

// 4. Vencidos: Alerta (Wiggle / Pulse)
export const IconOverdue = () => (
<div className="relative w-12 h-12 flex items-center justify-center bg-red-50 rounded-full">
    <svg className="w-6 h-6 text-red-600 animate-[pulse_2s_ease-in-out_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    {/* Exclamación extra para énfasis */}
    <div className="absolute -top-1 -right-1 animate-bounce">
         <span className="text-red-500 font-bold text-xs">!</span>
    </div>
</div>
);
