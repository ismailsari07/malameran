-- One row per file attached to a sourcing request.
--
-- Write order, decided: the request row exists first, its id scopes the storage
-- path, files upload directly to storage, then the server verifies them. A
-- request may briefly hold unverified files; a file never exists without a
-- request.
--
-- The stored path carries neither the original filename nor an extension. The
-- filename lives here and is reattached at download time through the signed
-- URL's Content-Disposition.
--
-- RLS enabled, no policies.

create type request_file_status as enum ('pending', 'verified', 'rejected');

create table request_files (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references sourcing_requests (id) on delete cascade,

  storage_path text not null
    constraint request_files_storage_path_len check (char_length(storage_path) between 1 and 400),
  original_filename text not null
    constraint request_files_original_filename_len check (char_length(original_filename) between 1 and 255),

  -- What the client claimed, and what the bytes actually are. The declared type
  -- is kept for diagnosis; the detected type is the one to trust.
  declared_mime text
    constraint request_files_declared_mime_len check (char_length(declared_mime) <= 120),
  detected_mime text
    constraint request_files_detected_mime_len check (char_length(detected_mime) <= 120),

  size_bytes integer not null
    constraint request_files_size_bytes_range check (size_bytes > 0 and size_bytes <= 4194304),

  status request_file_status not null default 'pending',
  rejection_reason text
    constraint request_files_rejection_reason_len check (char_length(rejection_reason) <= 200),

  created_at timestamptz not null default now()
);

create unique index request_files_storage_path_key on request_files (storage_path);
create index request_files_request_id_idx on request_files (request_id);

-- Five files per request. The server enforces this too; the trigger makes the
-- invariant true whichever code path writes.
create or replace function enforce_request_file_limit()
returns trigger
language plpgsql
as $$
begin
  if (select count(*) from request_files where request_id = new.request_id) >= 5 then
    raise exception 'a sourcing request may have at most 5 files'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger request_files_limit
  before insert on request_files
  for each row execute function enforce_request_file_limit();

alter table request_files enable row level security;
alter table request_files force row level security;

revoke all on table request_files from anon, authenticated;
