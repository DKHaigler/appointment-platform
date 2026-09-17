import { supabase } from "@/lib/supabase";

export async function updateAppointmentStatus(
  appointmentId: string,
  status: string
) {
  const { error } = await supabase
    .from("appointments")
    .update({
      status,
    })
    .eq("id", appointmentId);

  if (error) {
    throw new Error(error.message);
  }
}
