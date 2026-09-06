-- Shared constraint helpers.
--
-- A CHECK constraint may not contain a subquery, so bounding the length of
-- every element in a text[] needs an immutable function instead.

create extension if not exists citext;

create or replace function text_array_within(arr text[], max_len integer)
returns boolean
language sql
immutable
strict
as $$
  -- unnest of an empty array yields no rows, so bool_and is null: treat as ok.
  select coalesce(bool_and(char_length(e) between 1 and max_len), true)
  from unnest(arr) as e;
$$;

revoke all on function text_array_within(text[], integer) from public, anon, authenticated;
