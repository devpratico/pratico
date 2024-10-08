create table "public"."activities" (
    "id" bigint generated by default as identity not null,
    "created_by" uuid not null default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "type" text not null default 'quiz'::text,
    "object" json not null
);


alter table "public"."activities" enable row level security;

CREATE UNIQUE INDEX "Activities_pkey" ON public.activities USING btree (id);

alter table "public"."activities" add constraint "Activities_pkey" PRIMARY KEY using index "Activities_pkey";

alter table "public"."activities" add constraint "Activities_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."activities" validate constraint "Activities_created_by_fkey";

grant delete on table "public"."activities" to "anon";

grant insert on table "public"."activities" to "anon";

grant references on table "public"."activities" to "anon";

grant select on table "public"."activities" to "anon";

grant trigger on table "public"."activities" to "anon";

grant truncate on table "public"."activities" to "anon";

grant update on table "public"."activities" to "anon";

grant delete on table "public"."activities" to "authenticated";

grant insert on table "public"."activities" to "authenticated";

grant references on table "public"."activities" to "authenticated";

grant select on table "public"."activities" to "authenticated";

grant trigger on table "public"."activities" to "authenticated";

grant truncate on table "public"."activities" to "authenticated";

grant update on table "public"."activities" to "authenticated";

grant delete on table "public"."activities" to "service_role";

grant insert on table "public"."activities" to "service_role";

grant references on table "public"."activities" to "service_role";

grant select on table "public"."activities" to "service_role";

grant trigger on table "public"."activities" to "service_role";

grant truncate on table "public"."activities" to "service_role";

grant update on table "public"."activities" to "service_role";


