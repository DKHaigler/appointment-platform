import { supabase } from "@/lib/supabase";

export async function updateService(
  serviceId: string,
  name: string,
  description: string,
  price: number,
  durationMinutes: number
) {
    if (!name.trim()) {
      throw new Error("Service name is required.");
    }
    
    if (price < 0) {
      throw new Error("Price cannot be negative.");
    }
    
    if (durationMinutes <= 0) {
      throw new Error("Duration must be greater than 0 minutes.");
    }
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