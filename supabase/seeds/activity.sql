SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '678aa8df-8ffa-4902-9cdf-ec2a347018b6', '{"action":"login","actor_id":"bd745bf6-b800-4b3e-b121-b44baa80de59","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-21 09:59:41.313995+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'bd745bf6-b800-4b3e-b121-b44baa80de59', 'authenticated', 'authenticated', 'test@test.com', '$2a$10$MrkZK8kG2n50J1ykM0snlupn5MYhmL2r.8FibgylD9fh5sDKeA3S.', '2025-03-20 16:02:33.341316+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-03-21 09:59:41.314757+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "bd745bf6-b800-4b3e-b121-b44baa80de59", "email": "test@test.com", "email_verified": false, "phone_verified": false}', NULL, '2025-03-20 16:02:33.33522+00', '2025-03-21 09:59:41.316324+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'ef0e0a37-ee20-49ca-869b-23bbffdb39fe', 'authenticated', 'authenticated', NULL, '', NULL, NULL, '', NULL, '', NULL, '', '', NULL, '2025-03-21 10:37:18.059015+00', '{}', '{}', NULL, '2025-03-21 10:37:18.056551+00', '2025-03-21 10:37:18.060178+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, true),
	('00000000-0000-0000-0000-000000000000', '7310822a-f760-4af0-92e9-d18d9939aaf5', 'authenticated', 'authenticated', NULL, '', NULL, NULL, '', NULL, '', NULL, '', '', NULL, '2025-03-21 10:39:52.540094+00', '{}', '{}', NULL, '2025-03-21 10:39:52.53862+00', '2025-03-21 10:39:52.5413+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, true),
	('00000000-0000-0000-0000-000000000000', 'e10286ef-b820-4ff5-95ca-6c647009d163', 'authenticated', 'authenticated', NULL, '', NULL, NULL, '', NULL, '', NULL, '', '', NULL, '2025-03-21 10:40:59.446053+00', '{}', '{}', NULL, '2025-03-21 10:40:59.444652+00', '2025-03-21 10:40:59.447197+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, true);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('bd745bf6-b800-4b3e-b121-b44baa80de59', 'bd745bf6-b800-4b3e-b121-b44baa80de59', '{"sub": "bd745bf6-b800-4b3e-b121-b44baa80de59", "email": "test@test.com", "email_verified": false, "phone_verified": false}', 'email', '2025-03-20 16:02:33.339339+00', '2025-03-20 16:02:33.339366+00', '2025-03-20 16:02:33.339366+00', 'de0b4234-8085-44ed-b509-d0b3157bb8f3');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('c352ebdc-79ab-4851-b709-dff3f1f8a06f', 'bd745bf6-b800-4b3e-b121-b44baa80de59', '2025-03-21 09:59:41.314807+00', '2025-03-21 09:59:41.314807+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.65.1', NULL),
	('28500838-65e4-4625-931c-4fda30de3cee', 'ef0e0a37-ee20-49ca-869b-23bbffdb39fe', '2025-03-21 10:37:18.059051+00', '2025-03-21 10:37:18.059051+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.65.1', NULL),
	('3418ddf5-bf0b-4190-ae66-a4eb8f77e49d', '7310822a-f760-4af0-92e9-d18d9939aaf5', '2025-03-21 10:39:52.540124+00', '2025-03-21 10:39:52.540124+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.65.1', NULL),
	('a416ee4f-7477-4920-8413-6d57b3e91433', 'e10286ef-b820-4ff5-95ca-6c647009d163', '2025-03-21 10:40:59.446088+00', '2025-03-21 10:40:59.446088+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.65.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('c352ebdc-79ab-4851-b709-dff3f1f8a06f', '2025-03-21 09:59:41.316655+00', '2025-03-21 09:59:41.316655+00', 'password', '69eb2637-bd2c-411a-a1a8-9e58d7184f5c'),
	('28500838-65e4-4625-931c-4fda30de3cee', '2025-03-21 10:37:18.060356+00', '2025-03-21 10:37:18.060356+00', 'anonymous', '2f6dc22f-989a-4836-adec-ece80adcb32b'),
	('3418ddf5-bf0b-4190-ae66-a4eb8f77e49d', '2025-03-21 10:39:52.541488+00', '2025-03-21 10:39:52.541488+00', 'anonymous', 'd11d4b07-d7ee-4206-8d8e-3bf90c961808'),
	('a416ee4f-7477-4920-8413-6d57b3e91433', '2025-03-21 10:40:59.447398+00', '2025-03-21 10:40:59.447398+00', 'anonymous', 'ef5a968c-6d32-40c3-843c-63be0ce7273f');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, '1v4Zg7uOBlAQirUGLB0dwg', 'bd745bf6-b800-4b3e-b121-b44baa80de59', false, '2025-03-21 09:59:41.315583+00', '2025-03-21 09:59:41.315583+00', NULL, 'c352ebdc-79ab-4851-b709-dff3f1f8a06f'),
	('00000000-0000-0000-0000-000000000000', 2, 'zJwqULmCI38ySvO2bhr94Q', 'ef0e0a37-ee20-49ca-869b-23bbffdb39fe', false, '2025-03-21 10:37:18.059454+00', '2025-03-21 10:37:18.059454+00', NULL, '28500838-65e4-4625-931c-4fda30de3cee'),
	('00000000-0000-0000-0000-000000000000', 3, 'eFdLpgDqgoYC9VNfX9gsEQ', '7310822a-f760-4af0-92e9-d18d9939aaf5', false, '2025-03-21 10:39:52.540605+00', '2025-03-21 10:39:52.540605+00', NULL, '3418ddf5-bf0b-4190-ae66-a4eb8f77e49d'),
	('00000000-0000-0000-0000-000000000000', 4, 'nYWjg_i63N6chq5zAxaMEQ', 'e10286ef-b820-4ff5-95ca-6c647009d163', false, '2025-03-21 10:40:59.446618+00', '2025-03-21 10:40:59.446618+00', NULL, 'a416ee4f-7477-4920-8413-6d57b3e91433');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--




--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."activities" ("id", "created_by", "created_at", "type", "object") VALUES
	(2, 'bd745bf6-b800-4b3e-b121-b44baa80de59', '2025-03-21 10:36:16.979592+00', 'poll', '{"type":"poll","schemaVersion":"3","title":"Super sondage","questions":[{"id":"question-01","text":"Super question A","choices":[{"id":"choice-1742553360806-1155","text":"Réponse 1"},{"id":"choice-1742553362822-1772","text":"Réponse 2"}]},{"id":"question-1742553364472-2114","text":"Autre question (B)","choices":[{"id":"choice-1742553374383-9433","text":"Réponse 11"},{"id":"choice-1742553375338-4229","text":"22"}]}]}');


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."attendance" ("id", "created_at", "room_id", "user_id", "first_name", "last_name", "additional_info") VALUES
	(1, '2025-03-21 10:37:18.078452+00', 1, 'ef0e0a37-ee20-49ca-869b-23bbffdb39fe', 'Firefox', 'Fox', ''),
	(2, '2025-03-21 10:39:52.55217+00', 1, '7310822a-f760-4af0-92e9-d18d9939aaf5', 'Tom', 'Safari', ''),
	(3, '2025-03-21 10:40:59.458988+00', 1, 'e10286ef-b820-4ff5-95ca-6c647009d163', 'Tom', 'Chrome Privé', '');


--
-- Data for Name: capsules; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."capsules" ("id", "created_at", "title", "created_by", "tld_snapshot") VALUES
	('284cc55b-979c-4cc4-aa5c-135b0a73dc33', '2025-03-20 16:34:36.185599+00', 'Sans titre', 'bd745bf6-b800-4b3e-b121-b44baa80de59', '{"{\"session\": {\"version\": 0, \"isGridMode\": false, \"pageStates\": [{\"camera\": {\"x\": 0, \"y\": 370.5980528511823, \"z\": 0.37447916666666664}, \"pageId\": \"page:page\", \"focusedGroupId\": null, \"selectedShapeIds\": []}], \"isDebugMode\": false, \"isFocusMode\": false, \"isToolLocked\": false, \"currentPageId\": \"page:page\", \"exportBackground\": true}, \"document\": {\"store\": {\"page:page\": {\"id\": \"page:page\", \"meta\": {}, \"name\": \"Page 1\", \"index\": \"a1\", \"typeName\": \"page\"}, \"document:document\": {\"id\": \"document:document\", \"meta\": {}, \"name\": \"\", \"gridSize\": 10, \"typeName\": \"document\"}}, \"schema\": {\"sequences\": {\"com.tldraw.page\": 1, \"com.tldraw.asset\": 1, \"com.tldraw.shape\": 4, \"com.tldraw.store\": 4, \"com.tldraw.camera\": 1, \"com.tldraw.pointer\": 1, \"com.tldraw.document\": 2, \"com.tldraw.instance\": 25, \"com.tldraw.shape.geo\": 9, \"com.tldraw.shape.draw\": 2, \"com.tldraw.shape.line\": 5, \"com.tldraw.shape.note\": 8, \"com.tldraw.shape.text\": 2, \"com.tldraw.asset.image\": 5, \"com.tldraw.asset.video\": 5, \"com.tldraw.shape.arrow\": 5, \"com.tldraw.shape.embed\": 4, \"com.tldraw.shape.frame\": 0, \"com.tldraw.shape.group\": 0, \"com.tldraw.shape.image\": 4, \"com.tldraw.shape.video\": 2, \"com.tldraw.binding.arrow\": 0, \"com.tldraw.asset.bookmark\": 2, \"com.tldraw.shape.bookmark\": 2, \"com.tldraw.shape.highlight\": 1, \"com.tldraw.instance_presence\": 6, \"com.tldraw.instance_page_state\": 5}, \"schemaVersion\": 2}}}"}');


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."rooms" ("id", "created_by", "capsule_id", "params", "capsule_snapshot", "code", "status", "activity_snapshot", "created_at", "end_of_session") VALUES
	(1, 'bd745bf6-b800-4b3e-b121-b44baa80de59', '284cc55b-979c-4cc4-aa5c-135b0a73dc33', '{"navigation":{"type":"animateur","follow":"bd745bf6-b800-4b3e-b121-b44baa80de59"},"collaboration":{"active":true,"allowAll":false,"allowedUsersIds":[]}}', '{"session": {"version": 0, "isGridMode": false, "pageStates": [{"camera": {"x": 0, "y": 370.5980528511823, "z": 0.37447916666666664}, "pageId": "page:page", "focusedGroupId": null, "selectedShapeIds": []}], "isDebugMode": false, "isFocusMode": false, "isToolLocked": false, "currentPageId": "page:page", "exportBackground": true}, "document": {"store": {"page:page": {"id": "page:page", "meta": {}, "name": "Page 1", "index": "a1", "typeName": "page"}, "document:document": {"id": "document:document", "meta": {}, "name": "", "gridSize": 10, "typeName": "document"}, "shape:l-jAaTV3IYT00m617bTqZ": {"x": 425.44218750000005, "y": 734.1890625, "id": "shape:l-jAaTV3IYT00m617bTqZ", "meta": {}, "type": "draw", "index": "a1", "props": {"dash": "draw", "fill": "none", "size": "xl", "color": "violet", "isPen": false, "scale": 1, "isClosed": false, "segments": [{"type": "free", "points": [{"x": 0, "y": 0, "z": 0.5}, {"x": -0.2, "y": 0.2, "z": 0.5}, {"x": 0.93, "y": 0.02, "z": 0.5}, {"x": 9.5, "y": -5.48, "z": 0.5}, {"x": 29.9, "y": -18.74, "z": 0.5}, {"x": 101.03, "y": -68.87, "z": 0.5}, {"x": 185.28, "y": -132.8, "z": 0.5}, {"x": 258.65, "y": -198.29, "z": 0.5}, {"x": 333.53, "y": -289.93, "z": 0.5}, {"x": 379.08, "y": -373.63, "z": 0.5}, {"x": 389.79, "y": -413.65, "z": 0.5}, {"x": 392.38, "y": -428.28, "z": 0.5}, {"x": 393.55, "y": -445.87, "z": 0.5}, {"x": 394.01, "y": -461.89, "z": 0.5}, {"x": 394.01, "y": -472.99, "z": 0.5}, {"x": 394.01, "y": -481.83, "z": 0.5}, {"x": 394.01, "y": -487.24, "z": 0.5}, {"x": 392.43, "y": -493.47, "z": 0.5}, {"x": 389.55, "y": -498.34, "z": 0.5}, {"x": 385.11, "y": -502.95, "z": 0.5}, {"x": 380.7, "y": -507.37, "z": 0.5}, {"x": 374.46, "y": -513.25, "z": 0.5}, {"x": 372.77, "y": -514.39, "z": 0.5}, {"x": 371.45, "y": -515.4, "z": 0.5}, {"x": 368.76, "y": -516.14, "z": 0.5}, {"x": 364.36, "y": -516.37, "z": 0.5}, {"x": 357.75, "y": -514.32, "z": 0.5}, {"x": 346.62, "y": -502.34, "z": 0.5}, {"x": 329.56, "y": -477.16, "z": 0.5}, {"x": 305.33, "y": -440.69, "z": 0.5}, {"x": 266.05, "y": -375.43, "z": 0.5}, {"x": 222.81, "y": -293.9, "z": 0.5}, {"x": 198.59, "y": -238.46, "z": 0.5}, {"x": 177.78, "y": -186.21, "z": 0.5}, {"x": 148.46, "y": -117.82, "z": 0.5}, {"x": 130, "y": -72.2, "z": 0.5}, {"x": 120.45, "y": -46.85, "z": 0.5}, {"x": 108.04, "y": -14.19, "z": 0.5}, {"x": 95.71, "y": 20.17, "z": 0.5}, {"x": 86.01, "y": 50.83, "z": 0.5}, {"x": 78.86, "y": 76.11, "z": 0.5}, {"x": 75.11, "y": 91.43, "z": 0.5}, {"x": 73.59, "y": 102.56, "z": 0.5}, {"x": 71.99, "y": 114.2, "z": 0.5}, {"x": 71.17, "y": 124.72, "z": 0.5}, {"x": 71.04, "y": 133.26, "z": 0.5}, {"x": 71.01, "y": 139.38, "z": 0.5}, {"x": 71.01, "y": 143.6, "z": 0.5}, {"x": 71.01, "y": 149.27, "z": 0.5}, {"x": 71.01, "y": 150.93, "z": 0.5}, {"x": 71.01, "y": 152.59, "z": 0.5}, {"x": 71.01, "y": 153.66, "z": 0.5}, {"x": 71.01, "y": 154.68, "z": 0.5}, {"x": 71.01, "y": 155.54, "z": 0.5}, {"x": 71.01, "y": 156.12, "z": 0.5}, {"x": 71.01, "y": 156.31, "z": 0.5}, {"x": 71.01, "y": 152.89, "z": 0.5}, {"x": 73.48, "y": 145.85, "z": 0.5}, {"x": 78.69, "y": 136.65, "z": 0.5}, {"x": 85.19, "y": 125.15, "z": 0.5}, {"x": 91.2, "y": 115.52, "z": 0.5}, {"x": 96.96, "y": 106.82, "z": 0.5}, {"x": 105.09, "y": 95.44, "z": 0.5}, {"x": 120.75, "y": 75.64, "z": 0.5}, {"x": 139.53, "y": 55.74, "z": 0.5}, {"x": 153.45, "y": 46.49, "z": 0.5}, {"x": 158.9, "y": 44.05, "z": 0.5}, {"x": 165.67, "y": 41.77, "z": 0.5}, {"x": 171.54, "y": 41.15, "z": 0.5}, {"x": 175.66, "y": 41.15, "z": 0.5}, {"x": 181.04, "y": 41.15, "z": 0.5}, {"x": 182.28, "y": 41.15, "z": 0.5}, {"x": 183.58, "y": 41.15, "z": 0.5}, {"x": 184.55, "y": 41.6, "z": 0.5}, {"x": 185.69, "y": 44.18, "z": 0.5}, {"x": 186.32, "y": 50.05, "z": 0.5}, {"x": 187.08, "y": 59.41, "z": 0.5}, {"x": 187.8, "y": 73.14, "z": 0.5}, {"x": 188.66, "y": 89.72, "z": 0.5}, {"x": 190.33, "y": 107.05, "z": 0.5}, {"x": 191.68, "y": 118.34, "z": 0.5}, {"x": 192.85, "y": 126.26, "z": 0.5}, {"x": 194.77, "y": 136.07, "z": 0.5}, {"x": 196.32, "y": 142.33, "z": 0.5}, {"x": 197.85, "y": 146.48, "z": 0.5}, {"x": 199.93, "y": 150.57, "z": 0.5}, {"x": 203.27, "y": 154.75, "z": 0.5}, {"x": 208.12, "y": 157.91, "z": 0.5}, {"x": 213.82, "y": 159.57, "z": 0.5}, {"x": 221.48, "y": 160.5, "z": 0.5}, {"x": 231.17, "y": 160.69, "z": 0.5}, {"x": 242.37, "y": 158.83, "z": 0.5}, {"x": 254.97, "y": 152.08, "z": 0.5}, {"x": 267.79, "y": 140.5, "z": 0.5}, {"x": 278.77, "y": 127.2, "z": 0.5}, {"x": 287.78, "y": 113.27, "z": 0.5}, {"x": 299.29, "y": 87.65, "z": 0.5}, {"x": 302.56, "y": 74.69, "z": 0.5}, {"x": 305.29, "y": 60.21, "z": 0.5}, {"x": 307.26, "y": 45.12, "z": 0.5}, {"x": 309.2, "y": 28.28, "z": 0.5}, {"x": 310.71, "y": 15.96, "z": 0.5}, {"x": 311.51, "y": 4.85, "z": 0.5}, {"x": 311.7, "y": -8, "z": 0.5}, {"x": 311.77, "y": -17.61, "z": 0.5}, {"x": 311.78, "y": -24.88, "z": 0.5}, {"x": 311.78, "y": -30.64, "z": 0.5}, {"x": 311.78, "y": -33.74, "z": 0.5}, {"x": 311.78, "y": -35.88, "z": 0.5}, {"x": 311.78, "y": -37.17, "z": 0.5}, {"x": 311.65, "y": -37.4, "z": 0.5}, {"x": 310.66, "y": -37.4, "z": 0.5}, {"x": 308.35, "y": -37.4, "z": 0.5}, {"x": 304.71, "y": -36.64, "z": 0.5}, {"x": 298.08, "y": -30.45, "z": 0.5}, {"x": 283.34, "y": -8.19, "z": 0.5}, {"x": 277.03, "y": 3.12, "z": 0.5}, {"x": 272.03, "y": 12.86, "z": 0.5}, {"x": 267.87, "y": 22.82, "z": 0.5}, {"x": 264.74, "y": 34.75, "z": 0.5}, {"x": 262.59, "y": 50.9, "z": 0.5}, {"x": 262.31, "y": 61.77, "z": 0.5}, {"x": 263.19, "y": 70.54, "z": 0.5}, {"x": 267.29, "y": 74.98, "z": 0.5}, {"x": 273.5, "y": 80.98, "z": 0.5}, {"x": 279.11, "y": 85.42, "z": 0.5}, {"x": 285.19, "y": 89.22, "z": 0.5}, {"x": 304.55, "y": 98.99, "z": 0.5}, {"x": 326.17, "y": 102.35, "z": 0.5}, {"x": 355.53, "y": 96.4, "z": 0.5}, {"x": 394.4, "y": 62.96, "z": 0.5}, {"x": 408.89, "y": 44.12, "z": 0.5}, {"x": 426.26, "y": 11.66, "z": 0.5}, {"x": 442.62, "y": -22.2, "z": 0.5}, {"x": 451.31, "y": -48.09, "z": 0.5}, {"x": 460.82, "y": -84.45, "z": 0.5}, {"x": 470.72, "y": -133.82, "z": 0.5}, {"x": 476.1, "y": -168.82, "z": 0.5}, {"x": 476.91, "y": -194.31, "z": 0.5}, {"x": 477.11, "y": -226.76, "z": 0.5}, {"x": 477.11, "y": -253.4, "z": 0.5}, {"x": 477.11, "y": -270.07, "z": 0.5}, {"x": 477.11, "y": -281.58, "z": 0.5}, {"x": 477.11, "y": -294.26, "z": 0.5}, {"x": 477.11, "y": -301.04, "z": 0.5}, {"x": 477.11, "y": -307.49, "z": 0.5}, {"x": 476.56, "y": -309.1, "z": 0.5}, {"x": 471.68, "y": -308.16, "z": 0.5}, {"x": 459.65, "y": -290.71, "z": 0.5}, {"x": 443.67, "y": -245.77, "z": 0.5}, {"x": 436.56, "y": -212.17, "z": 0.5}, {"x": 429.29, "y": -139.54, "z": 0.5}, {"x": 429.29, "y": -110.28, "z": 0.5}, {"x": 429.29, "y": -83.24, "z": 0.5}, {"x": 429.29, "y": -56.85, "z": 0.5}, {"x": 429.29, "y": -40.75, "z": 0.5}, {"x": 429.29, "y": -18.89, "z": 0.5}, {"x": 429.29, "y": 0.64, "z": 0.5}, {"x": 429.29, "y": 11.32, "z": 0.5}, {"x": 429.77, "y": 21.18, "z": 0.5}, {"x": 432.8, "y": 29.78, "z": 0.5}, {"x": 436.76, "y": 34.87, "z": 0.5}, {"x": 441.76, "y": 35.29, "z": 0.5}, {"x": 449.53, "y": 35.35, "z": 0.5}, {"x": 462.05, "y": 32.07, "z": 0.5}, {"x": 478.95, "y": 21.18, "z": 0.5}, {"x": 511.53, "y": -13.76, "z": 0.5}, {"x": 540.17, "y": -54.49, "z": 0.5}, {"x": 579.16, "y": -123.24, "z": 0.5}, {"x": 602.7, "y": -193.32, "z": 0.5}, {"x": 607.93, "y": -223.68, "z": 0.5}, {"x": 608.87, "y": -249.21, "z": 0.5}, {"x": 609.25, "y": -301.15, "z": 0.5}, {"x": 605.23, "y": -333.77, "z": 0.5}, {"x": 599.51, "y": -351.64, "z": 0.5}, {"x": 598.03, "y": -355.09, "z": 0.5}, {"x": 596.48, "y": -357.85, "z": 0.5}, {"x": 595.28, "y": -359.74, "z": 0.5}, {"x": 594.47, "y": -360.26, "z": 0.5}, {"x": 593.66, "y": -360.62, "z": 0.5}, {"x": 592.85, "y": -360.62, "z": 0.5}, {"x": 591.09, "y": -359.15, "z": 0.5}, {"x": 588.54, "y": -353.26, "z": 0.5}, {"x": 585.56, "y": -342.16, "z": 0.5}, {"x": 580.77, "y": -320.37, "z": 0.5}, {"x": 576.71, "y": -299.22, "z": 0.5}, {"x": 572.9, "y": -255.26, "z": 0.5}, {"x": 571.95, "y": -236.13, "z": 0.5}, {"x": 571.24, "y": -216.99, "z": 0.5}, {"x": 570.42, "y": -193.57, "z": 0.5}, {"x": 570.08, "y": -154.01, "z": 0.5}, {"x": 571.82, "y": -121.14, "z": 0.5}, {"x": 578.2, "y": -107.71, "z": 0.5}, {"x": 587.19, "y": -95.83, "z": 0.5}, {"x": 593.67, "y": -89.33, "z": 0.5}, {"x": 603.72, "y": -81.43, "z": 0.5}, {"x": 614.27, "y": -74.61, "z": 0.5}, {"x": 622.34, "y": -72.62, "z": 0.5}, {"x": 637.9, "y": -71.25, "z": 0.5}, {"x": 641.71, "y": -71.98, "z": 0.5}, {"x": 648.6, "y": -77.76, "z": 0.5}, {"x": 654.89, "y": -86.44, "z": 0.5}, {"x": 659.88, "y": -98.69, "z": 0.5}, {"x": 664.27, "y": -113.32, "z": 0.5}, {"x": 667.08, "y": -126.76, "z": 0.5}, {"x": 669.3, "y": -137.21, "z": 0.5}, {"x": 670.11, "y": -146.64, "z": 0.5}, {"x": 670.31, "y": -157, "z": 0.5}, {"x": 670.31, "y": -165.48, "z": 0.5}, {"x": 670.31, "y": -171.94, "z": 0.5}, {"x": 670.31, "y": -176.14, "z": 0.5}, {"x": 669.52, "y": -176.43, "z": 0.5}, {"x": 668.5, "y": -176.21, "z": 0.5}, {"x": 666.56, "y": -173.87, "z": 0.5}, {"x": 662.48, "y": -162.94, "z": 0.5}, {"x": 657.9, "y": -130.75, "z": 0.5}, {"x": 657.65, "y": -97.77, "z": 0.5}, {"x": 660.39, "y": -66, "z": 0.5}, {"x": 664.25, "y": -59.39, "z": 0.5}, {"x": 668.41, "y": -54.67, "z": 0.5}, {"x": 674.49, "y": -49.35, "z": 0.5}, {"x": 681.73, "y": -46.12, "z": 0.5}, {"x": 688.16, "y": -44.64, "z": 0.5}, {"x": 694.27, "y": -47.26, "z": 0.5}, {"x": 703.56, "y": -55.62, "z": 0.5}, {"x": 712.97, "y": -67.36, "z": 0.5}, {"x": 722.29, "y": -81.34, "z": 0.5}, {"x": 732.56, "y": -99.94, "z": 0.5}, {"x": 742.02, "y": -119.57, "z": 0.5}, {"x": 751.52, "y": -139.51, "z": 0.5}, {"x": 758.96, "y": -158.62, "z": 0.5}, {"x": 763.18, "y": -176.55, "z": 0.5}, {"x": 768.19, "y": -206.66, "z": 0.5}, {"x": 768.19, "y": -216.44, "z": 0.5}, {"x": 767.63, "y": -228.01, "z": 0.5}, {"x": 755.77, "y": -246.24, "z": 0.5}, {"x": 741.17, "y": -254.16, "z": 0.5}, {"x": 726.12, "y": -258.15, "z": 0.5}, {"x": 713.21, "y": -258.33, "z": 0.5}, {"x": 707.33, "y": -257.78, "z": 0.5}, {"x": 703.17, "y": -255.83, "z": 0.5}, {"x": 697.78, "y": -244.08, "z": 0.5}, {"x": 696.9, "y": -238.9, "z": 0.5}, {"x": 695.53, "y": -230.99, "z": 0.5}, {"x": 695.03, "y": -224.28, "z": 0.5}, {"x": 695.03, "y": -218.53, "z": 0.5}, {"x": 695.03, "y": -213.22, "z": 0.5}, {"x": 695.03, "y": -209.11, "z": 0.5}, {"x": 696.74, "y": -205.12, "z": 0.5}, {"x": 705.68, "y": -201.61, "z": 0.5}, {"x": 728.97, "y": -199.46, "z": 0.5}, {"x": 756.46, "y": -199.11, "z": 0.5}, {"x": 809.78, "y": -207.05, "z": 0.5}, {"x": 832.62, "y": -215.45, "z": 0.5}, {"x": 858.15, "y": -226.16, "z": 0.5}, {"x": 887.87, "y": -239.93, "z": 0.5}]}], "isComplete": true}, "opacity": 1, "isLocked": false, "parentId": "page:page", "rotation": 0, "typeName": "shape"}}, "schema": {"sequences": {"com.tldraw.page": 1, "com.tldraw.asset": 1, "com.tldraw.shape": 4, "com.tldraw.store": 4, "com.tldraw.camera": 1, "com.tldraw.pointer": 1, "com.tldraw.document": 2, "com.tldraw.instance": 25, "com.tldraw.shape.geo": 9, "com.tldraw.shape.draw": 2, "com.tldraw.shape.line": 5, "com.tldraw.shape.note": 8, "com.tldraw.shape.text": 2, "com.tldraw.asset.image": 5, "com.tldraw.asset.video": 5, "com.tldraw.shape.arrow": 5, "com.tldraw.shape.embed": 4, "com.tldraw.shape.frame": 0, "com.tldraw.shape.group": 0, "com.tldraw.shape.image": 4, "com.tldraw.shape.video": 2, "com.tldraw.binding.arrow": 0, "com.tldraw.asset.bookmark": 2, "com.tldraw.shape.bookmark": 2, "com.tldraw.shape.highlight": 1, "com.tldraw.instance_presence": 6, "com.tldraw.instance_page_state": 5}, "schemaVersion": 2}}}', '5593', 'closed', NULL, '2025-03-21 10:36:27.732992+00', '2025-03-21 10:41:26.324+00');


--
-- Data for Name: room_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."room_events" ("id", "timestamp", "type", "payload", "room_id") VALUES
	(1, '2025-03-21 10:40:28.337861+00', 'start poll', '{"activityId":"2"}', 1),
	(2, '2025-03-21 10:40:31.027483+00', 'end poll', '{"startEventId":"1","answers":[]}', 1),
	(3, '2025-03-21 10:41:06.191197+00', 'start poll', '{"activityId":"2"}', 1),
	(4, '2025-03-21 10:41:21.502097+00', 'end poll', '{"startEventId":"3","answers":[{"choiceId":"choice-1742553360806-1155","questionId":"question-01","timestamp":1742553668543,"userId":"e10286ef-b820-4ff5-95ca-6c647009d163"},{"choiceId":"choice-1742553362822-1772","questionId":"question-01","timestamp":1742553670281,"userId":"7310822a-f760-4af0-92e9-d18d9939aaf5"},{"choiceId":"choice-1742553362822-1772","questionId":"question-01","timestamp":1742553672023,"userId":"bd745bf6-b800-4b3e-b121-b44baa80de59"},{"choiceId":"choice-1742553374383-9433","questionId":"question-1742553364472-2114","timestamp":1742553676051,"userId":"7310822a-f760-4af0-92e9-d18d9939aaf5"},{"choiceId":"choice-1742553374383-9433","questionId":"question-1742553364472-2114","timestamp":1742553677941,"userId":"e10286ef-b820-4ff5-95ca-6c647009d163"},{"choiceId":"choice-1742553375338-4229","questionId":"question-1742553364472-2114","timestamp":1742553679153,"userId":"bd745bf6-b800-4b3e-b121-b44baa80de59"}]}', 1);


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('capsules_files', 'capsules_files', NULL, '2025-03-21 09:28:18.576162+00', '2025-03-21 09:28:18.576162+00', true, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 4, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."activities_id_seq"', 2, true);


--
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."attendance_id_seq"', 3, true);


--
-- Name: room_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."room_events_id_seq"', 4, true);


--
-- Name: rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."rooms_id_seq"', 1, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
