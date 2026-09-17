import { supabase } from "@/lib/supabase";
import type { Availability } from "../types/availability";

export async function getAvailabilityForDay(
  businessId: string,
  dayOfWeek: number
): Promise<Availability | null> {
  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .eq("business_id", businessId)
    .eq("day_of_week", dayOfWeek)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}