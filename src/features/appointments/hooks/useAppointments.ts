import { useEffect, useState } from "react";
import { getAppointments } from "../services/getAppointments";

export function useAppointments(businessId: string | null) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAppointments() {
    if (!businessId) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const data = await getAppointments(businessId);

    setAppointments(data);
    setLoading(false);
  }

  useEffect(() => {
    loadAppointments();
  }, [businessId]);

  return {
    appointments,
    loading,
    refetchAppointments: loadAppointments,
  };
}