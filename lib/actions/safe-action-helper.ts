import { z } from 'zod';

export type ActionResult<T> = {
    data?: T;
    error?: string;
};

export async function safeAction<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
    try {
        const data = await fn();
        return { data };
    } catch (err: unknown) {
        if (err && typeof err === 'object' && 'name' in err && err.name === 'ZodError') {
            const zodErr = err as unknown as { errors: Array<{ message: string }> };
            return { error: zodErr.errors?.[0]?.message || 'Error de validación' };
        }
        return { error: err instanceof Error ? err.message : 'Error desconocido' };
    }
}
