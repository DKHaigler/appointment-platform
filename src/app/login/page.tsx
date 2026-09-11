"use client";

import { useState, useEffect } from "react";
import { login } from "@/features/auth/services/login";

import { useAuth } from "@/features/auth/hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user, session, loading: authLoading } = useAuth();

  useEffect(() => {
      if (user) {
        window.location.href = "/dashboard";
      }
    }, [user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
        await login(email, password);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    }

  return (
    <>
        <p>{user ? `Logged in as ${user.email}` : "Not logged in"}</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            />

          {error && <p>{error}</p>}

          <button type="submit">
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
    </>
  );
}