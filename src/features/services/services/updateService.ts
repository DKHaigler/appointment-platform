import { supabase } from "@/lib/supabase";

export async function updateService(
  serviceId: string,
  name: string,
  description: string,
  price: number,
  durationMinutes: number
) {
  const { data, error } = await supabase
    .from("services")
    .update({
      name,
      description,
      price,
      duration_minutes: durationMinutes,
    })
    .eq("id", serviceId)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}