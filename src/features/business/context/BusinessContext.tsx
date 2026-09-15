"use client";

import { createContext, useContext, useState, useEffect } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useBusinesses } from "../hooks/useBusinesses";

type BusinessContextType = {
  activeBusinessId: string | null;
  setActiveBusinessId: (id: string | null) => void;
};

export const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined
);

type BusinessProviderProps = {
  children: React.ReactNode;
};

export function BusinessProvider({ children }: BusinessProviderProps) {
    const { user } = useAuth();
    const { businesses } = useBusinesses(user?.id ?? null);

    const [activeBusinessId, setActiveBusinessId] = useState<string | null>(null);

    useEffect(() => {
      if (businesses.length > 0 && !activeBusinessId) {
        setActiveBusinessId(businesses[0].id);
      }
    }, [businesses, activeBusinessId]);

    return (
      <BusinessContext.Provider
        value={{ activeBusinessId, setActiveBusinessId }}
      >
        {children}
      </BusinessContext.Provider>
);
}

export function useBusiness() {
  const context = useContext(BusinessContext);

  if (!context) {
    throw new Error("useBusiness must be used within BusinessProvider");
  }

  return context;
}