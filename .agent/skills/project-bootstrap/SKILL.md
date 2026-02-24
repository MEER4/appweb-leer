---
name: project-bootstrap
description: Orquestador maestro. Se activa con "iniciar proyecto" o "setup inicial". Ejecuta todas las skills del proyecto Leer Jugando en el orden correcto.
---

# Project Bootstrap — Leer Jugando

## Objetivo

Actuar como el plan de vuelo (master playbook) para inicializar y construir la aplicación completa desde cero, llamando a las otras skills en el orden de dependencias correcto.

## Instrucciones Paso a Paso (Orden de Ejecución)

Al activarse esta skill, debes proponer al usuario ejecutar las siguientes fases de implementación, guiándolo paso a paso y utilizando las skills referenciadas en cada fase:

### Fase 1: Infraestructura Base
1. **Proyecto y Dependencias:** Ejecuta la skill -> **`project-setup`**
   - *Hito:* Next.js corriendo, Tailwind limpio, carpetas base creadas.
2. **Sistema de Diseño:** Ejecuta la skill -> **`design-system`**
   - *Hito:* Tailwind.config configurado, colores, fuentes base establecidas.

### Fase 2: Datos y Autenticación
3. **Base de Datos:** Ejecuta la skill -> **`supabase-config`**
   - *Hito:* Tablas creadas, RLS configurado, tipos generados, clientes SSR listos.
4. **Seguridad General:** Ejecuta la skill -> **`auth-security`**
   - *Hito:* Middleware funcionando, UI de Login/Registro para padres.

### Fase 3: Core Logic (Backend)
5. **Contratos y Acciones:** Ejecuta la skill -> **`api-contracts`**
   - *Hito:* Server actions para progreso, métricas de stats y helper de errores seguros y validados listos.

### Fase 4: Experiencia Infantil
6. **UI Base de Niños:** Ejecuta la skill -> **`kids-zone-ui`**
   - *Hito:* Layout bloqueado, KidButton y navegación de niños.
7. **Juego de Fonética:** Ejecuta la skill -> **`phonetics-game`**
   - *Hito:* Drag & drop funcionando y guardando puntuación a Supabase.
8. **Sistema de Recompensas:** Ejecuta la skill -> **`rewards-system`**
   - *Hito:* Stickers desbloqueando, modales de felicitación y álbum configurado.

### Fase 5: Entorno Parental
9. **Dashboard de Padres:** Ejecuta la skill -> **`parent-dashboard`**
   - *Hito:* PIN lock en frontend, stats de minijuegos mostrados en dashboard.

## Constraints

- No comiences una fase nueva hasta que la anterior esté completa, verificada sin errores y el usuario haya dado el Ok.
- Para cada skill mencionada, debes leer el archivo `SKILL.md` correspondiente y su carpeta `references/` para obtener los snippets de código exactos.
- Tras cada Hito completado, muestra al usuario brevemente qué lograste y pregúntale: *"¿Continuamos con [Nombre de la siguiente etapa]?"*
