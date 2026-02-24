---
name: parent-dashboard
description: Dashboard parental — métricas de progreso, gráficas de uso, PIN gate, configuración y Server Actions para datos.
---

# Parent Dashboard — Leer Jugando

## Objetivo

Proveer a los padres de un resumen seguro y visual sobre el uso de la aplicación y progreso de los niños, incluyendo herramientas de configuración y gestión de perfiles.

## Tipos e Interfaces

| Componente Clave | Función |
|------------------|---------|
| `PinGate` | Interceptor global para las rutas `/parent/*`. Verifica status en session y despliega modal. |
| `DashboardStats` | Data view con métricas (lecciones / 7 días, lista recientes, premios). |
| `kidProfileSchema` | Schema Zod de validación (edad 3-10, campos obligatorios). |

## Instrucciones Paso a Paso

### 1. Control de Acceso (PinGate)

Integrar un HOC React global para las rutas `/parent/layout.tsx`. Mostrará el dashboard SÓLO si `sessionStorage.getItem('pin_verified') === 'true'`.

→ Ver referencia: [`pin-gate.tsx`](references/pin-gate.tsx)

### 2. Generación de Métricas

Usar Server Actions que lean de Supabase. Obtener historial en rango de 7 días, contador total de lecciones, recompensas recibidas, y cálculo de minutos (basado en lecciones x tiempo estimad).

→ Ver referencia: [`dashboard-actions.ts`](references/dashboard-actions.ts)

### 3. Layout del Dashboard Parental

Diseño sobrio con fuente `parent`:
- **Superior:** 4 cards resumen (Tiempo total, Lecciones, Recompensas, Racha días).
- **Medio:** Gráfico de uso en los últimos 7 días.
- **Inferior:** Lista vertical de lecciones recientes (nombre, rating, "hace 2h").

### 4. Componente Settings

- Sección **Gestión de Perfiles**: Formulario CRUD basado en perfiles en tabla `kids`.
- Validación conectada con Zod para creación de nuevo perfil.

→ Ver referencia: [`kid-profile-schema.ts`](references/kid-profile-schema.ts)

## Constraints

- La UI de `/parent` NUNCA debe incluir animaciones distraídas (tipo niños) o fuentes de palo gordo infantil. Usa paleta secundaria más neutra/desaturada.
- Validar `kidProfileSchema` tanto frontend forma asíncrona (hook-form), como backend en Action antes del INSERT `Supabase`.
- El teclado del PIN nunca revelará los números en pantalla a un third-party observador (como `type="password"` visual por botonera táctil virtual).
