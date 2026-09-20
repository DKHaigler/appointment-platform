import { getBusinessBySlug } from "@/features/business/services/getBusinessBySlug";
import { getServices } from "@/features/services/services/getServices";
import BookingForm from "@/components/booking/BookingForm";

type BookingPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BookingPage({
  params,
}: BookingPageProps) {
  const { slug } = await params;

  const business = await getBusinessBySlug(slug);
  const services = await getServices(business.id);

  return (
    <main className="booking-page">
      <div className="booking-container">
        <header className="booking-header">
          <div className="booking-brand">
            <span className="booking-brand-mark">
              {business.name.charAt(0).toUpperCase()}
            </span>

            <div>
              <h1>{business.name}</h1>
              <p>Book an appointment</p>
            </div>
          </div>

          {business.description && (
            <p className="booking-description">
              {business.description}
            </p>
          )}
        </header>

        <section className="booking-services">
          <div className="booking-section-header">
            <h2>Services</h2>
            <p>Choose a service to get started.</p>
          </div>

          {services.length === 0 ? (
            <div className="booking-empty">
              <p>No services are currently available.</p>
            </div>
          ) : (
            <div className="booking-service-list">
              {services.map((service) => (
                <article
                  key={service.id}
                  className="booking-service-card"
                >
                  <div>
                    <h3>{service.name}</h3>

                    {service.description && (
                      <p>{service.description}</p>
                    )}
                  </div>

                  <div className="booking-service-details">
                    <strong>
                      ${Number(service.price).toFixed(2)}
                    </strong>

                    <span>
                      {service.duration_minutes} min
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="booking-form-section">
          <BookingForm
            businessId={business.id}
            services={services}
          />
        </section>
      </div>
    </main>
  );
}