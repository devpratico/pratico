alter table "public"."attendance" add constraint "attendance_room_id_fkey" FOREIGN KEY (room_id) REFERENCES rooms(id) not valid;

alter table "public"."attendance" validate constraint "attendance_room_id_fkey";


