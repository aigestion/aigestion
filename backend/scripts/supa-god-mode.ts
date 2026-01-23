
import { createClient } from '@supabase/supabase-js';
import { env } from '../src/config/env.schema';
import * as fs from 'fs';
import * as path from 'path';

// Manual override for God Mode if env not loaded
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jhvtjyfmgncrrbzqpbkt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'MISSING_SERVICE_ROLE_KEY'; // User provided anon key, but we might need service role for admin tasks.
// Note: Using the ANON key provided for now, but for table creation we typically need SQL editor or Service Role.
// However, the provided key 'sb_publishable...' is likely ANON.
// IF WE CAN'T RUN SQL via Client, we might just output the SQL for the user to run in the Supabase Dashboard SQL Editor.

const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_ANON_KEY || '');

const SCHEMA_SQL = `
-- Enable pgvector for embeddings
create extension if not exists vector;

-- Users Table (Synced with Auth)
create table if not exists public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique,
  full_name text,
  avatar_url text,
  tier text default 'free',
  credits int default 10,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Projects Table
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  description text,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Usage Records Table
create table if not exists public.usage_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  feature text not null,
  amount int not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Documents Table (for Vector Search)
create table if not exists public.documents (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  content text,
  metadata jsonb,
  embedding vector(1536), -- RESTRICTION: Assuming OpenAI 1536 dims
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.users enable row level security;
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

alter table public.projects enable row level security;
create policy "Users can view own projects" on public.projects for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on public.projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on public.projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on public.projects for delete using (auth.uid() = user_id);

alter table public.documents enable row level security;
-- Documents accessible if user owns the linked project
create policy "Users can view project documents" on public.documents for select using (
  exists (select 1 from public.projects where projects.id = documents.project_id and projects.user_id = auth.uid())
);
`;

console.log("----------------------------------------------------------------");
console.log("🌌 SUPABASE GOD MODE SQL SCRIPT 🌌");
console.log("----------------------------------------------------------------");
console.log("Since we are using the Client SDK, we cannot create tables directly unless we use RPC or have the Service Role Key.");
console.log("Please COPY AND PASTE the SQL below into your Supabase Dashboard -> SQL Editor:");
console.log("----------------------------------------------------------------");
console.log(SCHEMA_SQL);
console.log("----------------------------------------------------------------");
