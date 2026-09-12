import { supabase } from "@/lib/supabase";

export async function createBusiness(
  name: string,
  slug: string,
  ownerId: string
) {
    const { data, error } = await supabase
  .from("businesses")
  .insert({
    name,
    slug,
    owner_id: ownerId,
  });
  if (error) {
      throw new Error(error.message);
    }

    return data;
}