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