create function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
    insert into public.profiles (id)
    values (new.id);

    return new;
end;
$$;

create trigger new_user
after insert on auth.users
for each row
execute function public.handle_new_user();