"use client";

import { useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useBusiness } from "@/features/business/context/BusinessContext";
import { createService } from "@/features/services/services/createService";
import { useServices } from "@/features/services/hooks/useServices";
import { deleteService } from "@/features/services/services/deleteService";
import { updateService } from "@/features/services/services/updateService";

export default function ServicesPage() {
  const { user } = useAuth();
  const { activeBusinessId } = useBusiness();
  const { services, loading, refetchServices } =
    useServices(activeBusinessId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [editingServiceId, setEditingServiceId] =
    useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    setError("");
    event.preventDefault();

    if (!activeBusinessId || !user) {
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
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
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
    setError("");

    try {
      await deleteService(serviceId);
      await refetchServices();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <main className="services-page">
      <header className="page-header">
        <div>
          <h1>Services</h1>
          <p>Create and manage the services you offer.</p>
        </div>
      </header>

      <div className="services-layout">
        <section className="service-form-card">
          <h2>
            {editingServiceId
              ? "Edit Service"
              : "Create a Service"}
          </h2>
          {error && <p className="form-error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="service-name">Name</label>
            <input
              id="service-name"
              type="text"
              placeholder="Service name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />

            <label htmlFor="service-description">
              Description
            </label>
            <textarea
              id="service-description"
              placeholder="Describe your service"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
            />

            <label htmlFor="service-price">Price</label>
            <input
              id="service-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Price"
              value={price}
              onChange={(event) =>
                setPrice(event.target.value)
              }
              required
            />

            <label htmlFor="service-duration">
              Duration
            </label>
            <input
              id="service-duration"
              type="number"
              min="1"
              placeholder="Duration in minutes"
              value={durationMinutes}
              onChange={(event) =>
                setDurationMinutes(event.target.value)
              }
              required
            />

            <button type="submit">
              {editingServiceId
                ? "Update Service"
                : "Create Service"}
            </button>

            {editingServiceId && (
              <button
                type="button"
                onClick={() => {
                  setEditingServiceId(null);
                  setName("");
                  setDescription("");
                  setPrice("");
                  setDurationMinutes("");
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </section>

        <section className="services-list">
          <h2>Your Services</h2>

          {loading && <p>Loading services...</p>}

          {!loading && services.length === 0 && (
            <div className="empty-state">
              <h3>No services yet</h3>
              <p>
                Create your first service to start accepting
                bookings.
              </p>
            </div>
          )}

          {!loading &&
            services.map((service) => (
              <article
                key={service.id}
                className="service-card"
              >
                <div className="service-card-main">
                  <div>
                    <h3>{service.name}</h3>

                    {service.description && (
                      <p>{service.description}</p>
                    )}
                  </div>

                  <div className="service-meta">
                    <strong>${service.price}</strong>
                    <span>
                      {service.duration_minutes} min
                    </span>
                  </div>
                </div>

                <div className="service-actions">
                  <button
                    type="button"
                    onClick={() => handleEdit(service)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(service.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
        </section>
      </div>
    </main>
  );
}