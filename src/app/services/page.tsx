"use client";

import { useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useBusinesses } from "@/features/business/hooks/useBusinesses";
import { useBusiness } from "@/features/business/context/BusinessContext";
import { createService } from "@/features/services/services/createService";
import { useServices } from "@/features/services/hooks/useServices";
import { deleteService } from "@/features/services/services/deleteService";
import { updateService } from "@/features/services/services/updateService";

export default function ServicesPage() {
    const { user } = useAuth();
    const { businesses } = useBusinesses(user?.id ?? null);
    const { activeBusinessId } = useBusiness();
    const { services, loading, refetchServices } = useServices(activeBusinessId);
    

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [durationMinutes, setDurationMinutes] = useState("");
    const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
    
    
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      if (!activeBusinessId) {
        return;
      }

      try {
        if (editingServiceId) {
          await updateService(
            editingServiceId,
            name,
            description,
            Number(price),
            Number(durationMinutes)
          );
        } else {
          await createService(
            activeBusinessId,
            name,
            description,
            Number(price),
            Number(durationMinutes)
          );
        }

        await refetchServices();

        setName("");
        setDescription("");
        setPrice("");
        setDurationMinutes("");
        setEditingServiceId(null);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }

    function handleEdit(service: any) {
      setEditingServiceId(service.id);
      setName(service.name);
      setDescription(service.description ?? "");
      setPrice(String(service.price));
      setDurationMinutes(String(service.duration_minutes));
    }

    async function handleDelete(serviceId: string) {
      try {
        await deleteService(serviceId);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
      await deleteService(serviceId);
      await refetchServices();
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

      <button type="submit">
        {editingServiceId ? "Update Service" : "Create Service"}
      </button>
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
            <button type="button" onClick={() => handleEdit(service)}>
              Edit
            </button>

            <button type="button" onClick={() => handleDelete(service.id)}>
              Delete
            </button>
          </div>
        ))}
        
    </section>
  </main>
);
}
