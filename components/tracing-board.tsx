'use client';

import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';

export type TracingBoardRef = {
    clearBoard: () => void;
    validateTrace: () => boolean;
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
            validateTrace: () => {
                const canvas = canvasRef.current;
                if (!canvas || !ctx) return false;

                // 1. Crear un canvas offscreen perfecto
                const offscreen = document.createElement('canvas');
                offscreen.width = canvas.width;
                offscreen.height = canvas.height;
                const offCtx = offscreen.getContext('2d');
                if (!offCtx) return false;

                const dpr = window.devicePixelRatio || 1;
                // Escalar el contexto igual que el original
                offCtx.scale(dpr, dpr);

                // Dibujar la letra perfecta en el centro tal como está en el CSS
                const rect = canvas.getBoundingClientRect();

                // Estos valores de fuente deben coincidir con Tailwind "font-kids text-[15rem] md:text-[25rem]"
                // Aproximación: text-[25rem] es 400px en Desktop. Necesitamos calcular basado en view.
                const fontSize = window.innerWidth >= 768 ? 400 : 240;
                offCtx.font = `${fontSize}px 'Fredoka', 'Comic Sans MS', cursive`; // Asumiendo font-kids
                offCtx.textAlign = 'center';
                offCtx.textBaseline = 'middle';
                offCtx.fillStyle = '#000000'; // Color sólido para extraer pixeles más fácil

                // Dibujar en el centro
                offCtx.fillText(targetLetter, rect.width / 2, rect.height / 2);

                // 2. Extraer los datos de píxeles
                const perfectData = offCtx.getImageData(0, 0, canvas.width, canvas.height).data;
                const userData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

                // 3. Comparar
                let perfectPixels = 0;
                let userPixels = 0;
                let overlappingPixels = 0;

                // Los datos de la imagen vienen en un array plano unidimensional de RGBA: [r, g, b, a, r, g, b, a, ...]
                for (let i = 0; i < perfectData.length; i += 4) {
                    const isPerfectPixel = perfectData[i + 3] > 0; // Alpha > 0
                    const isUserPixel = userData[i + 3] > 0;

                    if (isPerfectPixel) perfectPixels++;
                    if (isUserPixel) userPixels++;

                    if (isPerfectPixel && isUserPixel) {
                        overlappingPixels++;
                    }
                }

                // Cálculo de métricas
                if (perfectPixels === 0) return true; // Fallback si no hay font

                // a) ¿Qué tanto de la letra perfecta cubrió el usuario?
                const coverage = overlappingPixels / perfectPixels;

                // b) De TODO lo que rayó el usuario, ¿qué tanto cayó DENTRO de la letra? (Precisión)
                // Evita que simplemente pinten toda la pantalla como una brocha gigante
                const accuracy = userPixels > 0 ? overlappingPixels / userPixels : 0;

                console.log(`Trace Validation -> Coverage: ${(coverage * 100).toFixed(1)}%, Accuracy: ${(accuracy * 100).toFixed(1)}%`);

                // Umbrales tolerantes para niños
                // Debe cubrir al menos el 25% de la letra y su trazo debe ser al menos 30% preciso
                return coverage > 0.25 && accuracy > 0.30;
            }
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
