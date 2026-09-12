import { supabase } from "@/lib/supabase";

export async function createService(
  businessId: string,
  name: string,
  description: string,
  price: number,
  durationMinutes: number
) {
    const { data, error } = await supabase
  .from("services")
  .insert({
    business_id: businessId,
    name,
    description,
    price,
    duration_minutes: durationMinutes,
  });
    if (error) {
      throw new Error(error.message);
    }

    return data;
}