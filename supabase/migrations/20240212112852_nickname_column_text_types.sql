alter table "public"."user_profiles" add column "nickname" text;

alter table "public"."user_profiles" alter column "name" set data type text using "name"::text;

alter table "public"."user_profiles" alter column "stripe_id" set data type text using "stripe_id"::text;

alter table "public"."user_profiles" alter column "surname" set data type text using "surname"::text;

alter table "public"."user_profiles" add constraint "user_profiles_name_check" CHECK ((length(name) < 50)) not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_name_check";

alter table "public"."user_profiles" add constraint "user_profiles_nickname_check" CHECK ((length(nickname) < 50)) not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_nickname_check";

alter table "public"."user_profiles" add constraint "user_profiles_surname_check" CHECK ((length(surname) < 50)) not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_surname_check";


