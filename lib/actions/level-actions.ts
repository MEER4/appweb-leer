'use server';

import { createClient } from '@/lib/supabase/server';

export async function getCompletedLevels() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Encontrar al primer niño activo
    const { data: kid } = await supabase.from('kids').select('id').eq('parent_id', user.id).limit(1).single();
    if (!kid) return [];

    // Buscar lecciones completadas para este niño
    const { data: progress } = await supabase
        .from('progress')
        .select('lesson_id')
        .eq('kid_id', kid.id);

    return progress || [];
}
