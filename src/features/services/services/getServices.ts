import { supabase } from "@/lib/supabase";

export async function getServices(businessId: string) {
    const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("business_id", businessId);
        if (error) {
          throw new Error(error.message);
        }
        
        return data;
}