create policy "Users can create their own businesses"
on public.businesses
for insert
to authenticated
with check (owner_id = auth.uid());