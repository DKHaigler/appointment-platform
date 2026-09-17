create policy "Anyone can create appointments"
on public.appointments
for insert
to anon
with check (
  exists (
    select 1
    from public.services
    where services.id = appointments.service_id
      and services.business_id = appointments.business_id
  )
);