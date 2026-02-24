---
name: rewards-system
description: Sistema de recompensas — desbloqueo de stickers/insignias, álbum visual, animaciones de celebración y lógica de triggers.
---

# Rewards System — Leer Jugando

## Objetivo

Implementar un sistema de recompensas (stickers, insignias, personajes) que se desbloquean automáticamente al cumplir hitos de progreso. Incluye un álbum visual donde el niño colecciona sus logros y animaciones de celebración al desbloquear.

## Tipos

| Tipo | Display | Trigger |
|------|---------|---------|
| `badge` | Insignia | Completar X lecciones totales |
| `sticker` | Pegatina | 3 estrellas en una lección específica |
| `character` | Personaje | Hitos especiales (ej: 20 lecciones) |

### Tabla `rewards` en Supabase

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `kid_id` | UUID FK | Referencia a `kids.id` |
| `reward_type` | VARCHAR(50) | `badge`, `sticker`, `character` |
| `reward_name` | TEXT | Nombre visible |
| `unlocked_at` | TIMESTAMPTZ | Fecha de desbloqueo |

## Instrucciones Paso a Paso

### 1. Definir el catálogo de recompensas

Crear un archivo constante con todas las recompensas disponibles y sus condiciones de desbloqueo.

→ Ver referencia: [`rewards-catalog.ts`](references/rewards-catalog.ts)

### 2. Implementar lógica de desbloqueo (server-side)

Crear un Server Action que se ejecute después de cada `saveProgress`. Debe:
1. Contar las lecciones completadas del niño
2. Obtener las recompensas ya desbloqueadas
3. Comparar contra el catálogo
4. Si hay match → insertar en tabla `rewards` → retornar la recompensa al cliente

→ Ver referencia: [`unlock-logic.ts`](references/unlock-logic.ts)

### 3. Implementar animación de desbloqueo

Secuencia visual cuando se desbloquea una recompensa:
1. Overlay oscuro (fade-in)
2. Cofre aparece con spring bounce (`scale: 0→1`, `rotate: -180→0`)
3. Icono de la recompensa sale del cofre
4. Nombre aparece con fade-in
5. Botón "¡Genial!" cierra el modal

→ Ver referencia: [`animation-sequence.tsx`](references/animation-sequence.tsx)

### 4. Construir el Álbum de Recompensas (`/rewards`)

- Grid de 3 columnas (tablet) / 2 columnas (mobile)
- Recompensas desbloqueadas: con gradiente colorido, animación hover, emoji/imagen
- Recompensas bloqueadas: silueta gris con `?`
- Tap en desbloqueada → modal con nombre, fecha, descripción

→ Ver referencia: [`album-components.tsx`](references/album-components.tsx)

### 5. Integrar con el flujo de juego

1. Al completar un nivel → `saveProgress()` retorna `rewardUnlocked`
2. Si `rewardUnlocked !== null` → mostrar `RewardUnlockAnimation`
3. Al cerrar la animación → navegar al siguiente nivel o al álbum

### 6. Mostrar progreso de recompensas en el Hub

En la pantalla principal de juegos, mostrar:
- Barra de progreso: "X de Y recompensas"
- Total de estrellas acumuladas
- Indicador visual del próximo hito

## Constraints

- Los sonidos de celebración deben ser cortos (< 2s) y no asustadizos
- La verificación de desbloqueo SIEMPRE ocurre en el servidor (nunca en el cliente)
- RLS de Supabase garantiza que solo el padre dueño pueda leer/escribir recompensas
- Las imágenes/iconos de recompensas se almacenan en Supabase Storage (o como emojis en MVP)
- El álbum se carga con los datos reales de la tabla `rewards` filtrados por `kid_id`
- La animación de desbloqueo usa `AnimatePresence` de Framer Motion para entradas/salidas limpias
