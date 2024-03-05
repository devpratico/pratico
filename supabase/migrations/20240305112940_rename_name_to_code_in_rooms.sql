alter table "public"."rooms" drop constraint "rooms_name_key";

drop index if exists "public"."rooms_name_key";

alter table "public"."rooms" drop column "name";

alter table "public"."rooms" add column "code" text;

CREATE UNIQUE INDEX rooms_name_key ON public.rooms USING btree (code);

alter table "public"."rooms" add constraint "rooms_name_key" UNIQUE using index "rooms_name_key";


