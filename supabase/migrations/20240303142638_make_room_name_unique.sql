CREATE UNIQUE INDEX rooms_name_key ON public.rooms USING btree (name);

alter table "public"."rooms" add constraint "rooms_name_key" UNIQUE using index "rooms_name_key";


