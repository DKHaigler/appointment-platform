create policy "Business owners can view their own services"
on public.services
for select
to authenticated
using (
  exists (
    select 1
    from public.businesses
    where businesses.id = services.business_id
      and businesses.owner_id = auth.uid()
  )
);