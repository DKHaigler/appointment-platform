"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { signUp } from "@/features/auth/services/signup";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, fullName);
      setSuccess(true);
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

  async function handleCheckConfirmation() {
    setError("");
  
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (user?.email_confirmed_at) {
      window.location.href = "/dashboard";
      return;
    }
  
    setError("Your email has not been confirmed yet.");
  }

  if (success) {
    return (
      <main className="auth-page">
        <div className="auth-card auth-success">
          <h1>Check your email</h1>
  
          <p>
            We sent a confirmation link to {email}. Please
            verify your email to finish creating your account.
          </p>
  
          <button
            type="button"
            className="btn-primary"
            onClick={handleCheckConfirmation}
          >
            I&apos;ve confirmed my email
          </button>
  
          {error && (
            <p className="form-error">{error}</p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <h1>Create your account</h1>

          <p>
            Create your account to start managing your
            appointments.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>

            <input
              className="form-input"
              id="fullName"
              name="fullName"
              type="text"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>

            <input
              className="form-input"
              id="email"
              name="email"
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
              name="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="confirmPassword"
              className="form-label"
            >
              Confirm Password
            </label>

            <input
              className="form-input"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}