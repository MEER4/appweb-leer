'use client';

import { useEffect, useCallback } from 'react';
import { saveProgress } from '@/lib/actions/save-progress';

// Encola progreso localmente si no hay conexión
export function queueProgress(data: any) {
    if (typeof window !== 'undefined') {
        const queue = JSON.parse(localStorage.getItem('progress_queue') || '[]');
        queue.push({ ...data, timestamp: Date.now() });
        localStorage.setItem('progress_queue', JSON.stringify(queue));
    }
}

// Hook para sincronizar cuando vuelva la conexión
export function useOfflineSync() {

    const flushQueue = useCallback(async () => {
        if (typeof window === 'undefined') return;
        if (!navigator.onLine) return;

        const queue = JSON.parse(localStorage.getItem('progress_queue') || '[]');
        if (queue.length === 0) return;

        console.log(`Intentando sincronizar ${queue.length} jugadas guardadas offline...`);
        const remainingQueue = [];

        for (const item of queue) {
            try {
                const res = await saveProgress(item);
                if (!res?.data?.success) {
                    console.error('Error del servidor sincronizando progreso:', res);
                }
            } catch (e) {
                console.error('Error de red sincronizando progreso offline', e);
                // Si falla por red (offline real), lo mantenemos en la cola
                remainingQueue.push(item);
            }
        }

        if (remainingQueue.length > 0) {
            localStorage.setItem('progress_queue', JSON.stringify(remainingQueue));
        } else {
            localStorage.removeItem('progress_queue');
            console.log('Sincronización offline completada con éxito.');
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('online', flushQueue);
            // Intentar al montar (por si el navegador cerró y abrió teniendo internet ahora)
            flushQueue();
            return () => window.removeEventListener('online', flushQueue);
        }
    }, [flushQueue]);
}
