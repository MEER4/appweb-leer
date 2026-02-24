---
name: design-system
description: Sistema de diseño completo para Leer Jugando — paleta de colores, tipografía, espaciado, responsive y convenciones visuales.
---

# Design System — Leer Jugando

## Objetivo

Definir las convenciones visuales de la aplicación para mantener consistencia entre la zona infantil y la zona parental. Toda la UI debe sentirse divertida, colorida y segura.

## Tipos de Zonas

| Zona | Ruta | Fuente | Tono |
|------|------|--------|------|
| **Infantil** | `/kids/*` | `font-kids` (Fredoka One / Balsamiq Sans) | Vibrante, masivo, redondeado |
| **Parental** | `/parent/*` | `font-parent` (Nunito / Inter) | Limpio, legible, profesional |
| **Pública** | `/`, `/login`, `/register` | `font-parent` | Informativo, acogedor |

## Instrucciones Paso a Paso

### 1. Configurar la paleta de colores en Tailwind

| Token | Hex | Uso |
|-------|-----|-----|
| `primary` | `#FFD166` | Acciones, CTAs, botones principales |
| `secondary` | `#118AB2` | Fondos, navegación, cuentos |
| `success` | `#06D6A0` | Respuestas correctas, validaciones OK |
| `error` | `#EF476F` | Respuestas incorrectas, alertas |
| `dark` | `#073B4C` | Texto principal |
| `bg-kids` | `#E8F8F5` | Fondo zona infantil |

→ Ver referencia: [`tailwind-config.ts`](references/tailwind-config.ts)

### 2. Configurar tipografía

**Zona Infantil:**
- h1: `3rem` (48px) — títulos de juegos
- h2: `2.5rem` (40px) — subtítulos
- Body: `1.5rem` (24px) — instrucciones
- Peso grueso, siempre legible

**Zona Parental:**
- h1: `2rem` (32px)
- h2: `1.5rem` (24px)
- Body: `1rem` (16px)
- Labels: `0.875rem` (14px)

### 3. Aplicar sistema de espaciado

- Base: **8px**
- Escala: `4px`, `8px`, `16px`, `24px`, `32px`, `48px`, `64px`
- Grid: **12 columnas**
- Hitbox mínimo en zona infantil: **64×64px**

### 4. Aplicar bordes redondeados

| Elemento | Valor |
|----------|-------|
| Botones | `rounded-2xl` (16px) o `rounded-full` |
| Cards | `rounded-3xl` (24px) |
| Inputs | `rounded-xl` (12px) |
| Avatares | `rounded-full` |

Nunca usar esquinas afiladas. Sombras suaves y coloridas (evitar grises puros).

### 5. Implementar responsive Tablet-First

| Breakpoint | Rango | Enfoque |
|------------|-------|---------|
| Mobile | `< 768px` | Stack vertical simplificado |
| **Tablet** | `768–1024px` | **Entorno óptimo de juego** (landscape) |
| Desktop | `> 1024px` | Centrado con max-width |

### 6. Definir estados de UI

| Estado | Zona Niño | Zona Padre |
|--------|-----------|------------|
| Loading | Mascota animada corriendo | Skeleton + spinner |
| Empty | Siluetas grises con `?` | Mensaje + CTA |
| Error | Mascota triste + reintentar | Alert descriptivo |
| Éxito | Confeti + sonido | Check verde + toast |

## Constraints

- **Alto contraste** siempre — accesibilidad para niños
- **Nunca estilo corporativo** — tono divertido y lúdico
- **Animaciones con Framer Motion** — entradas, salidas, hover, drag
- Las sombras deben ser **coloridas** (ej: shadow con tinte de primary), no grises planos
- Todos los elementos interactivos en zona niño: mínimo `64×64px`
