-- Supplier applications: the public form on /suppliers/apply.
--
-- Fields follow the Supplier Application artboard, which is the surviving
-- surface after the embedded For Suppliers form was dropped. The artboard's
-- "Company profile or catalogue" upload is deliberately not implemented — a
-- supplier application is a lead, not a project, and suppliers get accounts and
-- document upload in phase 2. See docs/decisions.md.
--
-- RLS enabled, no policies, same reasoning as sourcing_requests.

create sequence supplier_application_ref_seq start with 11803;

create table supplier_applications (
  id uuid primary key default gen_random_uuid(),

  ref_number bigint not null default nextval('supplier_application_ref_seq'),
  reference text generated always as ('SUP-' || ref_number) stored,

  created_at timestamptz not null default now(),

  -- Required
  company_name text not null
    constraint supplier_applications_company_name_len
    check (char_length(company_name) between 1 and 160),
  country text not null
    constraint supplier_applications_country_len
    check (char_length(country) between 1 and 80),
  manufacturing_categories text[] not null
    constraint supplier_applications_categories_bounds
    check (
      coalesce(array_length(manufacturing_categories, 1), 0) between 1 and 10
      and text_array_within(manufacturing_categories, 120)
    ),
  contact_name text not null
    constraint supplier_applications_contact_name_len
    check (char_length(contact_name) between 1 and 120),
  email citext not null
    constraint supplier_applications_email_shape
    check (char_length(email) <= 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),

  -- Optional
  monthly_capacity text constraint supplier_applications_capacity_len check (char_length(monthly_capacity) <= 200),
  website text constraint supplier_applications_website_len check (char_length(website) <= 300),
  certifications text[]
    constraint supplier_applications_certifications_bounds
    check (
      certifications is null
      or (coalesce(array_length(certifications, 1), 0) <= 20
          and text_array_within(certifications, 80))
    ),
  phone text constraint supplier_applications_phone_len check (char_length(phone) <= 40),
  note text constraint supplier_applications_note_len check (char_length(note) <= 5000)
);

create unique index supplier_applications_reference_key on supplier_applications (reference);
create index supplier_applications_created_at_idx on supplier_applications (created_at desc);

alter table supplier_applications enable row level security;
alter table supplier_applications force row level security;

revoke all on table supplier_applications from anon, authenticated;
revoke all on sequence supplier_application_ref_seq from anon, authenticated;
