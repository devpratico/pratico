drop policy "Authenticated users can only modify their folders" on "storage"."objects";

create policy "Give users access to own folder 14n8dem_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'capsules_files'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder 14n8dem_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'capsules_files'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder 14n8dem_2"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'capsules_files'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder 14n8dem_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'capsules_files'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



