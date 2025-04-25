--
-- Poll activity made by test@test.com
--
INSERT INTO "public"."activities" ("id", "created_by", "created_at", "type", "object") VALUES
	(1, 'bd745bf6-b800-4b3e-b121-b44baa80de59', '2025-03-21 10:36:16.979592+00', 'poll', '{"type":"poll","schemaVersion":"3","title":"Super sondage","questions":[{"id":"question-01","text":"Super question A","choices":[{"id":"choice-1742553360806-1155","text":"Réponse 1"},{"id":"choice-1742553362822-1772","text":"Réponse 2"}]},{"id":"question-1742553364472-2114","text":"Autre question (B)","choices":[{"id":"choice-1742553374383-9433","text":"Réponse 11"},{"id":"choice-1742553375338-4229","text":"22"}]}]}');

--
-- Update pg serial sequence
--
SELECT setval(pg_get_serial_sequence('public.activities', 'id'), (SELECT MAX(id) FROM public.activities));