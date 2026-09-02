CREATE TABLE "public"."appointments" (
  "id"           uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "business_id"  uuid                     NOT NULL,
  "service_id"   uuid                     NOT NULL,
  "client_name"  text                     NOT NULL,
  "client_email" text                     NOT NULL,
  "client_phone" text,
  "start_time"   timestamp with time zone NOT NULL,
  "end_time"     timestamp with time zone NOT NULL,
  "status"       text                     NOT NULL DEFAULT 'pending'::text,
  "created_at"   timestamp with time zone DEFAULT now(),
  CONSTRAINT "appointments_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."appointments"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."availability" (
  "id"           uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "business_id"  uuid                     NOT NULL,
  "day_of_week"  integer                  NOT NULL,
  "start_time"   time without time zone   NOT NULL,
  "end_time"     time without time zone   NOT NULL,
  "is_available" boolean                  NOT NULL DEFAULT true,
  "created_at"   timestamp with time zone DEFAULT now(),
  CONSTRAINT "availability_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."availability"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."businesses" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "owner_id"   uuid                     NOT NULL,
  "name"       text                     NOT NULL,
  "slug"       text                     NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "businesses_pkey" PRIMARY KEY (id),
  CONSTRAINT "businesses_slug_key" UNIQUE (slug)
);

ALTER TABLE "public"."businesses"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
  "id"         uuid                     NOT NULL,
  "full_name"  text,
  "created_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."services" (
  "id"               uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "business_id"      uuid                     NOT NULL,
  "name"             text                     NOT NULL,
  "description"      text,
  "price"            numeric(10,2)            NOT NULL,
  "duration_minutes" integer                  NOT NULL,
  "created_at"       timestamp with time zone DEFAULT now(),
  CONSTRAINT "services_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."services"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."appointments"
  ADD CONSTRAINT "appointments_business_id_fkey" FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;

ALTER TABLE "public"."availability"
  ADD CONSTRAINT "availability_business_id_fkey" FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."businesses"
  ADD CONSTRAINT "businesses_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."services"
  ADD CONSTRAINT "services_business_id_fkey" FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;

ALTER TABLE "public"."appointments"
  ADD CONSTRAINT "appointments_service_id_fkey" FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;

CREATE POLICY "Users can update their own profile" ON "public"."profiles"
  FOR UPDATE
  TO "authenticated"
  USING ((id = auth.uid()))
  WITH CHECK ((id = auth.uid()));

CREATE POLICY "Users can view their own profile" ON "public"."profiles"
  FOR SELECT
  TO "authenticated"
  USING ((id = auth.uid()));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."appointments" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."availability" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."businesses" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."services" TO "anon", "authenticated", "postgres", "service_role";

