create policy "Business owners can create their own services"
on public.services
for insert
to authenticated
with check (
  exists (
    select 1
    from public.businesses
    where businesses.id = services.business_id
      and businesses.owner_id = auth.uid()
  )
);