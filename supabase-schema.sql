-- EFootball Lig - Supabase Schema
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE teams (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE players (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  team_id BIGINT REFERENCES teams(id) ON DELETE CASCADE,
  position TEXT DEFAULT '',
  goals INT DEFAULT 0,
  assists INT DEFAULT 0,
  rating DECIMAL(3,1) DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE matches (
  id BIGSERIAL PRIMARY KEY,
  home_team_id BIGINT REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id BIGINT REFERENCES teams(id) ON DELETE CASCADE,
  home_score INT DEFAULT NULL,
  away_score INT DEFAULT NULL,
  week INT DEFAULT 1,
  match_date DATE DEFAULT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE standings (
  id BIGSERIAL PRIMARY KEY,
  team_id BIGINT REFERENCES teams(id) ON DELETE CASCADE UNIQUE,
  played INT DEFAULT 0,
  won INT DEFAULT 0,
  drawn INT DEFAULT 0,
  lost INT DEFAULT 0,
  goals_for INT DEFAULT 0,
  goals_against INT DEFAULT 0,
  goal_diff INT DEFAULT 0,
  points INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  nickname TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE announcements (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read players" ON players FOR SELECT USING (true);
CREATE POLICY "Public read matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read standings" ON standings FOR SELECT USING (true);
CREATE POLICY "Public read messages" ON messages FOR SELECT USING (true);

-- Allow anon insert/update/delete
CREATE POLICY "Anon insert teams" ON teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon update teams" ON teams FOR UPDATE USING (true);
CREATE POLICY "Anon delete teams" ON teams FOR DELETE USING (true);

CREATE POLICY "Anon insert players" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon update players" ON players FOR UPDATE USING (true);
CREATE POLICY "Anon delete players" ON players FOR DELETE USING (true);

CREATE POLICY "Anon insert matches" ON matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon update matches" ON matches FOR UPDATE USING (true);
CREATE POLICY "Anon delete matches" ON matches FOR DELETE USING (true);

CREATE POLICY "Anon insert standings" ON standings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon update standings" ON standings FOR UPDATE USING (true);
CREATE POLICY "Anon delete standings" ON standings FOR DELETE USING (true);

CREATE POLICY "Anon insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon delete messages" ON messages FOR DELETE USING (true);

-- Announcements
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Anon insert announcements" ON announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon delete announcements" ON announcements FOR DELETE USING (true);

-- Enable Realtime for messages (run separately if needed)
-- Go to: Database > Replication > Enable replication for "messages" table
