create policy "Users can view their own businesses"
on public.businesses
for select
to authenticated
using (owner_id = auth.uid());