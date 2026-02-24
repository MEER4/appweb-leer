// lib/utils.ts — Utilidades base
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind de forma segura.
 * Usa clsx para condicionales y twMerge para evitar conflictos.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
