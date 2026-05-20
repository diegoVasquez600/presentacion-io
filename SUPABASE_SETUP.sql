-- SQL para crear tablas en Supabase
-- Ejecuta esto en el SQL Editor de tu proyecto Supabase

-- Tabla de sesiones de juego
create table if not exists game_sessions (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  started_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Tabla de intentos (scores)
create table if not exists game_attempts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid,  -- nullable, can be null for individual submissions
  player_name text not null,
  score integer not null,
  hits integer not null,
  false_positives integer not null,
  missed integer not null,
  hints_used integer not null,
  visited_pct integer not null,
  marked_nodes text[], -- array de IDs de nodos marcados
  created_at timestamp with time zone default now()
);

-- Índices para queries rápidas
create index if not exists idx_game_attempts_score on game_attempts(score desc);
create index if not exists idx_game_attempts_player_name on game_attempts(player_name);
create index if not exists idx_game_attempts_created_at on game_attempts(created_at desc);

-- Habilitar RLS (Row Level Security)
alter table game_sessions enable row level security;
alter table game_attempts enable row level security;

-- Políticas para permitir insert/select a cualquiera (para demo/sustentación)
-- NOTA: En producción, configura políticas más restrictivas
create policy "Allow public insert on game_sessions" 
  on game_sessions for insert with check (true);

create policy "Allow public select on game_sessions" 
  on game_sessions for select using (true);

create policy "Allow public insert on game_attempts" 
  on game_attempts for insert with check (true);

create policy "Allow public select on game_attempts" 
  on game_attempts for select using (true);

-- Habilitar realtime para game_attempts
alter publication supabase_realtime add table game_attempts;
