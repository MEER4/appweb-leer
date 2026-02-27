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

// Map lesson IDs to their target item (letter or number)
const LESSON_ITEM_MAP: Record<string, { item: string; type: 'letter' | 'number' }> = {
    // Phonetics - Vocales
    'lvl_1_a': { item: 'A', type: 'letter' },
    'lvl_2_e': { item: 'E', type: 'letter' },
    'lvl_3_i': { item: 'I', type: 'letter' },
    'lvl_4_o': { item: 'O', type: 'letter' },
    'lvl_5_u': { item: 'U', type: 'letter' },
    // Phonetics - Primeras Letras
    'lvl_6_m': { item: 'M', type: 'letter' },
    'lvl_7_p': { item: 'P', type: 'letter' },
    'lvl_8_s': { item: 'S', type: 'letter' },
    'lvl_9_l': { item: 'L', type: 'letter' },
    // Phonetics - Letras Fuertes
    'lvl_10_b': { item: 'B', type: 'letter' },
    'lvl_11_c': { item: 'C', type: 'letter' },
    'lvl_12_d': { item: 'D', type: 'letter' },
    'lvl_13_f': { item: 'F', type: 'letter' },
    'lvl_14_g': { item: 'G', type: 'letter' },
    'lvl_15_j': { item: 'J', type: 'letter' },
    'lvl_16_r': { item: 'R', type: 'letter' },
    'lvl_17_t': { item: 'T', type: 'letter' },
    // Phonetics - Letras Suaves
    'lvl_18_h': { item: 'H', type: 'letter' },
    'lvl_19_k': { item: 'K', type: 'letter' },
    'lvl_20_n': { item: 'N', type: 'letter' },
    'lvl_21_ny': { item: 'Ñ', type: 'letter' },
    // Math
    'math_1': { item: '1', type: 'number' },
    'math_2': { item: '2', type: 'number' },
    'math_3': { item: '3', type: 'number' },
    'math_4': { item: '4', type: 'number' },
    'math_5': { item: '5', type: 'number' },
    'math_6': { item: '6', type: 'number' },
    'math_7': { item: '7', type: 'number' },
    'math_8': { item: '8', type: 'number' },
    'math_9': { item: '9', type: 'number' },
    'math_10': { item: '10', type: 'number' },
};

export async function getLetterMastery(kidId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    // Fetch ALL progress for this kid (not just 7 days) to build a cumulative mastery view
    const { data: allProgress } = await supabase
        .from('progress')
        .select('lesson_id, lesson_type, score, mistakes')
        .eq('kid_id', kidId)
        .in('lesson_type', ['phonetics', 'math'])
        .order('completed_at', { ascending: false });

    if (!allProgress || allProgress.length === 0) {
        return { letters: [], numbers: [] };
    }

    // Aggregate by item
    const aggregated: Record<string, {
        item: string;
        type: 'letter' | 'number';
        attempts: number;
        totalScore: number;
        totalMistakes: number;
    }> = {};

    allProgress.forEach(p => {
        const mapping = LESSON_ITEM_MAP[p.lesson_id];
        if (!mapping) return;

        if (!aggregated[mapping.item]) {
            aggregated[mapping.item] = {
                item: mapping.item,
                type: mapping.type,
                attempts: 0,
                totalScore: 0,
                totalMistakes: 0,
            };
        }

        aggregated[mapping.item].attempts += 1;
        aggregated[mapping.item].totalScore += (p.score ?? 100);
        aggregated[mapping.item].totalMistakes += (p.mistakes ?? 0);
    });

    // Convert to arrays with averages
    const items = Object.values(aggregated).map(a => ({
        item: a.item,
        type: a.type,
        attempts: a.attempts,
        avgScore: Math.round(a.totalScore / a.attempts),
        totalMistakes: a.totalMistakes,
    }));

    return {
        letters: items.filter(i => i.type === 'letter').sort((a, b) => a.avgScore - b.avgScore),
        numbers: items.filter(i => i.type === 'number').sort((a, b) => a.avgScore - b.avgScore),
    };
}
