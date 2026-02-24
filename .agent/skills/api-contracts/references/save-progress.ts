'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export const progressSchema = z.object({
    kidId: z.string().uuid(),
    lessonType: z.enum(['phonetics', 'story', 'tracing']),
    lessonId: z.string().min(1),
    score: z.number().int().min(0).max(100),
});

export async function saveProgress(input: z.infer<typeof progressSchema>) {
    const validated = progressSchema.parse(input);
    const supabase = await createClient();

    const { error } = await supabase.from('progress').insert({
        kid_id: validated.kidId,
        lesson_type: validated.lessonType,
        lesson_id: validated.lessonId,
        score: validated.score,
    });

    if (error) throw new Error('Error al guardar progreso');

    // En una app real, aquí se llamaría a checkRewardUnlock importado
    // const reward = await checkRewardUnlock(validated.kidId);

    return {
        success: true,
        rewardUnlocked: null, // Placeholder
    };
}
