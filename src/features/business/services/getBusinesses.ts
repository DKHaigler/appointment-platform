import { supabase } from "@/lib/supabase";

export async function getBusinesses(userId: string) {
    const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", userId);
        if (error) {
          throw new Error(error.message);
        }
        
        return data;
}