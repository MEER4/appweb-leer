-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Padres (vinculada a Supabase Auth)
CREATE TABLE parents (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  pin_code VARCHAR(4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Niños (perfiles dependientes)
CREATE TABLE kids (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  parent_id UUID REFERENCES parents(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  age INTEGER CHECK (age >= 3 AND age <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_kids_parent_id ON kids(parent_id);

-- Tabla de Progreso
CREATE TABLE progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  kid_id UUID REFERENCES kids(id) ON DELETE CASCADE NOT NULL,
  lesson_type VARCHAR(50) NOT NULL,
  lesson_id VARCHAR(50) NOT NULL,
  score INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_progress_kid_id ON progress(kid_id);

-- Tabla de Recompensas
CREATE TABLE rewards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  kid_id UUID REFERENCES kids(id) ON DELETE CASCADE NOT NULL,
  reward_type VARCHAR(50) NOT NULL,
  reward_name TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
