-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  phone text,
  verified boolean default false,
  profile_picture_url text,
  location text,
  active_ads integer default 0,
  rating numeric default 0,
  sold integer default 0,
  member_since timestamp default now(),
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create RLS policies for profiles
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can delete their own profile" on public.profiles for delete using (auth.uid() = id);
create policy "Public can view verified profiles" on public.profiles for select using (verified = true);

-- Create function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, verified, member_since)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.email::text),
    new.email,
    false,
    now()
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Create trigger for auto-create profile
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create listings table for storing user advertisements
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text,
  subcategory text,
  price numeric,
  price_type text,
  location text,
  phone text,
  whatsapp text,
  images text[] default '{}',
  specs jsonb,
  is_featured boolean default false,
  featured_days integer default 0,
  views integer default 0,
  likes integer default 0,
  shares integer default 0,
  tags text[] default '{}',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Enable RLS on listings
alter table public.listings enable row level security;

-- Create RLS policies for listings
create policy "Users can view all listings" on public.listings for select using (true);
create policy "Users can create their own listings" on public.listings for insert with check (auth.uid() = user_id);
create policy "Users can update their own listings" on public.listings for update using (auth.uid() = user_id);
create policy "Users can delete their own listings" on public.listings for delete using (auth.uid() = user_id);

-- Create notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text,
  title text,
  message text,
  data jsonb,
  read boolean default false,
  created_at timestamp default now()
);

-- Enable RLS on notifications
alter table public.notifications enable row level security;

-- Create RLS policies for notifications
create policy "Users can view their own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update their own notifications" on public.notifications for update using (auth.uid() = user_id);
create policy "Users can delete their own notifications" on public.notifications for delete using (auth.uid() = user_id);
