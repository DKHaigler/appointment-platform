"use client";
import { useState, useEffect } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useBusinesses } from "@/features/business/hooks/useBusinesses";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { businesses, loading } = useBusinesses(user?.id ?? null);

  const [activeBusinessId, setActiveBusinessId] = useState<string | null>(null);

  useEffect(() => {
    if (businesses.length > 0 && !activeBusinessId) {
      setActiveBusinessId(businesses[0].id);
    }
  }, [businesses, activeBusinessId]);


  return (
    <main>
      {loading && <p>Loading businesses...</p>}

      {businesses.map((business) => (
        <button
          key={business.id}
          onClick={() => setActiveBusinessId(business.id)}
        >
          {business.name}
        </button>
      ))}
      <p>Active business: {activeBusinessId}</p>
    </main>
  );
}