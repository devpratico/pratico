create table
  public.capsules (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    title text null,
    created_by uuid null,
    tld_snapshot jsonb[] null,
    constraint capsules_pkey primary key (id),
    constraint capsules_created_by_fkey foreign key (created_by) references auth.users (id)
  ) tablespace pg_default;