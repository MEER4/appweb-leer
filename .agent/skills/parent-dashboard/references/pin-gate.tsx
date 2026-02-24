'use client';

import { useState, useEffect } from 'react';

/**
 * Wrapper de seguridad para las vistas `/parent/*`
 */
export function PinGate({ children }: { children: React.ReactNode }) {
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        // Verificar si el PIN ya fue autenticado en esta sesión
        const stored = sessionStorage.getItem('pin_verified');
        if (stored === 'true') {
            setVerified(true);
        }
    }, []);

    if (!verified) {
        // PinModal renderiza un teclado numérico y maneja intentos fallidos
        return <PinModal onSuccess={() => setVerified(true)} />;
    }

    return <>{children}</>;
}

function PinModal({ onSuccess }: { onSuccess: () => void }) {
    // Lógica simplificada de modal y validación (Server Action verifyPin)
    return <div>[Validar PIN 4 dígitos]</div>;
}
