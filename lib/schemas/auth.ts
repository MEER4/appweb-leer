import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Email no válido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string(),
    pin: z.string().length(4, 'El PIN debe tener 4 dígitos').regex(/^\d{4}$/, 'Solo números'),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

export const pinSchema = z.object({
    pin: z.string().length(4).regex(/^\d{4}$/),
});
