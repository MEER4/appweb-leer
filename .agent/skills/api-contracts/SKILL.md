---
name: api-contracts
description: Contratos de API y Server Actions — endpoints, validación Zod, tipos de request/response y manejo de errores.
---

# API Contracts — Leer Jugando

## Objetivo

Centralizar la interacción de datos en Server Actions Next.js 14, proporcionando tipado fuerte End-to-End, manejo estandarizado de excepciones (safe pattern), y validación con `Zod`.

## Tipos e Interfaces

| Acción / Endpoint | Return Type | Propósito |
|-------------------|-------------|-----------|
| `saveProgress` | `SaveProgressResponse` | Registrar un nivel completado (retorna posible recompensa) |
| `getDashboardStats` | `DashboardStatsResponse` | Consumido en `/parent/*` para pintar UI |
| `verifyPin` | `{ valid: boolean }` | Interfaz segura para login/pin gate |
| `createKidProfile` | Perfil `kids` Db | Flujo onboarding |

### Patrón `safeAction`

La aplicación debe devolver siempre promesas sin rechazos inmanejables, transformándolos en objetos `{ data, error }`.

→ Ver referencia: [`safe-action-helper.ts`](references/safe-action-helper.ts)

## Instrucciones Paso a Paso

### 1. Desarrollar Actions de Gamificación (Progress)

Utilizar Zod schema para proteger el ID y el Score de inyecciones antes de mandarlo a Supabase.
El endpoint verificará el *Unlock* de stickers (acoplamiento al Rewards System).

→ Ver referencia: [`save-progress.ts`](references/save-progress.ts)

### 2. Implementar Gestores Autenticación / Parent (Stats, PIN)

- `DashboardStats` agregará data agrupada (`gte` / `since` date).
- `verifyPin` asegurará `auth.getUser()` antes de mirar la tabla parents.
(El código de Stats se referencia en el skill de `parent-dashboard`).

### 3. Sistema Offline-first Básico

La retención requiere persistencia de juego frente a caídas WIFI infantiles.

Las funciones guardan un array serializado temporal en localStorage. Cuando se lanza `window-online`, iteran y flush contra el server Action original.

→ Ver referencia: [`offline-queue.ts`](references/offline-queue.ts)

### 4. Endpoints REST Clásicos (Opcional)

Solo codificar en `app/api/.../route.ts` cuando un agente externo, webhook, app Flutter/React Native, o cronjob lo requiera. (Usar la misma estructura de validación Zod).

## Constraints

- Server Actions NO deben fiarse del payload frontend. **Siempre validar con Zod** en la primera línea.
- Errores base de datos nunca se leakean tal cual al cliente. Se envuelven en el helper `safeAction`.
- Importar `z` directamente donde se declare el Schema, sin ensuciar la action de dependencias UI.
