-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations

CREATE TYPE "public"."appointment_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'barber');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'barber' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "professionals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"full_name" text NOT NULL,
	"slug" text NOT NULL,
	"phone" text NOT NULL,
	"bio" text NOT NULL,
	"timezone" text DEFAULT 'America/Recife' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "professionals_user_id_key" UNIQUE("user_id"),
	CONSTRAINT "professionals_slug_key" UNIQUE("slug"),
	CONSTRAINT "chk_professionals_full_name_len" CHECK (char_length(full_name) >= 2)
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"duration_minutes" integer NOT NULL,
	"price_brl" numeric(10, 2),
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_services_name" UNIQUE("name"),
	CONSTRAINT "chk_duration_positive" CHECK ((duration_minutes >= 5) AND (duration_minutes <= 480)),
	CONSTRAINT "chk_duration_step" CHECK ((duration_minutes % 5) = 0),
	CONSTRAINT "chk_price_nonneg" CHECK ((price_brl IS NULL) OR (price_brl >= (0)::numeric))
);
--> statement-breakpoint
CREATE TABLE "working_hours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"professional_id" uuid NOT NULL,
	"weekday" smallint NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"slot_step_min" integer DEFAULT 15 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_wh_prof_day" UNIQUE("professional_id","weekday"),
	CONSTRAINT "chk_weekday_range" CHECK ((weekday >= 0) AND (weekday <= 6)),
	CONSTRAINT "chk_time_order" CHECK (start_time < end_time),
	CONSTRAINT "chk_slot_step_pos" CHECK (slot_step_min = ANY (ARRAY[5, 10, 15, 20, 30, 60]))
);
--> statement-breakpoint
CREATE TABLE "blocked_intervals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"professional_id" uuid NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"reason" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_block_range" CHECK (starts_at < ends_at)
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"professional_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"customer_email" text,
	"notes" text,
	"status" "appointment_status" DEFAULT 'pending' NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"source" text DEFAULT 'web' NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_appt_time" CHECK (starts_at < ends_at)
);
--> statement-breakpoint
ALTER TABLE "professionals" ADD CONSTRAINT "professionals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "working_hours" ADD CONSTRAINT "working_hours_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blocked_intervals" ADD CONSTRAINT "blocked_intervals_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blocked_intervals" ADD CONSTRAINT "blocked_intervals_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_users_active" ON "users" USING btree ("is_active" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_professionals_active" ON "professionals" USING btree ("active" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_services_active" ON "services" USING btree ("active" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_wh_prof" ON "working_hours" USING btree ("professional_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_block_prof_start" ON "blocked_intervals" USING btree ("professional_id" timestamptz_ops,"starts_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_appt_prof_start" ON "appointments" USING btree ("professional_id" uuid_ops,"starts_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_appt_status" ON "appointments" USING btree ("status" enum_ops);--> statement-breakpoint
CREATE VIEW "public"."v_appointments_today" AS (SELECT a.id, a.professional_id, a.service_id, a.customer_name, a.customer_phone, a.customer_email, a.notes, a.status, a.starts_at, a.ends_at, a.source, a.created_by, a.updated_by, a.created_at, a.updated_at, p.full_name AS professional_name, s.name AS service_name FROM appointments a JOIN professionals p ON p.id = a.professional_id JOIN services s ON s.id = a.service_id WHERE a.starts_at >= date_trunc('day'::text, now()) AND a.starts_at < (date_trunc('day'::text, now()) + '1 day'::interval));
