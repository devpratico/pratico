alter table "public"."room_events" drop constraint "room_events_use_id_fkey";

alter table "public"."room_events" drop column "use_id";

alter table "public"."room_events" add column "room_id" bigint not null;

alter table "public"."room_events" add constraint "room_events_room_id_fkey" FOREIGN KEY (room_id) REFERENCES rooms(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."room_events" validate constraint "room_events_room_id_fkey";


