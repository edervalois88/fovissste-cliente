'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navbar } from '@/components/layout/Navbar';
import { DocumentSchema, DocumentFormData } from '@/lib/schemas/document.schema';
import { StepTransition, FadeInView } from '@/components/ui/Animations';
import { DocumentService } from '@/lib/services/document.service';
import PageLoader from '@/components/ui/PageLoader';
import { Toast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { CascadingDepartmentSelect } from '@/components/ui/CascadingDepartmentSelect';
import { useCatalogs } from '@/hooks/useCatalogs';
import { addDays, format } from 'date-fns';
import { Eye, EyeOff } from 'lucide-react';

export default function DocumentRegistryWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ show: boolean, msg: string, type: 'success'|'error' }>({ show: false, msg: '', type: 'success' });
  
  // Catalogs
  const { data: docTypes, isLoading: loadingDocTypes } = useCatalogs('DOC_TYPE');
  const { data: instructions, isLoading: loadingInstructions } = useCatalogs('INSTRUCTION');
  const { data: externalEntities, isLoading: loadingEntities } = useCatalogs('EXTERNAL_ENTITY');

  const { 
    register, 
    handleSubmit, 
    watch, 
    trigger,
    setValue,
    formState: { errors } 
  } = useForm<DocumentFormData>({
    resolver: zodResolver(DocumentSchema),
    defaultValues: {
      shouldEncrypt: false,
      password: '',
      instruction: '',
      priority: 'Normal',
      senderType: 'EXTERNO',
      docType: '',
      deadline: ''
    },
    mode: 'onChange'
  });

  const senderType = watch('senderType');
  const selectedDocType = watch('docType');
  const selectedInstruction = watch('instruction');
  const selectedSenderAgency = watch('senderAgency'); // For autocomplete logic if needed, simple datalist used here
  const shouldEncrypt = watch('shouldEncrypt');

  // --- Logic Based on Metadata ---

  // 1. Doc Type Logic: Hide fields if not requires_response
  const currentDocTypeMeta = docTypes?.find(d => d.name === selectedDocType)?.metadata;
  const requiresResponse = currentDocTypeMeta?.requires_response !== false; // Default true if meta missing

  // 2. Instruction Logic: Set deadline based on SLA
  useEffect(() => {
    const instructionMeta = instructions?.find(i => i.name === selectedInstruction)?.metadata;
    if (instructionMeta?.sla_days !== undefined) {
        const slaDays = Number(instructionMeta.sla_days);
        if (slaDays > 0) {
            const deadlineDate = addDays(new Date(), slaDays);
            setValue('deadline', format(deadlineDate, 'yyyy-MM-dd'));
        } else {
             setValue('deadline', '');
        }
    }
  }, [selectedInstruction, instructions, setValue]);


  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(['folio', 'officialDate', 'receptionDate', 'docType', 'priority', 'instruction', 'deadline', 'assigned_department_id', 'description']);
    } else if (step === 2) {
      isValid = await trigger(['senderName', 'senderPosition', 'senderAgency']);
    }
    
    if (isValid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: DocumentFormData) => {
    setIsSubmitting(true);
    setToast({ show: false, msg: '', type: 'success' });
    
    try {
      const result = await DocumentService.createDocument(data);
      console.log("Éxito:", result);
      setToast({ show: true, msg: `¡Documento registrado! Folio Interno: #${result.documentId}`, type: 'success' });
      
      setTimeout(() => {
         router.push('/dashboard/inbox');
      }, 2000);

    } catch (error: any) {
      console.error("Error al registrar:", error);
      const msg = error.response?.data?.message || "Error de conexión con el servidor.";
      setToast({ show: true, msg: `Error: ${Array.isArray(msg) ? msg[0] : msg}`, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-montserrat pb-20">
      
      <PageLoader isVisible={isSubmitting} text="Guardando y Cifrando..." />

      <Toast 
        visible={toast.show} 
        message={toast.msg} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />

      <main className="max-w-4xl mx-auto py-10 px-4">
        
        <FadeInView>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Nuevo Registro Inteligente</h1>
            <p className="text-gray-500">Sistema de Gestión Documental</p>
          </div>
        
          <ul className="steps steps-vertical lg:steps-horizontal w-full mb-8">
            <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Datos Generales</li>
            <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Remitente</li>
            <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Anexos y Seguridad</li>
          </ul>
        </FadeInView>

        <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-100 shadow-xl border border-gray-100">
          <div className="card-body">
            
            {/* PASO 1: DATOS GENERALES */}
            {step === 1 && (
              <StepTransition>
                <h2 className="card-title text-xl border-b pb-2 mb-4">Detalles del Oficio</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="form-control w-full">
                    <label className="label"><span className="label-text font-semibold">No. de Oficio</span></label>
                    <input 
                      type="text" 
                      placeholder="Ej. DG/2024/005" 
                      className={`input input-bordered w-full ${errors.folio ? 'input-error' : ''}`}
                      {...register('folio')} 
                    />
                    {errors.folio && <span className="text-error text-xs mt-1">{errors.folio.message}</span>}
                  </div>

                  <div className="form-control w-full">
                    <label className="label"><span className="label-text font-semibold">Fecha del Oficio</span></label>
                    <input 
                      type="date" 
                      className={`input input-bordered w-full ${errors.officialDate ? 'input-error' : ''}`}
                      {...register('officialDate')} 
                    />
                    {errors.officialDate && <span className="text-error text-xs mt-1">{errors.officialDate.message}</span>}
                  </div>

                  <div className="form-control w-full">
                    <label className="label"><span className="label-text font-semibold">Fecha de Recepción</span></label>
                    <input 
                      type="date" 
                      className={`input input-bordered w-full ${errors.receptionDate ? 'input-error' : ''}`}
                      {...register('receptionDate')} 
                    />
                    {errors.receptionDate && <span className="text-error text-xs mt-1">{errors.receptionDate.message}</span>}
                  </div>
                </div>

                {/* Dynamic Catalogs Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                   <div className="form-control w-full">
                      <label className="label"><span className="label-text font-semibold">Tipo Documento</span></label>
                      <select className="select select-bordered w-full" {...register('docType')}>
                          <option value="">Seleccione...</option>
                          {docTypes?.map(t => (
                              <option key={t.id} value={t.name}>{t.name}</option>
                          ))}
                      </select>
                      {currentDocTypeMeta && !requiresResponse && (
                          <span className="text-xs text-gray-400 mt-1 italic">No requiere respuesta obligatoria.</span>
                      )}
                   </div>

                   <div className="form-control w-full">
                      <label className="label"><span className="label-text font-semibold">Prioridad</span></label>
                      <select className="select select-bordered w-full" {...register('priority')}>
                          <option value="Normal">Normal</option>
                          <option value="Urgente">Urgente</option>
                      </select>
                   </div>

                   <div className="form-control w-full">
                      <label className="label">
                          <span className="label-text font-semibold">Instrucción</span>
                          {/* Badge for instruction color */}
                          {selectedInstruction && (() => {
                              const meta = instructions?.find(i => i.name === selectedInstruction)?.metadata;
                              return meta?.color ? (
                                  <span className={`badge badge-xs ml-2 bg-${meta.color}-500 border-none`}></span>
                              ) : null;
                          })()}
                      </label>
                      <select className="select select-bordered w-full" {...register('instruction')}>
                          <option value="">Seleccione...</option>
                          {instructions?.map(i => (
                              <option key={i.id} value={i.name} style={{ color: i.metadata?.color }}>{i.name}</option>
                          ))}
                      </select>
                   </div>

                   {requiresResponse && (
                       <div className="form-control w-full">
                          <label className="label"><span className="label-text font-semibold text-[#9D2449]">Fecha Límite</span></label>
                          <input 
                              type="date" 
                              className="input input-bordered w-full font-bold"
                              {...register('deadline')}
                          />
                       </div>
                   )}
                </div>

                {/* Área de Asignación (Cascada) */}
                <div className="form-control mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="label"><span className="label-text font-bold text-[#9D2449]">Asignación de Área (Turnar a)</span></label>
                    <CascadingDepartmentSelect 
                        onSelect={(id) => setValue('assigned_department_id', id, { shouldValidate: true })}
                    />
                    {errors.assigned_department_id && <span className="text-error text-xs mt-1">{errors.assigned_department_id.message}</span>}
                </div>

                <div className="form-control mt-4">
                  <label className="label"><span className="label-text font-semibold">Asunto / Descripción</span></label>
                  <textarea 
                    className={`textarea textarea-bordered h-24 ${errors.description ? 'textarea-error' : ''}`} 
                    placeholder="Resumen del contenido del documento..."
                    {...register('description')}
                  ></textarea>
                  {errors.description && <span className="text-error text-xs mt-1">{errors.description.message}</span>}
                </div>
              </StepTransition>
            )}

            {/* PASO 2: REMITENTE */}
            {step === 2 && (
              <StepTransition>
                <h2 className="card-title text-xl border-b pb-2 mb-4">Origen del Documento</h2>
                
                <div className="tabs tabs-boxed mb-6 bg-gray-100">
                  <a className={`tab ${senderType === 'EXTERNO' ? 'tab-active bg-primary text-white' : ''}`} onClick={() => setValue('senderType', 'EXTERNO')}>Externo</a>
                  <a className={`tab ${senderType === 'INTERNO' ? 'tab-active bg-primary text-white' : ''}`} onClick={() => setValue('senderType', 'INTERNO')}>Interno</a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label"><span className="label-text">Nombre Remitente</span></label>
                    <input type="text" className="input input-bordered" {...register('senderName')} />
                     {errors.senderName && <span className="text-error text-xs">{errors.senderName.message}</span>}
                  </div>
                   <div className="form-control w-full">
                    <label className="label"><span className="label-text">Cargo</span></label>
                    <input type="text" className="input input-bordered" {...register('senderPosition')} />
                    {errors.senderPosition && <span className="text-error text-xs">{errors.senderPosition.message}</span>}
                  </div>
                </div>

                <div className="form-control w-full mt-4">
                    <label className="label"><span className="label-text">Dependencia / Área</span></label>
                    
                    {/* AUTOCOMPLETE / DATALIST FOR SENDER AGENCY */}
                    <input 
                        type="text" 
                        list="agencies"
                        className="input input-bordered" 
                        {...register('senderAgency')} 
                        placeholder="Escriba o seleccione..."
                    />
                    <datalist id="agencies">
                        {externalEntities?.map(entity => (
                            <option key={entity.id} value={entity.name} />
                        ))}
                    </datalist>

                    {errors.senderAgency && <span className="text-error text-xs">{errors.senderAgency.message}</span>}
                </div>
              </StepTransition>
            )}

            {/* PASO 3: ARCHIVOS Y SEGURIDAD */}
            {step === 3 && (
              <StepTransition>
                <h2 className="card-title text-xl border-b pb-2 mb-4">Digitalización y Cifrado</h2>

                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-semibold">Adjuntar PDF Escaneado</span></label>
                  <input 
                    type="file" 
                    className="file-input file-input-bordered file-input-primary w-full" 
                    accept=".pdf"
                    {...register('attachment')}
                  />
                  {errors.attachment && <span className="text-error text-xs mt-1">{errors.attachment.message as string}</span>}
                </div>

                <div className="form-control w-full mt-4">
                  <label className="cursor-pointer label justify-start gap-4">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      {...register('shouldEncrypt')}
                    />
                    <span className="label-text font-semibold">Proteger documento con contraseña (Nivel Confidencial)</span>
                  </label>
                  <span className="text-xs text-gray-400 ml-10">El PDF se almacenará cifrado y requerirá contraseña para abrirse.</span>
                </div>

                {shouldEncrypt && (
                  <div className="form-control w-full mt-4">
                    <label className="label"><span className="label-text font-semibold">Contraseña del PDF</span></label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`input input-bordered w-full pr-12 ${errors.password ? 'input-error' : ''}`}
                        placeholder="8 caracteres alfanuméricos"
                        {...register('password')}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <span className="text-error text-xs mt-1">{errors.password.message}</span>}
                    <span className="text-xs text-amber-600 mt-2">
                      Nota: Esta contraseña será necesaria para abrir el PDF. El sistema la enviará al destinatario, pero se recomienda compartirla por un medio seguro alterno.
                    </span>
                  </div>
                )}

              </StepTransition>
            )}

            {/* BARRA DE NAVEGACIÓN INFERIOR */}
            <div className="card-actions justify-between mt-8 pt-4 border-t">
              {step > 1 ? (
                <button type="button" className="btn btn-outline" onClick={() => setStep(s => s - 1)} disabled={isSubmitting}>Atrás</button>
              ) : <div></div>}
              
              {step < 3 ? (
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  type="button" 
                  className="btn btn-primary text-white" 
                  onClick={nextStep}
                >
                  Siguiente
                </motion.button>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  className="btn btn-secondary text-white" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <span className="loading loading-spinner"></span> : 'Registrar Documento'}
                </motion.button>
              )}
            </div>

          </div>
        </form>
      </main>
    </div>
  );
}
