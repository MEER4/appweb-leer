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
    // Ahora guardamos un objeto por día con el conteo de cada tipo de lección
    const chartDataMap: Record<string, {
        phonetics: number;
        math: number;
        tracing: number;
        story: number;
        memory: number;
        total: number;
    }> = {};

    // Inicializar mapa con últimos 7 días
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('es-ES', { weekday: 'short' });
        chartDataMap[dateStr] = { phonetics: 0, math: 0, tracing: 0, story: 0, memory: 0, total: 0 };
    }

    // Agregar progresos reales
    if (recentProgress) {
        recentProgress.forEach(p => {
            const d = new Date(p.completed_at);
            const dateStr = d.toLocaleDateString('es-ES', { weekday: 'short' });
            if (chartDataMap[dateStr] !== undefined) {
                chartDataMap[dateStr].total += 1;

                // Sumar dependiendo del tipo
                if (p.lesson_type === 'phonetics') chartDataMap[dateStr].phonetics += 1;
                else if (p.lesson_type === 'math') chartDataMap[dateStr].math += 1;
                else if (p.lesson_type === 'tracing') chartDataMap[dateStr].tracing += 1;
                else if (p.lesson_type === 'story') chartDataMap[dateStr].story += 1;
                else if (p.lesson_type === 'memory') chartDataMap[dateStr].memory += 1;
            }
        });
    }

    const chartData = Object.keys(chartDataMap).map(day => ({
        day,
        ...chartDataMap[day]
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
