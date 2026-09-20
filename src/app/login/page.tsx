"use client";

import { useState, useEffect } from "react";
import { login } from "@/features/auth/services/login";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getBusinesses } from "@/features/business/services/getBusinesses";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuth();



  useEffect(() => {
  async function redirectUser() {
      if (!user) return;
  
      const businesses = await getBusinesses(user.id);
  
      if (businesses.length === 0) {
        window.location.href = "/onboarding";
        return;
      }
  
      window.location.href = "/dashboard";
    }
  
    redirectUser();
  }, [user]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <h1>Welcome back</h1>

          <p>
            Log in to manage your appointments and business.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>

            <input
              className="form-input"
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>

            <input
              className="form-input"
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          {error && (
            <p className="form-error">{error}</p>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </main>
  );
}