import { getBusinessBySlug } from "@/features/business/services/getBusinessBySlug";
import { getServices } from "@/features/services/services/getServices";

type BookingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BookingPage({
  params,
}: BookingPageProps) {
  const { slug } = await params;

  const business = await getBusinessBySlug(slug);
  const services = await getServices(business.id);

  return (
    <main>
      <h1>{business.name}</h1>
      <p>{business.description}</p>

      <section>
        <h2>Services</h2>

        {services.length === 0 ? (
          <p>No services available.</p>
        ) : (
          services.map((service) => (
            <div key={service.id}>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <p>${service.price}</p>
              <p>{service.duration_minutes} minutes</p>
            </div>
          ))
        )}
      </section>
    </main>
  );
}