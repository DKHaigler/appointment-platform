create policy "Business owners can update their appointments"
on public.appointments
for update
to authenticated
using (
  exists (
    select 1
    from public.businesses
    where businesses.id = appointments.business_id
      and businesses.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.businesses
    where businesses.id = appointments.business_id
      and businesses.owner_id = auth.uid()
  )
);