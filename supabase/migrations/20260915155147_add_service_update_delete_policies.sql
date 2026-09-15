create policy "Business owners can update their own services"
on public.services
for update
to authenticated
using (
  exists (
    select 1
    from public.businesses
    where businesses.id = services.business_id
      and businesses.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.businesses
    where businesses.id = services.business_id
      and businesses.owner_id = auth.uid()
  )
);

create policy "Business owners can delete their own services"
on public.services
for delete
to authenticated
using (
  exists (
    select 1
    from public.businesses
    where businesses.id = services.business_id
      and businesses.owner_id = auth.uid()
  )
);