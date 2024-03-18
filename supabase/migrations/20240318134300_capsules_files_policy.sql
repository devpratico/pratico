create policy "Authenticated users can only modify their folders"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'capsules_files'::text) AND (auth.role() = 'authenticated'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));