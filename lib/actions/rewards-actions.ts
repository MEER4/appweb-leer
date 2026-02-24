'use server';

import { createClient } from '@/lib/supabase/server';

export async function getUnlockedRewards() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Find first kid
    const { data: kid } = await supabase.from('kids').select('id').eq('parent_id', user.id).limit(1).single();
    if (!kid) return [];

    // Fetch rewards
    const { data: rewards } = await supabase.from('rewards').select('reward_name, unlocked_at').eq('kid_id', kid.id);
    return rewards || [];
}
