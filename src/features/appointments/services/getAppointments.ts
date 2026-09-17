import { supabase } from "@/lib/supabase";

export async function getAppointments(businessId: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select(`
      *,
      services (
        name,
        duration_minutes,
        price
      )
    `)
    .eq("business_id", businessId)
    .order("start_time", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}