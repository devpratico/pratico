revoke delete on table "public"."chat" from "anon";

revoke insert on table "public"."chat" from "anon";

revoke references on table "public"."chat" from "anon";

revoke select on table "public"."chat" from "anon";

revoke trigger on table "public"."chat" from "anon";

revoke truncate on table "public"."chat" from "anon";

revoke update on table "public"."chat" from "anon";

revoke delete on table "public"."chat" from "authenticated";

revoke insert on table "public"."chat" from "authenticated";

revoke references on table "public"."chat" from "authenticated";

revoke select on table "public"."chat" from "authenticated";

revoke trigger on table "public"."chat" from "authenticated";

revoke truncate on table "public"."chat" from "authenticated";

revoke update on table "public"."chat" from "authenticated";

revoke delete on table "public"."chat" from "service_role";

revoke insert on table "public"."chat" from "service_role";

revoke references on table "public"."chat" from "service_role";

revoke select on table "public"."chat" from "service_role";

revoke trigger on table "public"."chat" from "service_role";

revoke truncate on table "public"."chat" from "service_role";

revoke update on table "public"."chat" from "service_role";

alter table "public"."chat" drop constraint "chat_room_id_fkey";

alter table "public"."chat" drop constraint "chat_pkey";

drop index if exists "public"."chat_pkey";

drop table "public"."chat";


-- This is a comment