revoke delete on table "public"."cities" from "anon";

revoke insert on table "public"."cities" from "anon";

revoke references on table "public"."cities" from "anon";

revoke select on table "public"."cities" from "anon";

revoke trigger on table "public"."cities" from "anon";

revoke truncate on table "public"."cities" from "anon";

revoke update on table "public"."cities" from "anon";

revoke delete on table "public"."cities" from "authenticated";

revoke insert on table "public"."cities" from "authenticated";

revoke references on table "public"."cities" from "authenticated";

revoke select on table "public"."cities" from "authenticated";

revoke trigger on table "public"."cities" from "authenticated";

revoke truncate on table "public"."cities" from "authenticated";

revoke update on table "public"."cities" from "authenticated";

revoke delete on table "public"."cities" from "service_role";

revoke insert on table "public"."cities" from "service_role";

revoke references on table "public"."cities" from "service_role";

revoke select on table "public"."cities" from "service_role";

revoke trigger on table "public"."cities" from "service_role";

revoke truncate on table "public"."cities" from "service_role";

revoke update on table "public"."cities" from "service_role";

revoke delete on table "public"."employees" from "anon";

revoke insert on table "public"."employees" from "anon";

revoke references on table "public"."employees" from "anon";

revoke select on table "public"."employees" from "anon";

revoke trigger on table "public"."employees" from "anon";

revoke truncate on table "public"."employees" from "anon";

revoke update on table "public"."employees" from "anon";

revoke delete on table "public"."employees" from "authenticated";

revoke insert on table "public"."employees" from "authenticated";

revoke references on table "public"."employees" from "authenticated";

revoke select on table "public"."employees" from "authenticated";

revoke trigger on table "public"."employees" from "authenticated";

revoke truncate on table "public"."employees" from "authenticated";

revoke update on table "public"."employees" from "authenticated";

revoke delete on table "public"."employees" from "service_role";

revoke insert on table "public"."employees" from "service_role";

revoke references on table "public"."employees" from "service_role";

revoke select on table "public"."employees" from "service_role";

revoke trigger on table "public"."employees" from "service_role";

revoke truncate on table "public"."employees" from "service_role";

revoke update on table "public"."employees" from "service_role";

alter table "public"."cities" drop constraint "cities_pkey";

alter table "public"."employees" drop constraint "employees_pkey";

drop index if exists "public"."cities_pkey";

drop index if exists "public"."employees_pkey";

drop table "public"."cities";

drop table "public"."employees";


