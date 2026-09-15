"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useBusinesses } from "@/features/business/hooks/useBusinesses";

import { useBusiness } from "@/features/business/context/BusinessContext";

import Link from "next/link";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { businesses, loading } = useBusinesses(user?.id ?? null);
  
  const { activeBusinessId, setActiveBusinessId } = useBusiness();



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
      <Link href="/services">Manage Services</Link>
    </main>
  );
}