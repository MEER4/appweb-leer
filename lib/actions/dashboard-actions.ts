'use server';

import { createClient } from '@/lib/supabase/server';

export async function getDashboardStats(kidId: string) {
    const supabase = await createClient();

    // Verificar autenticación
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

    // Formatear para Recharts (Últimos 7 días)
    const chartDataMap: Record<string, number> = {};

    // Inicializar mapa con últimos 7 días con count 0
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('es-ES', { weekday: 'short' });
        chartDataMap[dateStr] = 0;
    }

    // Agregar progresos reales
    if (recentProgress) {
        recentProgress.forEach(p => {
            const d = new Date(p.completed_at);
            const dateStr = d.toLocaleDateString('es-ES', { weekday: 'short' });
            if (chartDataMap[dateStr] !== undefined) {
                chartDataMap[dateStr] += 1;
            }
        });
    }

    const chartData = Object.keys(chartDataMap).map(day => ({
        day,
        lessons: chartDataMap[day]
    }));

    return {
        totalLessons: recentProgress?.length || 0,
        recentActivity: recentProgress || [],
        totalRewards: rewardsCount || 0,
        chartData
    };
}

export async function getKids() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: kids } = await supabase
        .from('kids')
        .select('*')
        .eq('parent_id', user.id)
        .order('created_at');

    return kids || [];
}
