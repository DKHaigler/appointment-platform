"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { createBusiness } from "@/features/auth/services/createBusiness"; 

export default function OnboardingPage() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!user) return;

    setError("");
    setLoading(true);

    try {
      await createBusiness(name, slug, user.id);

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

  if (success) {
    return (
      <main className="auth-page">
        <div className="auth-card auth-success">
          <h1>Business created</h1>

          <p>
            Your business has been created successfully.
          </p>

          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Go to dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <h1>Set up your business</h1>

          <p>
            Let&apos;s get your business set up so you can
            start accepting appointments.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label
              htmlFor="business-name"
              className="form-label"
            >
              Business Name
            </label>

            <input
              id="business-name"
              className="form-input"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Your Business Name"
              required
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="business-slug"
              className="form-label"
            >
              Booking URL
            </label>

            <input
              id="business-slug"
              className="form-input"
              type="text"
              value={slug}
              onChange={(event) =>
                setSlug(event.target.value)
              }
              placeholder="Your-Business"
              required
            />

            <p className="form-help">
              Your customers will use this to book
              appointments with you.
            </p>
          </div>

          {error && (
            <p className="form-error">{error}</p>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? "Creating Business..."
              : "Create Business"}
          </button>
        </form>
      </div>
    </main>
  );
}