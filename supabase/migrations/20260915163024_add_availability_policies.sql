create policy "Business owners can view their own availability"
on public.availability
for select
to authenticated
using (
  exists (
    select 1
    from public.businesses
    where businesses.id = availability.business_id
      and businesses.owner_id = auth.uid()
  )
);

create policy "Business owners can create their own availability"
on public.availability
for insert
to authenticated
with check (
  exists (
    select 1
    from public.businesses
    where businesses.id = availability.business_id
      and businesses.owner_id = auth.uid()
  )
);

create policy "Business owners can update their own availability"
on public.availability
for update
to authenticated
using (
  exists (
    select 1
    from public.businesses
    where businesses.id = availability.business_id
      and businesses.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.businesses
    where businesses.id = availability.business_id
      and businesses.owner_id = auth.uid()
  )
);

create policy "Business owners can delete their own availability"
on public.availability
for delete
to authenticated
using (
  exists (
    select 1
    from public.businesses
    where businesses.id = availability.business_id
      and businesses.owner_id = auth.uid()
  )
);