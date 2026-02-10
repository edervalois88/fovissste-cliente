import { z } from 'zod';

// SOLID: Single Responsibility Principle
// Este esquema define únicamente las reglas de negocio para la captura de documentos.
// Evita "números mágicos" y mensajes hardcoded.

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];
const PASSWORD_REGEX = /^[a-zA-Z0-9]{8}$/;

export const DocumentSchema = z.object({
  // Identificador Oficial
  folio: z.string()
    .min(3, { message: "El folio debe tener al menos 3 caracteres (Ej. DG/2024)" })
    .max(50, { message: "El folio no puede exceder 50 caracteres" }),

  // Regla de Negocio: No fechas futuras
  receptionDate: z.string().refine((date) => {
    return new Date(date) <= new Date();
  }, { message: "La fecha de recepción no puede ser futura" }),

  // Fecha del Oficio (puede ser anterior a recepción)
  officialDate: z.string({ required_error: "La fecha del oficio es obligatoria" }),

  // Área Asignada (Gestión Estructural)
  assigned_department_id: z.string().min(1, "Debe asignar un área responsable (Use el selector jerárquico)"),

  // Tipificación relajada para catálogos dinámicos
  instruction: z.string().min(1, "Seleccione una instrucción válida"),

  // Tipo de Documento
  docType: z.string().min(1, "Seleccione el tipo de documento"),

  // Fecha Límite (Calculada o Manual)
  deadline: z.string().optional(),

  // Prioridad
  priority: z.enum(["Normal", "Urgente"]),

  description: z.string()
    .min(10, { message: "La descripción debe ser detallada (mínimo 10 caracteres)" }),

  // Lógica condicional de remitente
  senderType: z.enum(["INTERNO", "EXTERNO"]),
  
  // Campos condicionales (en UI se maneja la visibilidad, aquí validamos formato si existe)
  senderName: z.string().min(2, "El nombre del remitente es obligatorio"),
  senderPosition: z.string().min(2, "El cargo es obligatorio"),
  senderAgency: z.string().min(2, "La dependencia es obligatoria"),

  // Seguridad: Encriptación
  shouldEncrypt: z.boolean().default(false),
  password: z.string().optional(),

  // Validación de Archivo (Compleja)
  attachment: z
    .any()
    .refine((files) => files?.length > 0, "Debe adjuntar el oficio escaneado (PDF)")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `El tamaño máximo es 10MB`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Solo se aceptan archivos PDF (.pdf)"
    ),
}).superRefine((data, ctx) => {
  if (data.shouldEncrypt && !PASSWORD_REGEX.test(String(data.password || ''))) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['password'],
      message: 'Debe tener 8 caracteres letras/números',
    });
  }
});

export type DocumentFormData = z.infer<typeof DocumentSchema>;
