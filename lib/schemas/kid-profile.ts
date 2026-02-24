import { z } from 'zod';

export const kidProfileSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(50),
    age: z.number().min(3, 'Edad mínima: 3 años').max(10, 'Edad máxima: 10 años'),
    avatar_url: z.string().optional(),
});
