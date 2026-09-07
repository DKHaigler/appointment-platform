import { supabase } from "@/lib/supabase";

export async function signUp(email: string, password: string, fullName:string) {
    const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: {
            fullName
        }
    }
  });
  if (error) {
  throw new Error(error.message);
}
return data;
}