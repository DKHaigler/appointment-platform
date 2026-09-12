"use client";

import { useState } from "react";
import { createBusiness } from "@/features/auth/services/createBusiness";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function OnboardingPage() {
    const { user } = useAuth();

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      if (!user) {
        return;
      }

      await createBusiness(name, slug, user.id);
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

          <button type="submit">
            Create Business
          </button>
        </form>

        </>
    )

}