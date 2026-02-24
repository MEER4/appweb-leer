// Patrón de error handling en Server Actions
import { z } from 'zod';

export type ActionResult<T> = {
    data?: T;
    error?: string;
};

export async function safeAction<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
    try {
        const data = await fn();
        return { data };
    } catch (err) {
        if (err instanceof z.ZodError) {
            return { error: err.errors[0].message };
        }
        return { error: err instanceof Error ? err.message : 'Error desconocido' };
    }
}
