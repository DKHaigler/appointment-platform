"use client";

import { useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useBusinesses } from "@/features/business/hooks/useBusinesses";
import { useBusiness } from "@/features/business/context/BusinessContext";
import { createService } from "@/features/services/services/createService";
import { useServices } from "@/features/services/hooks/useServices";

export default function ServicesPage() {
    const { user } = useAuth();
    const { businesses } = useBusinesses(user?.id ?? null);
    const { activeBusinessId } = useBusiness();
    const { services, loading } = useServices(activeBusinessId);
    

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [durationMinutes, setDurationMinutes] = useState("");
    
    
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      if (!activeBusinessId) {
        return;
      }

      console.log("creating service", {
  activeBusinessId,
  name,
  description,
  price,
  durationMinutes,
});

      try {
        await createService(
          activeBusinessId,
          name,
          description,
          Number(price),
          Number(durationMinutes)
        );
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }

    return (
  <main>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Service name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
      />

      <input
        type="number"
        placeholder="Duration in minutes"
        value={durationMinutes}
        onChange={(event) => setDurationMinutes(event.target.value)}
      />

      <button type="submit">Create Service</button>
    </form>
    <section>
      <h2>Your Services</h2>

      {loading && <p>Loading services...</p>}

      {!loading && services.length === 0 && (
        <p>No services created yet.</p>
      )}

      {!loading &&
        services.map((service) => (
          <div key={service.id}>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <p>${service.price}</p>
            <p>{service.duration_minutes} minutes</p>
          </div>
        ))}
    </section>
  </main>
);
}
