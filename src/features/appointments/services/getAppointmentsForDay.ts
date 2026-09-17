import { supabase } from "@/lib/supabase";

export async function getAppointmentsForDay(
  businessId: string,
  startOfDay: string,
  endOfDay: string
) {
  const { data, error } = await supabase
    .from("appointments")
    .select("start_time, end_time")
    .eq("business_id", businessId)
    .lt("start_time", endOfDay)
    .gt("end_time", startOfDay)
    .neq("status", "cancelled");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}