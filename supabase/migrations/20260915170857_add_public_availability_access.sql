create policy "Anyone can view availability"
on public.availability
for select
to anon
using (true);