-- 001_blog_interactions.sql

create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  avatar_url text,
  provider text,
  created_at timestamptz default now()
);

create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  post_slug text not null,
  user_id uuid references public.users(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null check (char_length(body) > 0 and char_length(body) < 2000),
  is_approved boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.likes (
  id uuid default gen_random_uuid() primary key,
  post_slug text not null,
  user_id uuid references public.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique(post_slug, user_id)
);

-- Indexes
create index if not exists comments_post_slug_idx on public.comments(post_slug);
create index if not exists comments_parent_id_idx on public.comments(parent_id);
create index if not exists likes_post_slug_idx on public.likes(post_slug);

-- RLS Policies
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.users enable row level security;

-- Policies for public.users
create policy "Anyone can read user profiles"
  on public.users for select using (true);

create policy "Users can update their own profile"
  on public.users for update using (auth.uid() = id);

-- Policies for public.comments
create policy "Anyone can read approved comments"
  on public.comments for select using (is_approved = true);

create policy "Authenticated users can insert comments"
  on public.comments for insert with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.comments for delete using (auth.uid() = user_id);

-- Policies for public.likes
create policy "Anyone can read likes"
  on public.likes for select using (true);

create policy "Authenticated users can toggle likes"
  on public.likes for insert with check (auth.uid() = user_id);

create policy "Users can remove own like"
  on public.likes for delete using (auth.uid() = user_id);

-- Trigger: auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, avatar_url, provider)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_app_meta_data->>'provider'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
