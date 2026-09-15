import { useEffect, useState } from "react";
import { getServices } from "../services/getServices";

export function useServices(businessId: string | null) {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function loadServices() {
        if (!businessId) {
          setLoading(false);
          return;
        }
        console.log("Fetching services for:", businessId);
        const data = await getServices(businessId);

        setServices(data);
        setLoading(false);
      }

      loadServices();
    }, [businessId]);
    
    
    return {
      services,
      loading,
    };
}