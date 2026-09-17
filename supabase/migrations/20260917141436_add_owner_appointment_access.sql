create policy "Business owners can view their appointments"
on public.appointments
for select
to authenticated
using (
  exists (
    select 1
    from public.businesses
    where businesses.id = appointments.business_id
      and businesses.owner_id = auth.uid()
  )
);