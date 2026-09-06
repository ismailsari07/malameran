-- Fixed-window rate limiter, in Postgres. No external service.
--
-- The key is hash(salted ip) + ':' + endpoint, built by the caller. The raw IP
-- never reaches the database; rotating RATE_LIMIT_IP_SALT resets every active
-- window, which is acceptable because windows are minutes long.
--
-- RLS enabled, no policies. Only the secret key reaches this table, and only
-- through check_rate_limit().

create table rate_limits (
  bucket_key text not null
    constraint rate_limits_bucket_key_len check (char_length(bucket_key) between 1 and 200),
  window_start timestamptz not null,
  count integer not null default 1 constraint rate_limits_count_positive check (count > 0),
  primary key (bucket_key, window_start)
);

create index rate_limits_window_start_idx on rate_limits (window_start);

alter table rate_limits enable row level security;
alter table rate_limits force row level security;

revoke all on table rate_limits from anon, authenticated;

-- Increment and test in one atomic statement, so two concurrent requests
-- cannot both read "4" and both proceed.
--
-- Returns true when the caller is WITHIN the limit, false when it has been
-- exceeded. The caller treats any error as "exceeded" — the limiter fails
-- closed.
create or replace function check_rate_limit(
  p_bucket_key text,
  p_max_hits integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_window_start timestamptz;
  v_count integer;
begin
  if p_max_hits < 1 or p_window_seconds < 1 then
    raise exception 'invalid rate limit parameters';
  end if;

  -- Floor now() to the window, so every caller in the same window shares a row.
  v_window_start := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );

  insert into rate_limits (bucket_key, window_start, count)
  values (p_bucket_key, v_window_start, 1)
  on conflict (bucket_key, window_start)
    do update set count = rate_limits.count + 1
  returning count into v_count;

  -- Opportunistic cleanup, roughly one call in twenty. Avoids a pg_cron
  -- dependency; a scheduled job is the stage B refinement.
  if random() < 0.05 then
    delete from rate_limits where window_start < now() - interval '1 hour';
  end if;

  return v_count <= p_max_hits;
end;
$$;

revoke all on function check_rate_limit(text, integer, integer) from public, anon, authenticated;
