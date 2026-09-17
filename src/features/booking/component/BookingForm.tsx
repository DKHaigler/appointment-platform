"use client";

import { useState } from "react";
import { getAvailabilityForDay } from "@/features/availability/services/getAvailabilityForDay";
import { generateTimeSlots } from "@/features/availability/utils/generateTimeSlots";
import { createAppointment } from "@/features/appointments/services/createAppointments"; 

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
  
    setTimeSlots(slots);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  
    if (
      !selectedServiceId ||
      !selectedDate ||
      !selectedTime ||
      !clientName ||
      !clientEmail
    ) {
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
      endDateTime.getMinutes() + selectedService.duration_minutes
    );
  
    await createAppointment({
      businessId,
      serviceId: selectedServiceId,
      clientName,
      clientEmail,
      clientPhone,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
    });
  }

  return (
    <section>
      <h2>Book an appointment</h2>

      <label htmlFor="date">Select a date</label>
      <label htmlFor="service">Select a service</label>

      <select
        id="service"
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
        value={selectedDate}
        onChange={(event) => handleDateChange(event.target.value)}
      />
      {timeSlots.length > 0 && (
      <div>
        <h3>Available times</h3>

        {timeSlots.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => setSelectedTime(slot)}
          >
            {slot}
          </button>
        ))}
      </div>
    )}
   {selectedTime && (
  <form onSubmit={handleSubmit}>
    <h3>Your information</h3>

    <label htmlFor="client-name">Name</label>
    <input
      id="client-name"
      type="text"
      value={clientName}
      onChange={(event) => setClientName(event.target.value)}
      required
    />

    <label htmlFor="client-email">Email</label>
    <input
      id="client-email"
      type="email"
      value={clientEmail}
      onChange={(event) => setClientEmail(event.target.value)}
      required
    />

    <label htmlFor="client-phone">Phone</label>
    <input
      id="client-phone"
      type="tel"
      value={clientPhone}
      onChange={(event) => setClientPhone(event.target.value)}
    />

    <button type="submit">
      Book Appointment
    </button>
  </form>
)}
    </section>
  );
}