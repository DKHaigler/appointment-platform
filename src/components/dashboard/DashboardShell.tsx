"use client";

import Link from "next/link";
import { logout } from "@/features/auth/services/logout";
import { useRouter } from "next/navigation";

type DashboardShellProps = {
  children: React.ReactNode;
};

export default function DashboardShell({
  children,
}: DashboardShellProps) {
    const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          Appointment Platform
        </div>

        <nav className="dashboard-nav">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/appointments">Appointments</Link>
          <Link href="/services">Services</Link>
          <Link href="/availability">Availability</Link>
        </nav>

        <button
          type="button"
          className="dashboard-logout"
          onClick={handleLogout}
        >
          Log out
        </button>
      </aside>

      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
}