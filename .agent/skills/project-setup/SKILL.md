---
name: project-setup
description: Instrucciones para inicializar el proyecto Next.js con App Router, Tailwind CSS, Supabase y todas las dependencias necesarias.
---

# Project Setup — Leer Jugando

## Objetivo

Inicializar el proyecto Next.js con todas las dependencias, estructura de carpetas, fuentes, utilidades y configuración de seguridad necesarias para comenzar a implementar la aplicación.

## Tipos de Dependencias

| Categoría | Paquetes |
|-----------|----------|
| **Core** | `@supabase/supabase-js`, `@supabase/ssr` |
| **UI** | `framer-motion`, `lucide-react` |
| **Validación** | `zod` |
| **Utilidades** | `clsx`, `tailwind-merge` |

## Instrucciones Paso a Paso

### 1. Inicializar Next.js

```bash
npx create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

> Usar `./` para instalar en el directorio actual. No crear subcarpeta.

### 2. Instalar dependencias

```bash
npm install @supabase/supabase-js @supabase/ssr framer-motion lucide-react zod
npm install clsx tailwind-merge
```

### 3. Crear estructura de carpetas

```
app/
├── (auth)/login/page.tsx
├── (auth)/register/page.tsx
├── (kids)/play/page.tsx
├── (kids)/rewards/page.tsx
├── parent/dashboard/page.tsx
├── parent/settings/page.tsx
├── api/progress/route.ts
├── layout.tsx
└── page.tsx
components/ui/
components/games/
components/layout/
lib/supabase/client.ts
lib/supabase/server.ts
lib/utils.ts
types/database.types.ts
middleware.ts
```

### 4. Configurar root layout con Google Fonts

Importar `Fredoka` (zona niño) y `Nunito` (zona padre) como variables CSS.

→ Ver referencia: [`root-layout.tsx`](references/root-layout.tsx)

### 5. Crear utilidad cn()

Helper para combinar clases de Tailwind de forma segura.

→ Ver referencia: [`utils.ts`](references/utils.ts)

### 6. Configurar variables de entorno

Crear `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu_clave_publica"
SUPABASE_SERVICE_ROLE_KEY="tu_clave_secreta"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 7. Configurar headers de seguridad

→ Ver referencia: [`next-config.js`](references/next-config.js)

### 8. Agregar script de generación de tipos

En `package.json`, agregar:
```json
"types:supabase": "npx supabase gen types typescript --project-id=TU_PROJECT_ID > types/database.types.ts"
```

## Constraints

- **NUNCA** exponer `SUPABASE_SERVICE_ROLE_KEY` al cliente
- Usar `./` en create-next-app para instalar en directorio actual
- Las fuentes se importan via `next/font/google` (no CDN externo)
- El flag `--app` es obligatorio (App Router, no Pages Router)
