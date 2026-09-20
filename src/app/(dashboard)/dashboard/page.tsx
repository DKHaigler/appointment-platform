"use client";

import Link from "next/link";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useBusinesses } from "@/features/business/hooks/useBusinesses";
import { useBusiness } from "@/features/business/context/BusinessContext";
import { useServices } from "@/features/services/hooks/useServices";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";

export default function DashboardPage() {
  const { user } = useAuth();

  const { businesses, loading: businessesLoading } =
    useBusinesses(user?.id ?? null);

  const { activeBusinessId, setActiveBusinessId } =
    useBusiness();

  const { services, loading: servicesLoading } =
    useServices(activeBusinessId);

  const { appointments, loading: appointmentsLoading } =
    useAppointments(activeBusinessId);

  const activeBusiness = businesses.find(
    (business) => business.id === activeBusinessId
  );

  const upcomingAppointments = appointments
    .filter(
      (appointment) =>
        new Date(appointment.start_time) > new Date() &&
        appointment.status !== "cancelled"
    )
    .slice(0, 5);

  if (businessesLoading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <section className="dashboard-home">
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome back. Here&apos;s what&apos;s happening
            with your business.
          </p>
        </div>

        <div className="dashboard-business-actions">
          {businesses.length > 1 && (
            <select
              value={activeBusinessId ?? ""}
              onChange={(event) =>
                setActiveBusinessId(event.target.value)
              }
            >
              {businesses.map((business) => (
                <option
                  key={business.id}
                  value={business.id}
                >
                  {business.name}
                </option>
              ))}
            </select>
          )}
        
          <Link href="/onboarding" className="btn-secondary">
            + Create Business
          </Link>
        </div>
      </header>

      {activeBusiness && (
        <section className="dashboard-business">
          <h2>{activeBusiness.name}</h2>
          <p>Your active business</p>
        </section>
      )}

      <section className="dashboard-stats">
        <article className="dashboard-stat-card">
          <span>Services</span>
          <strong>
            {servicesLoading ? "—" : services.length}
          </strong>
        </article>

        <article className="dashboard-stat-card">
          <span>Upcoming Appointments</span>
          <strong>
            {appointmentsLoading
              ? "—"
              : upcomingAppointments.length}
          </strong>
        </article>

        <article className="dashboard-stat-card">
          <span>Total Appointments</span>
          <strong>
            {appointmentsLoading
              ? "—"
              : appointments.length}
          </strong>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h2>Upcoming Appointments</h2>
            <p>Your next scheduled appointments.</p>
          </div>

          <Link href="/appointments">
            View all
          </Link>
        </div>

        {appointmentsLoading ? (
          <p>Loading appointments...</p>
        ) : upcomingAppointments.length === 0 ? (
          <div className="empty-state">
            <h3>No upcoming appointments</h3>
            <p>
              New bookings will appear here.
            </p>
          </div>
        ) : (
          <div className="dashboard-appointments">
            {upcomingAppointments.map((appointment) => (
              <article
                key={appointment.id}
                className="dashboard-appointment"
              >
                <div>
                  <h3>{appointment.client_name}</h3>
                  <p>
                    {appointment.services?.name}
                  </p>
                </div>

                <div>
                  <strong>
                    {new Date(
                      appointment.start_time
                    ).toLocaleDateString()}
                  </strong>

                  <span>
                    {new Date(
                      appointment.start_time
                    ).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <span
                  className={`status status-${appointment.status}`}
                >
                  {appointment.status}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h2>Quick Actions</h2>
            <p>Manage your business.</p>
          </div>
        </div>

        <div className="quick-actions">
          <Link href="/services">
            Manage Services
          </Link>

          <Link href="/availability">
            Manage Availability
          </Link>

          <Link href="/appointments">
            View Appointments
          </Link>
        </div>
      </section>
    </section>
  );
}