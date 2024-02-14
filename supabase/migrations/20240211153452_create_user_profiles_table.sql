create table
  public.user_profiles (
    id uuid not null,
    name character varying null,
    surname character varying null,
    stripe_id character varying null,
    constraint user_profiles_pkey primary key (id),
    constraint user_profiles_id_fkey foreign key (id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;