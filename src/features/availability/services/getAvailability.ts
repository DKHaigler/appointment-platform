import { supabase } from "@/lib/supabase";
import type { Availability } from "../types/availability";

export async function getAvailability(
  businessId: string
): Promise<Availability[]> {
  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .eq("business_id", businessId)
    .order("day_of_week");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}