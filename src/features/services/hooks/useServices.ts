import { useEffect, useState } from "react";
import { getServices } from "../services/getServices";

export function useServices(businessId: string | null) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadServices() {
    if (!businessId) {
      setServices([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const data = await getServices(businessId);

    setServices(data);
    setLoading(false);
  }

  useEffect(() => {
    loadServices();
  }, [businessId]);

  return {
    services,
    loading,
    refetchServices: loadServices,
  };
}