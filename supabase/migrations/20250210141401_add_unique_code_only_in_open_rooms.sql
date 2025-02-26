alter table "public"."rooms" drop constraint "rooms_name_key";

drop index if exists "public"."rooms_name_key";

CREATE UNIQUE INDEX idx_room_open_code ON public.rooms USING btree (code) WHERE (status = 'open'::"RoomStatus");


