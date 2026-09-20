import { supabase } from "@/lib/supabase";

type CreateAppointmentParams = {
  businessId: string;
  serviceId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  startTime: string;
  endTime: string;
};

export async function createAppointment({
  businessId,
  serviceId,
  clientName,
  clientEmail,
  clientPhone,
  startTime,
  endTime,
}: CreateAppointmentParams) {
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("id")
    .eq("id", serviceId)
    .eq("business_id", businessId)
    .single();

  if (serviceError || !service) {
    throw new Error("Invalid service for this business.");
  }
  
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  
  if (endDate <= startDate) {
    throw new Error("Appointment end time must be after start time.");
  }

  const dayOfWeek = startDate.getDay();

  const { data: availability, error: availabilityError } =
    await supabase
      .from("availability")
      .select("start_time, end_time, is_available")
      .eq("business_id", businessId)
      .eq("day_of_week", dayOfWeek)
      .maybeSingle();
  
  if (availabilityError) {
    throw new Error(availabilityError.message);
  }
  
  if (!availability || !availability.is_available) {
    throw new Error("The business is not available on this day.");
  }
  
  const availableStart = availability.start_time;
  const availableEnd = availability.end_time;
  
  const appointmentStart = startDate.toTimeString().slice(0, 5);
  const appointmentEnd = endDate.toTimeString().slice(0, 5);
  
  if (
    appointmentStart < availableStart ||
    appointmentEnd > availableEnd
  ) {
    throw new Error(
      "The appointment falls outside the business's available hours."
    );
  }
  
  const { data, error } = await supabase
    .from("appointments")
    .insert({
      business_id: businessId,
      service_id: serviceId,
      client_name: clientName,
      client_email: clientEmail,
      client_phone: clientPhone,
      start_time: startTime,
      end_time: endTime,
    })

  if (error) {
    throw new Error(error.message);
  }

  return;
}