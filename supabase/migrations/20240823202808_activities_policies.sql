create policy "Anyone authenticated can insert"
on "public"."activities"
as permissive
for insert
to authenticated
with check (true);


create policy "Anyone authenticated can query"
on "public"."activities"
as permissive
for select
to authenticated
using (true);


create policy "Only creator can delete"
on "public"."activities"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = created_by));


create policy "Only creator can update"
on "public"."activities"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = created_by));



