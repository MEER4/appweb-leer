-- Habilitar RLS en todas las tablas
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE kids ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

-- Parents: solo el propio padre puede leer/escribir su registro
CREATE POLICY "parents_own_data" ON parents
  FOR ALL USING (auth.uid() = id);

-- Kids: padre solo ve/modifica a sus propios hijos
CREATE POLICY "kids_parent_access" ON kids
  FOR ALL USING (parent_id = auth.uid());

-- Progress: acceso via kid → parent ownership
CREATE POLICY "progress_parent_access" ON progress
  FOR ALL USING (
    kid_id IN (SELECT id FROM kids WHERE parent_id = auth.uid())
  );

-- Rewards: acceso via kid → parent ownership
CREATE POLICY "rewards_parent_access" ON rewards
  FOR ALL USING (
    kid_id IN (SELECT id FROM kids WHERE parent_id = auth.uid())
  );
