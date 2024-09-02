create type "public"."RoomStatus" as enum ('open', 'closed');

alter table "public"."rooms" add column "status" "RoomStatus" not null default 'closed'::"RoomStatus";


