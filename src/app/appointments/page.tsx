"use client";

import { useBusiness } from "@/features/business/context/BusinessContext";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import { updateAppointmentStatus } from "@/features/appointments/services/updateAppointments"; 

export default function AppointmentsPage() {
  const { activeBusinessId } = useBusiness();
  const { appointments, loading, refetchAppointments } = useAppointments(activeBusinessId);

  async function handleStatusChange(
    appointmentId: string,
    status: string
  ) {
    await updateAppointmentStatus(appointmentId, status);
  
    await refetchAppointments();
  }

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
          <p>Service: {appointment.services?.name}</p>
          <p>
            Date:{" "}
            {new Date(appointment.start_time).toLocaleDateString()}
          </p>
          <p>
            Time:{" "}
            {new Date(appointment.start_time).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
          <p>Email: {appointment.client_email}</p>
          {appointment.client_phone && (
            <p>Phone: {appointment.client_phone}</p>
          )}        
          <p>Status: {appointment.status}</p>
          <button
            type="button"
            onClick={() =>
              handleStatusChange(appointment.id, "confirmed")
            }
          >
            Confirm
          </button>
        
          <button
            type="button"
            onClick={() =>
              handleStatusChange(appointment.id, "cancelled")
            }
          >
            Cancel
          </button>
        </div>
        ))
      )}
    </main>
  );
}