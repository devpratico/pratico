alter table "public"."attendance" drop constraint "attendance_room_id_fkey";

alter table "public"."attendance" add constraint "attendance_room_id_fkey" FOREIGN KEY (room_id) REFERENCES rooms(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."attendance" validate constraint "attendance_room_id_fkey";


