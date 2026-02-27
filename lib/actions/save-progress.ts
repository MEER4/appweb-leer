'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { safeAction } from '@/lib/actions/safe-action-helper';
import { checkRewardUnlock } from './unlock-logic';

const progressSchema = z.object({
    kidId: z.string().uuid().optional(),
    lessonType: z.enum(['phonetics', 'story', 'tracing', 'memory']),
    lessonId: z.string().min(1),
    score: z.number().int().min(0).max(100),
    stars: z.number().int().min(0).max(3).optional(),
    mistakes: z.number().int().min(0).optional(),
});

export async function saveProgress(input: z.infer<typeof progressSchema>) {
    return safeAction(async () => {
        const validated = progressSchema.parse(input);
        const supabase = await createClient();

        let activeKidId = validated.kidId;

        // Si no nos pasan kidId desde el cliente, buscamos el primer hijo del padre logueado (temporal hasta hacer el selector de perfiles)
        if (!activeKidId) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No autorizado');

            const { data } = await supabase.from('kids').select('id').eq('parent_id', user.id).limit(1).single();
            if (!data) throw new Error('No hay perfiles de niños creados');
            activeKidId = data.id;
        }

        if (!activeKidId) {
            throw new Error('ID de niño no válido');
        }

        const { error } = await supabase.from('progress').insert({
            kid_id: activeKidId,
            lesson_type: validated.lessonType,
            lesson_id: validated.lessonId,
            score: validated.score,
        });

        if (error) {
            console.error("Error al guardar progreso:", error);
            throw new Error('Error al guardar progreso');
        }

        // Ejecutar Lógica de Desbloqueo de Recompensas
        const reward = await checkRewardUnlock(activeKidId);

        return {
            success: true,
            rewardUnlocked: reward, // null si no se desbloqueó nada
        };
    });
}
