create type "public"."Role" as enum ('pratico_admin');

alter table "public"."user_profiles" add column "role" "Role";


