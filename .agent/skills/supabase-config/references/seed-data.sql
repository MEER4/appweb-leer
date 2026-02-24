-- Seed data para desarrollo
-- Ejecutar DESPUÉS de crear un usuario de prueba en Supabase Auth
-- Reemplazar 'UUID_DEL_PADRE' con el UUID real del usuario creado

INSERT INTO parents (id, email, pin_code) VALUES
  ('UUID_DEL_PADRE', 'padre@test.com', '1234');

INSERT INTO kids (parent_id, name, avatar_url, age) VALUES
  ('UUID_DEL_PADRE', 'Sofía', '/avatars/unicorn.png', 4),
  ('UUID_DEL_PADRE', 'Mateo', '/avatars/dino.png', 5);

-- Progreso de ejemplo
INSERT INTO progress (kid_id, lesson_type, lesson_id, score) VALUES
  ((SELECT id FROM kids WHERE name = 'Sofía' LIMIT 1), 'phonetics', 'phonics-001', 85),
  ((SELECT id FROM kids WHERE name = 'Sofía' LIMIT 1), 'phonetics', 'phonics-002', 92),
  ((SELECT id FROM kids WHERE name = 'Mateo' LIMIT 1), 'story', 'story-001', 100);

-- Recompensa de ejemplo
INSERT INTO rewards (kid_id, reward_type, reward_name) VALUES
  ((SELECT id FROM kids WHERE name = 'Sofía' LIMIT 1), 'badge', 'Primera Lección');
