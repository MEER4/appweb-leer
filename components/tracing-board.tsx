'use client';

import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';

export type TracingBoardRef = {
    clearBoard: () => void;
};

type TracingBoardProps = {
    color: string;
    brushSize?: number;
    targetLetter: string;
    guideColorClass: string;
};

const TracingBoard = forwardRef<TracingBoardRef, TracingBoardProps>(
    ({ color, brushSize = 25, targetLetter, guideColorClass }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const [isDrawing, setIsDrawing] = useState(false);
        const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

        // Inicializar el contexto del Canvas y ajustarlo a alta resolución
        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const context = canvas.getContext('2d');
            if (context) {
                // Ajustar resolución para retina displays / pantallas de alta densidad
                const dpr = window.devicePixelRatio || 1;
                const rect = canvas.getBoundingClientRect();

                // Evitar resize infinito si ya está seteado (solo configurar al inicio o resize)
                if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
                    canvas.width = rect.width * dpr;
                    canvas.height = rect.height * dpr;
                    context.scale(dpr, dpr);
                }

                // Estilos por defecto del pincel infantil (redondo y suave)
                context.lineCap = 'round';
                context.lineJoin = 'round';

                setCtx(context);
            }
        }, []);

        // Actualizar el estilo del trazo cuando cambian las props
        useEffect(() => {
            if (ctx) {
                ctx.strokeStyle = color;
                ctx.lineWidth = brushSize;
            }
        }, [color, brushSize, ctx]);

        useImperativeHandle(ref, () => ({
            clearBoard: () => {
                const canvas = canvasRef.current;
                if (!canvas || !ctx) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            },
        }));

        // Obtener coordenadas relativas al canvas (soporta Mouse y Touch a través de PointerEvent)
        const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
            const canvas = canvasRef.current;
            if (!canvas) return { x: 0, y: 0 };
            const rect = canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
            if (!ctx) return;
            const { x, y } = getCoordinates(e);
            ctx.beginPath();
            ctx.moveTo(x, y);
            setIsDrawing(true);

            // Permitir hacer un "punto" sin mover el mouse
            ctx.lineTo(x, y);
            ctx.stroke();

            // Capturar el puntero para que no se interrumpa si el dedo sale unos milímetros del canvas accidentalmente
            (e.target as Element).setPointerCapture(e.pointerId);
        };

        const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
            if (!isDrawing || !ctx) return;
            e.preventDefault(); // Evitar scroll en móviles
            const { x, y } = getCoordinates(e);
            ctx.lineTo(x, y);
            ctx.stroke();
        };

        const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
            if (!isDrawing || !ctx) return;
            ctx.closePath();
            setIsDrawing(false);
            (e.target as Element).releasePointerCapture(e.pointerId);
        };

        return (
            <div className="relative w-full h-[60vh] md:h-[70vh] bg-white rounded-3xl shadow-inner border-4 border-gray-100 overflow-hidden flex items-center justify-center touch-none">
                {/* Guía Visual (Letra de Fondo Difuminada) */}
                <span
                    className={`absolute font-kids text-[15rem] md:text-[25rem] select-none pointer-events-none opacity-30 ${guideColorClass}`}
                    style={{ lineHeight: 1 }}
                >
                    {targetLetter}
                </span>

                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                    // Pointer events unifican Touch y Mouse!
                    onPointerDown={startDrawing}
                    onPointerMove={draw}
                    onPointerUp={stopDrawing}
                    onPointerCancel={stopDrawing}
                    onPointerOut={stopDrawing}
                />
            </div>
        );
    }
);

TracingBoard.displayName = 'TracingBoard';

export default TracingBoard;
