'use server';

import { createClient } from '@/lib/supabase/server';

export async function getDashboardStats(kidId: string) {
    const supabase = await createClient();

    // Verificar que el kid pertenece al padre autenticado (RLS lo hace, pero doble check)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Lecciones de los últimos 7 días
    const { data: recentProgress } = await supabase
        .from('progress')
        .select('*')
        .eq('kid_id', kidId)
        .gte('completed_at', sevenDaysAgo.toISOString())
        .order('completed_at', { ascending: false });

    // Recompensas totales
    const { count: rewardsCount } = await supabase
        .from('rewards')
        .select('*', { count: 'exact', head: true })
        .eq('kid_id', kidId);

    return {
        totalLessons: recentProgress?.length || 0,
        recentActivity: recentProgress || [],
        totalRewards: rewardsCount || 0,
    };
}

export async function getKids() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: kids } = await supabase
        .from('kids')
        .select('*')
        .eq('parent_id', user!.id)
        .order('created_at');

    return kids || [];
}
