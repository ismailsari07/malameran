-- Sourcing requests: the public three-step form in docs/scope.md.
--
-- RLS is enabled with NO policies. There are no user accounts in stage A, so
-- anon and authenticated must be able to read and write nothing. Every write
-- goes through a server route holding the secret key, which bypasses RLS.
-- Real policies arrive with accounts in stage B.

-- Non-round start so the first submission does not advertise that it is the
-- first. The artboard's example reference is MAL-40219.
create sequence sourcing_request_ref_seq start with 40217;

create table sourcing_requests (
  id uuid primary key default gen_random_uuid(),

  ref_number bigint not null default nextval('sourcing_request_ref_seq'),
  reference text generated always as ('MAL-' || ref_number) stored,

  created_at timestamptz not null default now(),

  -- Required
  product_description text not null
    constraint sourcing_requests_product_description_len
    check (char_length(product_description) between 1 and 5000),
  contact_name text not null
    constraint sourcing_requests_contact_name_len
    check (char_length(contact_name) between 1 and 120),
  email citext not null
    constraint sourcing_requests_email_shape
    check (char_length(email) <= 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),

  -- Optional
  company text constraint sourcing_requests_company_len check (char_length(company) <= 160),
  phone text constraint sourcing_requests_phone_len check (char_length(phone) <= 40),
  industry text constraint sourcing_requests_industry_len check (char_length(industry) <= 80),
  request_type text constraint sourcing_requests_request_type_len check (char_length(request_type) <= 80),
  quantity text constraint sourcing_requests_quantity_len check (char_length(quantity) <= 80),
  target_price text constraint sourcing_requests_target_price_len check (char_length(target_price) <= 80),
  target_delivery_date date,
  preferred_country text constraint sourcing_requests_preferred_country_len check (char_length(preferred_country) <= 80),
  certifications text[]
    constraint sourcing_requests_certifications_bounds
    check (
      certifications is null
      or (coalesce(array_length(certifications, 1), 0) <= 10
          and text_array_within(certifications, 80))
    ),
  note text constraint sourcing_requests_note_len check (char_length(note) <= 5000)
);

create unique index sourcing_requests_reference_key on sourcing_requests (reference);
create index sourcing_requests_created_at_idx on sourcing_requests (created_at desc);

alter table sourcing_requests enable row level security;
alter table sourcing_requests force row level security;

-- Deliberately no policies. See the header.

-- Second, independent layer: even if a policy is added by mistake, the role
-- has no table privileges to exercise it with.
revoke all on table sourcing_requests from anon, authenticated;
revoke all on sequence sourcing_request_ref_seq from anon, authenticated;
