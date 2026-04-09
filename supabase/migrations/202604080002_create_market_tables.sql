-- ══════════════════════════════════════════════════════════
-- TimeExchange market schema: orders, trades, recommendations
-- ══════════════════════════════════════════════════════════

-- Spot orders
create table if not exists public.spot_orders (
  id uuid primary key default gen_random_uuid(),
  side text not null check (side in ('bid', 'ask')),
  mentor_id uuid references public.profiles(id),
  buyer_id uuid references public.profiles(id),
  category_id text not null,
  expertise text[] not null default '{}',
  price numeric(10,2) not null check (price > 0),
  status text not null default 'open' check (status in ('open', 'filled', 'partial', 'cancelled')),
  created_at timestamptz not null default now(),
  filled_at timestamptz
);

alter table public.spot_orders enable row level security;

create policy "spot_orders_read"
on public.spot_orders for select
to authenticated using (true);

create policy "spot_orders_insert"
on public.spot_orders for insert
to authenticated with check (
  buyer_id = auth.uid() or mentor_id = auth.uid()
);

-- Futures orders
create table if not exists public.futures_orders (
  id uuid primary key default gen_random_uuid(),
  side text not null check (side in ('bid', 'ask')),
  mentor_id uuid references public.profiles(id),
  buyer_id uuid references public.profiles(id),
  category_id text not null,
  expertise text[] not null default '{}',
  price numeric(10,2) not null check (price > 0),
  scheduled_date date not null,
  scheduled_time time not null,
  duration_minutes integer not null check (duration_minutes > 0),
  timezone text not null default 'UTC',
  status text not null default 'open' check (status in ('open', 'filled', 'partial', 'cancelled')),
  created_at timestamptz not null default now(),
  filled_at timestamptz
);

alter table public.futures_orders enable row level security;

create policy "futures_orders_read"
on public.futures_orders for select
to authenticated using (true);

create policy "futures_orders_insert"
on public.futures_orders for insert
to authenticated with check (
  buyer_id = auth.uid() or mentor_id = auth.uid()
);

-- Trades (filled orders)
create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  order_id uuid,
  order_type text not null check (order_type in ('spot', 'futures')),
  mentor_id uuid not null references public.profiles(id),
  buyer_id uuid not null references public.profiles(id),
  category_id text not null,
  expertise text[] not null default '{}',
  price numeric(10,2) not null,
  duration_minutes integer not null,
  executed_at timestamptz not null default now()
);

alter table public.trades enable row level security;

create policy "trades_read"
on public.trades for select
to authenticated using (true);

-- Price history (aggregated candles)
create table if not exists public.price_candles (
  id uuid primary key default gen_random_uuid(),
  category_id text not null,
  bucket_start timestamptz not null,
  bucket_size interval not null default '1 hour',
  open_price numeric(10,2) not null,
  high_price numeric(10,2) not null,
  low_price numeric(10,2) not null,
  close_price numeric(10,2) not null,
  volume_minutes integer not null default 0,
  trade_count integer not null default 0,
  unique (category_id, bucket_start, bucket_size)
);

alter table public.price_candles enable row level security;

create policy "candles_read"
on public.price_candles for select
to authenticated using (true);

-- AI recommendations
create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  mentor_id uuid not null references public.profiles(id),
  match_score numeric(5,2) not null,
  match_type text not null,
  score_breakdown jsonb not null default '{}',
  recommendation_type text not null check (recommendation_type in ('spot', 'futures', 'next_booking')),
  accepted boolean,
  feedback_rating integer check (feedback_rating is null or (feedback_rating >= 1 and feedback_rating <= 5)),
  created_at timestamptz not null default now()
);

alter table public.recommendations enable row level security;

create policy "recommendations_own"
on public.recommendations for select
to authenticated using (user_id = auth.uid());

create policy "recommendations_insert"
on public.recommendations for insert
to authenticated with check (user_id = auth.uid());

create policy "recommendations_update"
on public.recommendations for update
to authenticated using (user_id = auth.uid());

-- Session consent
create table if not exists public.session_consents (
  id uuid primary key default gen_random_uuid(),
  session_id uuid,
  user_id uuid not null references public.profiles(id),
  mentor_id uuid not null references public.profiles(id),
  consent_type text not null check (consent_type in ('transcript_analysis', 'topic_extraction', 'quality_assessment')),
  granted boolean not null default false,
  granted_at timestamptz not null default now()
);

alter table public.session_consents enable row level security;

create policy "consent_own"
on public.session_consents for all
to authenticated using (user_id = auth.uid() or mentor_id = auth.uid());

-- Session summaries
create table if not exists public.session_summaries (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  topics text[] not null default '{}',
  key_insights text[] not null default '{}',
  quality_clarity numeric(5,2),
  quality_depth numeric(5,2),
  quality_relevance numeric(5,2),
  quality_engagement numeric(5,2),
  extracted_at timestamptz not null default now()
);

alter table public.session_summaries enable row level security;

create policy "summaries_read"
on public.session_summaries for select
to authenticated using (true);

-- Mentor quality metrics (materialized/cached)
create table if not exists public.mentor_quality (
  mentor_id uuid primary key references public.profiles(id),
  category_id text not null,
  completion_rate numeric(5,4) not null default 0,
  average_rating numeric(3,1) not null default 0,
  repeat_booking_rate numeric(5,4) not null default 0,
  dispute_rate numeric(5,4) not null default 0,
  avg_response_time_minutes numeric(8,2) not null default 0,
  topic_match_quality numeric(5,4) not null default 0,
  total_sessions integer not null default 0,
  recent_trend text not null default 'stable' check (recent_trend in ('improving', 'stable', 'declining')),
  last_updated timestamptz not null default now()
);

alter table public.mentor_quality enable row level security;

create policy "quality_read"
on public.mentor_quality for select
to authenticated using (true);

-- Watchlist
create table if not exists public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  category_id text not null,
  expertise text[] not null default '{}',
  price_alert numeric(10,2),
  created_at timestamptz not null default now()
);

alter table public.watchlist enable row level security;

create policy "watchlist_own"
on public.watchlist for all
to authenticated using (user_id = auth.uid());

-- Indexes for common queries
create index if not exists idx_spot_orders_category on public.spot_orders(category_id, status);
create index if not exists idx_futures_orders_date on public.futures_orders(scheduled_date, status);
create index if not exists idx_trades_executed on public.trades(executed_at desc);
create index if not exists idx_trades_category on public.trades(category_id, executed_at desc);
create index if not exists idx_recommendations_user on public.recommendations(user_id, created_at desc);
create index if not exists idx_candles_category on public.price_candles(category_id, bucket_start desc);
