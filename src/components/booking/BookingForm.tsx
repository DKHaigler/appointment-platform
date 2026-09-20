"use client";

import { useState } from "react";
import { getAvailabilityForDay } from "@/features/availability/services/getAvailabilityForDay";
import { generateTimeSlots } from "@/features/availability/utils/generateTimeSlots";
import { createAppointment } from "@/features/appointments/services/createAppointments";
import { getAppointmentsForDay } from "@/features/appointments/services/getAppointmentsForDay"; 

type BookingFormProps = {
  businessId: string;
  services: any[];
};


export default function BookingForm({ businessId, services }: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [error, setError] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  async function handleDateChange(date: string) {
    setSelectedDate(date);
  
    updateTimeSlots(date, selectedServiceId);
  }

  async function updateTimeSlots(
    date: string,
    serviceId: string
  ) {
    setTimeSlots([]);
    setSelectedTime("");
  
    if (!date || !serviceId) return;
    
    setLoadingSlots(true);

    try {
      // existing updateTimeSlots code goes here
    } finally {
      setLoadingSlots(false);
    }

  
    const dayOfWeek = new Date(`${date}T00:00:00`).getDay();
  
    const availability = await getAvailabilityForDay(
      businessId,
      dayOfWeek
    );
  
    if (!availability || !availability.is_available) {
      return;
    }
  
    const selectedService = services.find(
      (service) => service.id === serviceId
    );
  
    if (!selectedService) return;
  
    const slots = generateTimeSlots(
      availability.start_time.slice(0, 5),
      availability.end_time.slice(0, 5),
      selectedService.duration_minutes
    );

    console.log("Selected service:", selectedService);
    console.log("Generated slots:", slots);
  
    const startOfDay = `${date}T00:00:00`;
    const endOfDay = `${date}T23:59:59`;
  
    const appointments = await getAppointmentsForDay(
      businessId,
      new Date(startOfDay).toISOString(),
      new Date(endOfDay).toISOString()
    );
  
    const availableSlots = slots.filter((slot) => {
      const slotStart = new Date(
        `${date}T${slot}:00`
      );

      if (slotStart <= new Date()) {
        return false;
      }

      const slotEnd = new Date(slotStart);
  
      slotEnd.setMinutes(
        slotEnd.getMinutes() + selectedService.duration_minutes
      );
  
      return !appointments.some((appointment) => {
        const appointmentStart = new Date(
          appointment.start_time
        );
  
        const appointmentEnd = new Date(
          appointment.end_time
        );
  
        return (
          slotStart < appointmentEnd &&
          slotEnd > appointmentStart
        );
      });
    });
  
    setTimeSlots(availableSlots);
    setLoadingSlots(false);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting) return
  
    setError("");
    setSuccess(false);
    setSubmitting(true)
  
    if (
      !selectedServiceId ||
      !selectedDate ||
      !selectedTime ||
      !clientName ||
      !clientEmail
    ) {
      setError("Please complete all required fields.");
      return;
    }
  
    const selectedService = services.find(
      (service) => service.id === selectedServiceId
    );
  
    if (!selectedService) return;
  
    const startDateTime = new Date(
      `${selectedDate}T${selectedTime}:00`
    );
  
    const endDateTime = new Date(startDateTime);
  
    endDateTime.setMinutes(
      endDateTime.getMinutes() +
        selectedService.duration_minutes
    );
  
    try {
      await createAppointment({
        businessId,
        serviceId: selectedServiceId,
        clientName,
        clientEmail,
        clientPhone,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      });
  
      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error &&
          error.message.includes("appointments_no_overlap")
          ? "That time was just booked. Please choose another available time."
          : error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    
      setSubmitting(false);
    }
  }

  if (success) {
      return (
        <section>
          <h2>Appointment booked!</h2>
    
          <p>
            Your appointment has been scheduled successfully.
          </p>
    
          <p>
            We&apos;ll see you on{" "}
            {new Date(
              `${selectedDate}T${selectedTime}:00`
            ).toLocaleDateString()}{" "}
            at{" "}
            {new Date(
              `${selectedDate}T${selectedTime}:00`
            ).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
            .
          </p>
        </section>
      );
    }

  return (
    <section>
      {error && <p className="form-error">{error}</p>}
      <h2>Book an appointment</h2>

      <label htmlFor="date" className="booking-label" >Select a date</label>
      <label htmlFor="service" className="booking-label" >Select a service</label>

      <select
        id="service"
        className="booking-input" 
        value={selectedServiceId}
        onChange={(event) => {
          const serviceId = event.target.value;
      
          setSelectedServiceId(serviceId);
      
          updateTimeSlots(selectedDate, serviceId);
        }}
      >
        <option value="">Choose a service</option>
      
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </select>
      <input
        id="date"
        type="date"
        className="booking-input" 
        min={today}
        value={selectedDate}
        onChange={(event) => handleDateChange(event.target.value)}
      />
      {loadingSlots && <p>Loading available times...</p>}
      {!loadingSlots && timeSlots.length > 0 && (
      <div>
        <h3>Available times</h3>

        {timeSlots.map((slot) => (
          <button
            className={`booking-time ${
            selectedTime === slot ? "booking-time-selected" : ""
          }`}
            key={slot}
            type="button"
            onClick={() => setSelectedTime(slot)}
          >
            {slot}
          </button>
        ))}
      </div>
    )}
    {!loadingSlots &&
      selectedDate &&
      selectedServiceId &&
      timeSlots.length === 0 && (
        <p>No available times for this date.</p>
    )}
   {selectedTime && (
  <form onSubmit={handleSubmit}>
    <h3>Your information</h3>

    <label htmlFor="client-name" className="booking-label" >Name</label>
    <input
      id="client-name"
      type="text"
      className="booking-input"
      value={clientName}
      onChange={(event) => setClientName(event.target.value)}
      required
    />

    <label htmlFor="client-email" className="booking-label" >Email</label>
    <input
      id="client-email"
      type="email"
      className="booking-input" 
      value={clientEmail}
      onChange={(event) => setClientEmail(event.target.value)}
      required
    />

    <label htmlFor="client-phone" className="booking-label" >Phone</label>
    <input
      id="client-phone"
      type="tel"
      className="booking-input" 
      value={clientPhone}
      onChange={(event) => setClientPhone(event.target.value)}
    />

    <button
     
    type="submit" disabled={submitting}>
      {submitting ? "Booking..." : "Book Appointment"}
    </button>
  </form>
)}
    </section>
  );
}