import { supabase } from "@/lib/supabase";

export async function getBusinessBySlug(slug: string) {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}