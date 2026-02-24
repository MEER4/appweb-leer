// Componente o layout wrapper para la zona infantil
export default function KidsZoneWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="kids-zone min-h-screen bg-bg-kids select-none"
            // Prevenir context menu (clic derecho)
            onContextMenu={(e) => e.preventDefault()}
            // Prevenir comportamiento de arrastre predeterminado del navegador
            onDragStart={(e) => e.preventDefault()}
            style={{
                WebkitUserSelect: 'none',
                userSelect: 'none',
                WebkitTouchCallout: 'none',
                WebkitTapHighlightColor: 'transparent'
            }}
        >
            {children}
        </div>
    );
}
