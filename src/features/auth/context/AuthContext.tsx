"use client";
import { createContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
type AuthProviderProps = {
  children: React.ReactNode;
};
export function AuthProvider({children}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  

useEffect(() => {
  async function getSession() {
    const { data } = await supabase.auth.getSession();
    
    setSession(data.session);
    setUser(data.session?.user ?? null);
    setLoading(false);
}

const {
  data: { subscription },
} = supabase.auth.onAuthStateChange((event, session) => {
    setSession(session);
  setUser(session?.user ?? null);

});
getSession();
return () => {
  subscription.unsubscribe();
};
}, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
        <div>
          {children}
        </div>
    </AuthContext.Provider>
  );
}