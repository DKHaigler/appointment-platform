"use client";

import { useState } from "react";
import { createBusiness } from "@/features/auth/services/createBusiness";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function OnboardingPage() {
    const { user } = useAuth();

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setError("");

      if (!user) {
        return;
      }

      setLoading(true);

      try {
          await createBusiness(name, slug, user.id);
          setSuccess(true);
        }catch (error) {
            if (error instanceof Error) {
              setError(error.message);
            }
        }finally {
            setLoading(false);
        }
    }

    if (success) {
      return (
        <main>
          <h1>Business Created</h1>
          <p>Your business has been created successfully.</p>
        </main>
      );
    }

    return(
        <>
        <p>{user ? `Logged in as ${user.email}` : "Not logged in"}</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Business Name</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            />

          <label htmlFor="slug">Business URL</label>

          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            />
            {error && <p>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Creating Business..." : "Create Business"}
          </button>
        </form>

        </>
    )

}