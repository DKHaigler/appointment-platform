create policy "Anyone can view services"
on public.services
for select
to anon
using (true);