alter table "public"."user_profiles" drop constraint "user_profiles_name_check";

alter table "public"."user_profiles" drop constraint "user_profiles_surname_check";

alter table "public"."user_profiles" drop column "name";

alter table "public"."user_profiles" drop column "surname";

alter table "public"."user_profiles" add column "first_name" text;

alter table "public"."user_profiles" add column "last_name" text;

alter table "public"."user_profiles" add constraint "user_profiles_name_check" CHECK ((length(first_name) < 50)) not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_name_check";

alter table "public"."user_profiles" add constraint "user_profiles_surname_check" CHECK ((length(last_name) < 50)) not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_surname_check";


