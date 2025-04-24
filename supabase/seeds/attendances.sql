--
-- Attendences for the room 1
--
INSERT INTO "public"."attendance" ("id", "created_at", "room_id", "user_id", "first_name", "last_name", "additional_info") VALUES
	(1, '2025-03-21 10:37:18.078452+00', 1, 'ef0e0a37-ee20-49ca-869b-23bbffdb39fe', 'John', 'Appleseed', ''),
	(2, '2025-03-21 10:39:52.55217+00', 1, '7310822a-f760-4af0-92e9-d18d9939aaf5', 'Tom', 'Smith', ''),
	(3, '2025-03-21 10:40:59.458988+00', 1, 'e10286ef-b820-4ff5-95ca-6c647009d163', 'Alice', 'Doe', '');


--
-- Update pg serial sequence
--
SELECT setval(pg_get_serial_sequence('public.attendance', 'id'), (SELECT MAX(id) FROM public.attendance));