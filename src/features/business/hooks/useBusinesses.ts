import { useEffect, useState } from "react";
import { getBusinesses } from "../services/getBusinesses";

export function useBusinesses(userId: string | null) {
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function loadBusinesses() {
        if (!userId) {
          setLoading(false);
          return;
        }
        const data = await getBusinesses(userId);

        setBusinesses(data);
        setLoading(false);
      }

      loadBusinesses();
    }, [userId]);
    
    
    return {
      businesses,
      loading,
    };
}