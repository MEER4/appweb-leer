// Para encolar progreso localmente si no hay conexión
export function queueProgress(data: any) {
    const queue = JSON.parse(localStorage.getItem('progress_queue') || '[]');
    queue.push({ ...data, timestamp: Date.now() });
    localStorage.setItem('progress_queue', JSON.stringify(queue));
}

// Sincronizar cuando vuelva la conexión (ej. en root layout o un hook global)
export function useOfflineSync(saveProgressFunction: (data: any) => Promise<any>) {
    if (typeof window !== 'undefined') {
        window.addEventListener('online', async () => {
            const queue = JSON.parse(localStorage.getItem('progress_queue') || '[]');
            for (const item of queue) {
                await saveProgressFunction(item);
            }
            localStorage.removeItem('progress_queue');
        });
    }
}
