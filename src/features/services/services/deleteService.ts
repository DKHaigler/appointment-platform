import { supabase } from "@/lib/supabase";

export async function deleteService(serviceId: string) {
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", serviceId);

  if (error) {
    throw new Error(error.message);
  }
}