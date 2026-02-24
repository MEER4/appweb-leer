---
name: phonetics-game
description: Minijuego de fonética — mecánica de drag & drop con Framer Motion, feedback visual/sonoro, registro de progreso y lógica de puntuación.
---

# Phonetics Game — Leer Jugando

## Objetivo

Implementar un minijuego interactivo donde los niños arrastren letras para completar palabras o sílabas, proveyendo feedback inmediato sonoro y visual por cada acción, registrando el resultado final.

## Tipos e Interfaces Básicas

- `PhonicsLesson`: Estructura base de una lección (objetivo, nivel, pistas disponibles).
- `GameScore`: Estado temporal del nivel en curso (aciertos a la primera, tiempo invertido).

→ Ver referencia: [`game-types.ts`](references/game-types.ts)

## Instrucciones Paso a Paso

### 1. Construir las letras arrastrables

Usar `framer-motion` para que cada letra tenga propiedades `drag`, `dragSnapToOrigin`, etc.

→ Ver referencia: [`draggable-letter.tsx`](references/draggable-letter.tsx)

### 2. Construir los huecos receptores (Slots)

Componente que cambia su color de fondo a `success` (verde) si recibe la letra correcta, o a `error` (rojo momentáneo) si es incorrecta.

→ Ver referencia: [`letter-slot.tsx`](references/letter-slot.tsx)

### 3. Lógica de Colisión (Drag & Drop)

- Calcular la posición (`getBoundingClientRect`) del `slot` frente al `pointer` del `dragEnd`.
- Si coinciden y es correcto: encajar en fondo, color `success` y play de sonido de acierto.
- Si coinciden y es incorrecto: flash del `slot` en `error`, la letra regresa (`dragSnapToOrigin`) y play de sonido de rebote.

### 4. Lógica de Puntuación (Estrellas)

```typescript
function calculateStars(score: GameScore): 1 | 2 | 3 {
  const accuracy = score.correctOnFirstTry / score.totalSlots;
  // Perfecto y rápido (<30s) -> 3 estrellas
  // Bueno (>70% certidumbre) -> 2 estrellas
  // Pasó el nivel (a prueba de fallos) -> 1 estrella
}
```

### 5. Guardado de Progreso

1. Al completar todos los slots de la `PhonicsLesson`.
2. Mostrar animación de celebración inmediata al nivel local.
3. Llamar Server Action `saveProgress()` en background (ver `api-contracts`).
4. Si la Action responde `rewardUnlocked: true`, trigger de `RewardUnlockAnimation` (ver skill *rewards-system*).

## Constraints

- Los slots NUNCA devuelven un error permanente: se agita en rojo temporalmente (200ms) y vuelve a estado de espera gris, porque la frustración infantil debe minimizarse.
- El drag en móviles puede causar scroll no deseado. `framer-motion` lo suele prevenir en drag elements, pero revisar el bloqueo en `body` o layout general.
- Evitar demoras. El feedback al drop debe ser de menos de 50ms para mantener el loop inmersivo del infante.
