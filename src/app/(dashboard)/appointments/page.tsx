"use client";

import { useBusiness } from "@/features/business/context/BusinessContext";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import { updateAppointmentStatus } from "@/features/appointments/services/updateAppointments"; 

export default function AppointmentsPage() {
  const { activeBusinessId } = useBusiness();

  const {
    appointments,
    loading,
    refetchAppointments,
  } = useAppointments(activeBusinessId);

  async function handleStatusChange(
    appointmentId: string,
    status: string
  ) {
    await updateAppointmentStatus(appointmentId, status);
    await refetchAppointments();
  }

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  return (
    <section className="appointments-page">
      <header className="page-header">
        <div>
          <h1>Appointments</h1>
          <p>Manage your upcoming appointments.</p>
        </div>
      </header>

      {appointments.length === 0 ? (
        <div className="empty-state">
          <h2>No appointments yet</h2>
          <p>
            Appointments from your booking page will appear here.
          </p>
        </div>
      ) : (
        <div className="appointment-list">
          {appointments.map((appointment) => (
            <article
              key={appointment.id}
              className="appointment-card"
            >
              <div className="appointment-main">
                <div>
                  <h2>{appointment.client_name}</h2>
                  <p className="appointment-service">
                    {appointment.services?.name}
                  </p>
                </div>

                <span
                  className={`status status-${appointment.status}`}
                >
                  {appointment.status}
                </span>
              </div>

              <div className="appointment-details">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(
                    appointment.start_time
                  ).toLocaleDateString()}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(
                    appointment.start_time
                  ).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {appointment.client_email}
                </p>

                {appointment.client_phone && (
                  <p>
                    <strong>Phone:</strong>{" "}
                    {appointment.client_phone}
                  </p>
                )}
              </div>

              <div className="appointment-actions">
                {appointment.status !== "confirmed" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(
                        appointment.id,
                        "confirmed"
                      )
                    }
                  >
                    Confirm
                  </button>
                )}

                {appointment.status !== "cancelled" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(
                        appointment.id,
                        "cancelled"
                      )
                    }
                  >
                    Cancel
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}