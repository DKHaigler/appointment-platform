alter table public.availability
add constraint availability_business_day_unique
unique (business_id, day_of_week);