'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// -- 1. GESTIÓN DE NIÑOS --

export async function addKid(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'No autorizado' };

    const name = formData.get('name') as string;
    const age = parseInt(formData.get('age') as string);
    const avatarIcon = formData.get('avatar_icon') as string || '🧑';

    if (!name || isNaN(age)) {
        return { success: false, error: 'Nombre y edad son requeridos' };
    }

    const { error } = await supabase
        .from('kids')
        .insert({
            parent_id: user.id,
            name,
            age,
            avatar_url: avatarIcon
        });

    if (error) {
        console.error("Error creating kid", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/parent/settings');
    revalidatePath('/parent');
    return { success: true };
}

export async function deleteKid(kidId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('No autorizado');

    // Gracias al "ON DELETE CASCADE" en la BD, eliminar al niño limpiará sus "rewards" y "progress"
    const { error } = await supabase
        .from('kids')
        .delete()
        .eq('id', kidId)
        .eq('parent_id', user.id); // Asegura que solo elimine un hijo del padre actual

    if (error) {
        console.error("Error deleting kid", error);
        throw new Error('Error al eliminar perfil');
    }

    revalidatePath('/parent/settings');
    revalidatePath('/parent');
    return { success: true };
}

// -- 2. SEGURIDAD --

export async function updateParentPin(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('No autorizado');

    const newPin = formData.get('pin') as string;

    if (!newPin || newPin.length !== 4) {
        throw new Error('El PIN debe tener exactamente 4 dígitos');
    }

    // Actualizamos el PIN en el app_metadata del usuario usando auth.admin si fuera necesario,
    // o user_metadata si las políticas RLS permiten auto-update (en nuestro caso usamos user_metadata)
    const { error } = await supabase.auth.updateUser({
        data: { parent_pin: newPin }
    });

    if (error) {
        console.error("Error updating PIN", error);
        throw new Error('Error al actualizar PIN');
    }

    return { success: true };
}

// -- 3. SESIÓN --

export async function parentSignOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/');
}
