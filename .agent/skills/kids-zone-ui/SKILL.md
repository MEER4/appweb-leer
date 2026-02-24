---
name: kids-zone-ui
description: Convenciones de interfaz para la zona infantil — layout simplificado, navegación, protección UX, botones masivos y estados visuales.
---

# Kids Zone UI — Leer Jugando

## Objetivo

Crear un entorno seguro, libre de distracciones y adaptado a las capacidades motoras de niños de 3 a 6 años. La navegación debe ser lineal y visual.

## Tipos de Componentes Especializados

| Componente | Descripción | Uso Principal |
|------------|-------------|---------------|
| `KidButton` | Botón masivo (min 64x64) con animación hover/tap | Acciones en juegos, avanzar niveles |
| `KidNavbar` | Navbar superior minimalista | Home, Álbum, Acceso Parental (protegido) |
| `GameCard` | Tarjeta grande para escoger un juego/cuento | Menú principal de actividades |

## Instrucciones Paso a Paso

### 1. Construir Componentes Base

- Implementar `KidButton` combinando Framer Motion con Tailwind para estados táctiles y sombras.
- Todo texto dentro de estos componentes debe usar `font-kids` (`Fredoka One`) en tamaños a partir de `24px`.

→ Ver referencia: [`kid-button.tsx`](references/kid-button.tsx)

### 2. Integrar Feedback Sonoro

- Ubicar efectos de sonido cortos en `public/sounds/` (`correct.mp3`, `wrong.mp3`, etc.).
- Usar un helper para invocarlos sin interrumpir el UI thread.

→ Ver referencia: [`sound-helper.ts`](references/sound-helper.ts)

### 3. Implementar Layout Principal Infantil

```
┌─────────────────────────────────────────┐
│  [🏠 Home]            [🎒 Álbum]        │  ← KidNavbar
│                                         │
│    ┌──────────┐    ┌──────────┐         │
│    │  Letras  │    │  Cuentos │         │  ← GameCards
│    └──────────┘    └──────────┘         │
│                                         │
│               [⭐ Premios]               │
└─────────────────────────────────────────┘
```

Incluir el manejador de eventos `onContextMenu={e=>e.preventDefault()}` en el `layout.tsx` (Ver skill *auth-security*).

### 4. Manejar Estados Visuales

- **Loading:** Cargar y reproducir una animación de "mascota corriendo" (ej. Lottie o Framer Motion simple).
- **Éxito Nivel:** Explosión visual (confeti u onda expansiva) usando un `div` absoluto superpuesto, junto con el sonido de celebración.
- **Error Actividad:** Feedback no punitivo. Un ligero sacudón (shake anmation) y sonido de rebote (`wrong.mp3`), devolviendo los elementos a su posición original.

## Constraints

- **Tamaño Mínimo Táctil:** 64x64px absolutos para cualquier elemento clickeable. Recomendado `80x80px`.
- **Sin scroll complejo:** Preferir paginación con flechas gigantes antes que scroll infinito o barras de scroll finas.
- **Sin menús desplegables (dropdowns):** Todo debe ser inmediatamente visible.
- **Audio:** Controlar siempre el volumen general para no asustar (default sugerido 50%).
