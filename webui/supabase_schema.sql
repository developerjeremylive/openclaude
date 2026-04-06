-- Tabla de livechats
CREATE TABLE livechats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Nuevo Chat',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Mensajes
CREATE TABLE livemessages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID REFERENCES livechats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant', 'system', 'tool')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE livechats ENABLE ROW LEVEL SECURITY;
ALTER TABLE livemessages ENABLE ROW LEVEL SECURITY;

-- Políticas para livechats
CREATE POLICY "Users can view their own livechats" ON livechats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own livechats" ON livechats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own livechats" ON livechats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own livechats" ON livechats
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para Mensajes
CREATE POLICY "Users can view livemessages of their livechats" ON livemessages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert livemessages into their livechats" ON livemessages
  FOR INSERT WITH CHECK (auth.uid() = user_id);
