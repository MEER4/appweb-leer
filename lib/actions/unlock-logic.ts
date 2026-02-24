'use server';

import { createClient } from '@/lib/supabase/server';
import { REWARDS_CATALOG } from '../constants/rewards-catalog';

export async function checkRewardUnlock(kidId: string) {
    const supabase = await createClient();

    // Contar lecciones completadas
    const { count } = await supabase
        .from('progress')
        .select('*', { count: 'exact', head: true })
        .eq('kid_id', kidId);

    // Obtener recompensas ya desbloqueadas
    const { data: unlockedRewards } = await supabase
        .from('rewards')
        .select('reward_name')
        .eq('kid_id', kidId);

    const unlockedNames = new Set(unlockedRewards?.map((r) => r.reward_name));

    // Verificar catálogo contra progreso actual
    for (const reward of REWARDS_CATALOG) {
        if (unlockedNames.has(reward.name)) continue;

        const condition = reward.condition as { totalLessons?: number };
        const neededLessons = condition.totalLessons;
        if (neededLessons && (count || 0) >= neededLessons) {
            // ¡Desbloquear!
            await supabase.from('rewards').insert({
                kid_id: kidId,
                reward_type: reward.type,
                reward_name: reward.name,
            });
            return { id: reward.id, name: reward.name, type: reward.type };
        }
    }

    return null; // Sin nueva recompensa
}
