"use client";

import { useBusiness } from "@/features/business/context/BusinessContext";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";

export default function AppointmentsPage() {
  const { activeBusinessId } = useBusiness();
  const { appointments, loading } = useAppointments(activeBusinessId);

  if (loading) {
    return <main>Loading appointments...</main>;
  }

  return (
    <main>
      <h1>Appointments</h1>

      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        appointments.map((appointment) => (
          <div key={appointment.id}>
            <h2>{appointment.client_name}</h2>
            <p>{appointment.client_email}</p>
            <p>{appointment.client_phone}</p>
            <p>
              {new Date(appointment.start_time).toLocaleString()}
            </p>
            <p>Status: {appointment.status}</p>
          </div>
        ))
      )}
    </main>
  );
}