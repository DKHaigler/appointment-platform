create policy "Anyone can view businesses by slug"
on public.businesses
for select
to anon
using (true);