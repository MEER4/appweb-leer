'use server';

import { createClient } from '@/lib/supabase/server';
import { safeAction } from '@/lib/actions/safe-action-helper';
import { z } from 'zod';
import { registerSchema } from '@/lib/schemas/auth';

export async function loginAction(formData: FormData) {
    return safeAction(async () => {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) throw new Error('Credenciales incompletas');

        const supabase = await createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw new Error('Credenciales incorrectas');
        }

        return { success: true };
    });
}

export async function registerAction(input: z.infer<typeof registerSchema>) {
    return safeAction(async () => {
        const validated = registerSchema.parse(input);
        const supabase = await createClient();

        // Crear usuario en Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: validated.email,
            password: validated.password,
            options: {
                data: {
                    pin: validated.pin, // Guardar PIN en metadata de usuario
                }
            }
        });

        if (error) {
            throw new Error(error.message);
        }

        // Insertar en la tabla parents si el usuario se creó correctamente
        if (data.user) {
            const { error: dbError } = await supabase.from('parents').insert({
                id: data.user.id,
                email: validated.email,
                pin_code: validated.pin
            });

            if (dbError) {
                console.error("Error al registrar datos del padre:", dbError);
                // No lanzamos error para no bloquear el auth si falló el insert
            }
        }

        return { success: true };
    });
}
