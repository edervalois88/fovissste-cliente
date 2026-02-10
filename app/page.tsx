'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { FadeInView } from '@/components/ui/Animations';

// Componente de Login Oficial
import PageLoader from '@/components/ui/PageLoader';
import { FovisssteLogo } from '@/components/ui/FovisssteLogo';

// Componente de Login Oficial
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit } = useForm();

  // ... (handleLogin se mantiene igual)
  const handleLogin = async (data: any) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulación de delay para ver la animación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password
      });

      if (response.data.access_token) {
        // Guardar token (en localStorage o cookie segura)
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirigir al Dashboard según rol
        router.push('/dashboard/stats');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error de conexión con el servidor. Verifique que el Backend esté corriendo en el puerto 3000.');
      setIsLoading(false); 
    } 
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      {/* Overlay de Carga Full Screen */}
      {isLoading && <PageLoader isVisible={true} text="Autenticando..." />}

      {/* Columna Izquierda: Identidad Institucional */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-[#691C32] relative overflow-hidden text-white p-12">
        {/* ... Patrón de fondo (se mantiene) ... */}
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>

        {/* ... Decoración Dorada (se mantiene) ... */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#B38E5D] rounded-bl-full opacity-80"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#B38E5D] rounded-tr-full opacity-80"></div>

        <FadeInView className="z-10 w-full max-w-lg">
          <div className="mb-12 border-l-4 border-[#B38E5D] pl-6 flex items-center gap-6">
             {/* LOGO SVG AQUI */}
             <div className="bg-white p-2 rounded-full shadow-xl">
                <FovisssteLogo className="w-20 h-20" animated={true} />
             </div>
             <div>
                <h1 className="font-montserrat font-bold text-5xl mb-2 tracking-tight">Gobierno de México</h1>
                <h2 className="text-[#B38E5D] font-montserrat text-3xl font-light tracking-wide uppercase">FOVISSSTE</h2>
             </div>
          </div>
          
          {/* ... Resto del contenido (se mantiene) ... */}
          <div className="space-y-8">
            <p className="text-xl font-light leading-relaxed text-gray-100">
                Bienvenido al <strong className="font-bold text-white">Sistema de Gestión Documental</strong>. 
                Plataforma oficial para la administración eficiente, segura y transparente de la correspondencia institucional.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                    <h3 className="font-bold text-[#B38E5D] mb-1">Seguridad</h3>
                    <p className="text-xs text-gray-300">Autenticación robusta y encriptación de datos sensibles.</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                    <h3 className="font-bold text-[#B38E5D] mb-1">Eficiencia</h3>
                    <p className="text-xs text-gray-300">Automatización de flujos y trazabilidad completa de oficios.</p>
                </div>
            </div>
          </div>

          <div className="mt-16 text-xs text-gray-400 border-t border-white/10 pt-6 flex justify-between items-center">
            <div>
                <p className="font-semibold text-gray-300">Fondo de la Vivienda del ISSSTE</p>
                <p className="mt-1 opacity-75">Miguel Noreña 28, Col. San José Insurgentes, CP 03900</p>
            </div>
            {/* ... */}
          </div>
        </FadeInView>
      </div>

      {/* Columna Derecha: Formulario de Login */}
      <div className="flex flex-col justify-center items-center p-8 bg-white relative">
         {/* ... El formulario se queda igual ... */}
        <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:hidden mb-6 flex flex-col items-center">
                <FovisssteLogo className="w-16 h-16 mb-2" />
                <span className="text-[#9D2449] font-bold text-2xl block">FOVISSSTE</span>
                <span className="text-gray-500 text-sm">Sistema de Gestión Documental</span>
            </div>
            
            {/* ... Card ... */}
            <div className="card w-full bg-base-100 shadow-xl border border-gray-100">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl font-bold text-gray-800 mb-6">Iniciar Sesión</h2>
                    
                    <form 
                        onSubmit={handleSubmit(handleLogin)} 
                        className="space-y-4" 
                        method="POST"
                        noValidate
                    >
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold">Correo Institucional</span>
                            </label>
                            <input 
                                type="email" 
                                placeholder="usuario@fovissste.gob.mx" 
                                className="input input-bordered w-full focus:input-primary" 
                                autoComplete="username"
                                {...register('email', { 
                                    required: true,
                                    pattern: /^[a-zA-Z0-9._%+-]+@fovissste\.gob\.mx$/i 
                                })}
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold">Contraseña</span>
                            </label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                className="input input-bordered w-full focus:input-primary" 
                                autoComplete="current-password"
                                {...register('password', { required: true })}
                            />
                            <label className="label">
                                <span className="label-text-alt link link-hover text-[#B38E5D]">¿Olvidó su contraseña?</span>
                            </label>
                        </div>

                        {error && (
                            <div className="alert alert-error text-sm py-2 mt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="card-actions justify-end mt-6">
                            <button 
                                type="submit" 
                                className="btn btn-primary w-full text-white bg-[#9D2449] hover:bg-[#7a1c38] border-none"
                                disabled={isLoading}
                            >
                                {isLoading ? <span className="loading loading-dots"></span> : 'Ingresar al Portal'}
                            </button>
                        </div>
                    </form>
                    {/* ... */}
                </div>
            </div>
        </div>
        {/* ... Footer Móvil ... */}
      </div>
    </div>
  );
}
