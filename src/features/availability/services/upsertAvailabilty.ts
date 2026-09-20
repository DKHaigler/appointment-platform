import { supabase } from "@/lib/supabase";

export async function upsertAvailability(
  businessId: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  isAvailable: boolean
) {

  if (startTime >= endTime) {
    throw new Error("End time must be after start time.");
  }

  const { data, error } = await supabase
    .from("availability")
    .upsert(
      {
        business_id: businessId,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        is_available: isAvailable,
      },
      {
        onConflict: "business_id,day_of_week",
      }
    )
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}