ALTER TABLE "public"."attendance"
ADD CONSTRAINT unique_attendance_for_user_in_room UNIQUE ("user_id", "room_id");
-- Dummy comment to force a new migration