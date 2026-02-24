---
name: auth-security
description: Flujo de autenticación con Supabase Auth, sistema de PIN parental, middleware de protección de rutas y headers de seguridad.
---

# Auth & Security — Leer Jugando

## Objetivo

Garantizar que solo usuarios autenticados accedan a la app, y que los niños no puedan salir de su entorno seguro hacia configuraciones de la cuenta.

## Tipos de Acceso

| Nivel | Rutas | Requisito | Acción si falla |
|-------|-------|-----------|-----------------|
| **Público** | `/`, `/login`, `/register`, `/about` | Ninguno | N/A |
| **Sesión** | `/kids/*` (`/play`, `/rewards`) | JWT válido (Supabase Auth) | Redirect a `/login` |
| **Sesión + PIN** | `/parent/*` (`/dashboard`, `/settings`)| JWT válido + PIN de 4 dígitos | Muestra modal de PIN |

## Instrucciones Paso a Paso

### 1. Configurar Middleware de Next.js

Crear el middleware en la raíz del proyecto para interceptar peticiones, refrescar la sesión JWT y redirigir según el estado de autenticación.

→ Ver referencia: [`middleware.ts`](references/middleware.ts)

### 2. Implementar esquemas de validación Zod

Validar inputs de registro y verificación de PIN tanto en el cliente como en Server Actions.

→ Ver referencia: [`auth-schemas.ts`](references/auth-schemas.ts)

### 3. Implementar Flujo de Registro/Login

1. **Registro:** Recolectar email, password y PIN. Llamar `supabase.auth.signUp()`. Si tiene éxito, insertar en la tabla `parents` el `user.id` y el `pin` (cifrado o hasheado idealmente).
2. **Login:** Recolectar email y password. Llamar `supabase.auth.signInWithPassword()`. Redirigir a `/play`.

### 4. Implementar Sistema de PIN Parental

- **Verificación:** Un `PinGate` que envuelve las páginas bajo `/parent/*`.
- **UI:** No usar input de texto. Usar un teclado numérico visual en pantalla.
- **Sesión Temporal:** Almacenar `pin_verified=true` en `sessionStorage` (caduca al cerrar pestaña).
- **Bloqueo:** Tras 3 intentos fallidos, bloquear la UI del PIN por 30 segundos con un contador visible.

### 5. Proteger UX de la Zona Infantil

Deshabilitar comportamientos nativos del navegador que podrían interrumpir el juego (clic derecho, selección de texto, drag nativo de imágenes).

→ Ver referencia: [`kids-zone-protection.tsx`](references/kids-zone-protection.tsx)

### 6. Implementar Logout

Un botón visible SOLO en el dashboard parental. Llama a `supabase.auth.signOut()`, limpia `sessionStorage` y redirige a `/`.

## Constraints

- El Middleware **debe** ejecutarse en Edge y usar el cliente Supabase configurado para SSR.
- El PIN numérico debe tener longitud exacta de 4.
- Las contraseñas en registro requieren validación robusta y campo de confirmación.
- Nunca mostrar el botón de Logout en la zona `/kids`.
