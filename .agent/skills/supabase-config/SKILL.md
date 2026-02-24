---
name: supabase-config
description: Configuración de Supabase — esquema de base de datos, políticas RLS, clientes browser/server y generación de tipos.
---

# Supabase Config — Leer Jugando

## Objetivo

Configurar el proyecto Supabase con las 4 tablas del modelo de datos, políticas de seguridad RLS, clientes tipados para browser y server, y datos de prueba para desarrollo.

## Tipos — Modelo de Datos

```
auth.users (Supabase Auth)
    └── parents (1:1 via id = auth.uid())
         └── kids (1:N via parent_id)
              ├── progress (1:N via kid_id)
              └── rewards (1:N via kid_id)
```

| Tabla | Campos clave | Relación |
|-------|-------------|----------|
| `parents` | `id` (UUID FK auth.users), `email`, `pin_code` | 1:1 con auth.users |
| `kids` | `parent_id` (FK), `name`, `age` (3-10), `avatar_url` | N:1 con parents |
| `progress` | `kid_id` (FK), `lesson_type`, `lesson_id`, `score` | N:1 con kids |
| `rewards` | `kid_id` (FK), `reward_type`, `reward_name` | N:1 con kids |

## Instrucciones Paso a Paso

### 1. Crear las tablas en Supabase

Ejecutar el DDL en el SQL Editor de Supabase o como migración.

→ Ver referencia: [`schema.sql`](references/schema.sql)

### 2. Configurar RLS (Row Level Security)

Habilitar RLS en las 4 tablas y crear políticas para que cada padre solo acceda a sus propios datos.

→ Ver referencia: [`rls-policies.sql`](references/rls-policies.sql)

### 3. Crear cliente Supabase para Browser (CSR)

Usar `createBrowserClient` de `@supabase/ssr` con tipos generados.

→ Ver referencia: [`client-browser.ts`](references/client-browser.ts)

### 4. Crear cliente Supabase para Server (SSR)

Usar `createServerClient` de `@supabase/ssr` con cookies de Next.js.

→ Ver referencia: [`client-server.ts`](references/client-server.ts)

### 5. Generar tipos TypeScript

```bash
npx supabase gen types typescript --project-id=TU_PROJECT_ID > types/database.types.ts
```

### 6. Insertar seed data para desarrollo

Crear un usuario de prueba en Supabase Auth primero, luego insertar datos de ejemplo.

→ Ver referencia: [`seed-data.sql`](references/seed-data.sql)

## Constraints

- RLS debe estar habilitado en **todas** las tablas antes de ir a producción
- El cliente de server usa `cookies()` de Next.js — es `async`
- `SUPABASE_SERVICE_ROLE_KEY` solo se usa en server, **nunca** en componentes client
- Los tipos se regeneran cada vez que cambia el esquema de BD
- La edad del niño se valida tanto en BD (`CHECK age >= 3 AND age <= 10`) como en Zod (client/server)
