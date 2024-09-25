create policy "Enable read access for all users"
on "public"."attendance"
as permissive
for select
to public
using (true);



