import { useEffect, useState } from "react";
import { getAvailability } from "../services/getAvailability";
import type { Availability } from "../types/availability";

export function useAvailability(businessId: string | null) {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAvailability() {
    if (!businessId) {
      setAvailability([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const data = await getAvailability(businessId);

    setAvailability(data);
    setLoading(false);
  }

  useEffect(() => {
    loadAvailability();
  }, [businessId]);

  return {
    availability,
    loading,
    refetchAvailability: loadAvailability,
  };
}