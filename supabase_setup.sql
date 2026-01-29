-- Enable RLS
alter table if exists products enable row level security;
alter table if exists orders enable row level security;
alter table if exists order_items enable row level security;
alter table if exists profiles enable row level security;

-- Create tables if they don't exist
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null,
  image_url text,
  collection_id text not null,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  status text not null default 'pending',
  total_amount numeric not null,
  shipping_details jsonb,
  created_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_name text not null,
  quantity integer not null,
  price_at_purchase numeric not null,
  config jsonb,
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid references auth.users(id) primary key,
  role text not null default 'user',
  created_at timestamptz default now()
);

-- Policies for Profiles
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Policies for Products
drop policy if exists "Products are viewable by everyone." on products;
create policy "Products are viewable by everyone."
  on products for select
  using ( true );

drop policy if exists "Admins can insert products." on products;
create policy "Admins can insert products."
  on products for insert
  with check ( auth.uid() in (select id from profiles where role = 'admin') );

drop policy if exists "Admins can update products." on products;
create policy "Admins can update products."
  on products for update
  using ( auth.uid() in (select id from profiles where role = 'admin') );

drop policy if exists "Admins can delete products." on products;
create policy "Admins can delete products."
  on products for delete
  using ( auth.uid() in (select id from profiles where role = 'admin') );

-- Policies for Orders
drop policy if exists "Admins can view all orders." on orders;
create policy "Admins can view all orders."
  on orders for select
  using ( auth.uid() in (select id from profiles where role = 'admin') );

drop policy if exists "Users can view their own orders." on orders;
create policy "Users can view their own orders."
  on orders for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can insert their own orders." on orders;
create policy "Users can insert their own orders."
  on orders for insert
  with check ( auth.uid() = user_id );

-- Storage Policies
-- Note: You might need to Create the 'products' bucket manually in the dashboard if this fails
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

drop policy if exists "Product images are publicly accessible." on storage.objects;
create policy "Product images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'products' );

drop policy if exists "Admins can upload product images." on storage.objects;
create policy "Admins can upload product images."
  on storage.objects for insert
  with check ( bucket_id = 'products' and auth.uid() in (select id from profiles where role = 'admin') );

drop policy if exists "Admins can update product images." on storage.objects;
create policy "Admins can update product images."
  on storage.objects for update
  using ( bucket_id = 'products' and auth.uid() in (select id from profiles where role = 'admin') );

drop policy if exists "Admins can delete product images." on storage.objects;
create policy "Admins can delete product images."
  on storage.objects for delete
  using ( bucket_id = 'products' and auth.uid() in (select id from profiles where role = 'admin') );
