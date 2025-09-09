import { pgTable, index, unique, uuid, text, boolean, timestamp, foreignKey, check, integer, numeric, smallint, time, pgView, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const appointmentStatus = pgEnum("appointment_status", ['pending', 'confirmed', 'cancelled', 'completed'])
export const userRole = pgEnum("user_role", ['admin', 'barber'])


export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	passwordHash: text("password_hash").notNull(),
	role: userRole().default('barber').notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_users_active").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	unique("users_email_key").on(table.email),
]);

export const professionals = pgTable("professionals", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	fullName: text("full_name").notNull(),
	slug: text().notNull(),
	phone: text(),
	bio: text(),
	timezone: text().default('America/Recife').notNull(),
	active: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_professionals_active").using("btree", table.active.asc().nullsLast().op("bool_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "professionals_user_id_fkey"
		}).onDelete("set null"),
	unique("professionals_slug_key").on(table.slug),
	check("chk_professionals_full_name_len", sql`char_length(full_name) >= 2`),
]);

export const services = pgTable("services", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	durationMinutes: integer("duration_minutes").notNull(),
	priceBrl: numeric("price_brl", { precision: 10, scale:  2 }),
	active: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_services_active").using("btree", table.active.asc().nullsLast().op("bool_ops")),
	unique("uq_services_name").on(table.name),
	check("chk_duration_positive", sql`(duration_minutes >= 5) AND (duration_minutes <= 480)`),
	check("chk_duration_step", sql`(duration_minutes % 5) = 0`),
	check("chk_price_nonneg", sql`(price_brl IS NULL) OR (price_brl >= (0)::numeric)`),
]);

export const workingHours = pgTable("working_hours", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	professionalId: uuid("professional_id").notNull(),
	weekday: smallint().notNull(),
	startTime: time("start_time").notNull(),
	endTime: time("end_time").notNull(),
	slotStepMin: integer("slot_step_min").default(15).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_wh_prof").using("btree", table.professionalId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.professionalId],
			foreignColumns: [professionals.id],
			name: "working_hours_professional_id_fkey"
		}).onDelete("cascade"),
	unique("uq_wh_prof_day").on(table.professionalId, table.weekday),
	check("chk_weekday_range", sql`(weekday >= 0) AND (weekday <= 6)`),
	check("chk_time_order", sql`start_time < end_time`),
	check("chk_slot_step_pos", sql`slot_step_min = ANY (ARRAY[5, 10, 15, 20, 30, 60])`),
]);

export const blockedIntervals = pgTable("blocked_intervals", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	professionalId: uuid("professional_id").notNull(),
	startsAt: timestamp("starts_at", { withTimezone: true, mode: 'string' }).notNull(),
	endsAt: timestamp("ends_at", { withTimezone: true, mode: 'string' }).notNull(),
	reason: text(),
	createdBy: uuid("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_block_prof_start").using("btree", table.professionalId.asc().nullsLast().op("timestamptz_ops"), table.startsAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.professionalId],
			foreignColumns: [professionals.id],
			name: "blocked_intervals_professional_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "blocked_intervals_created_by_fkey"
		}).onDelete("set null"),
	check("chk_block_range", sql`starts_at < ends_at`),
]);

export const appointments = pgTable("appointments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	professionalId: uuid("professional_id").notNull(),
	serviceId: uuid("service_id").notNull(),
	customerName: text("customer_name").notNull(),
	customerPhone: text("customer_phone").notNull(),
	customerEmail: text("customer_email"),
	notes: text(),
	status: appointmentStatus().default('pending').notNull(),
	startsAt: timestamp("starts_at", { withTimezone: true, mode: 'string' }).notNull(),
	endsAt: timestamp("ends_at", { withTimezone: true, mode: 'string' }).notNull(),
	source: text().default('web').notNull(),
	createdBy: uuid("created_by"),
	updatedBy: uuid("updated_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_appt_prof_start").using("btree", table.professionalId.asc().nullsLast().op("uuid_ops"), table.startsAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_appt_status").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.professionalId],
			foreignColumns: [professionals.id],
			name: "appointments_professional_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.serviceId],
			foreignColumns: [services.id],
			name: "appointments_service_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "appointments_created_by_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [users.id],
			name: "appointments_updated_by_fkey"
		}).onDelete("set null"),
	check("chk_appt_time", sql`starts_at < ends_at`),
]);
export const vAppointmentsToday = pgView("v_appointments_today", {	id: uuid(),
	professionalId: uuid("professional_id"),
	serviceId: uuid("service_id"),
	customerName: text("customer_name"),
	customerPhone: text("customer_phone"),
	customerEmail: text("customer_email"),
	notes: text(),
	status: appointmentStatus(),
	startsAt: timestamp("starts_at", { withTimezone: true, mode: 'string' }),
	endsAt: timestamp("ends_at", { withTimezone: true, mode: 'string' }),
	source: text(),
	createdBy: uuid("created_by"),
	updatedBy: uuid("updated_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	professionalName: text("professional_name"),
	serviceName: text("service_name"),
}).as(sql`SELECT a.id, a.professional_id, a.service_id, a.customer_name, a.customer_phone, a.customer_email, a.notes, a.status, a.starts_at, a.ends_at, a.source, a.created_by, a.updated_by, a.created_at, a.updated_at, p.full_name AS professional_name, s.name AS service_name FROM appointments a JOIN professionals p ON p.id = a.professional_id JOIN services s ON s.id = a.service_id WHERE a.starts_at >= date_trunc('day'::text, now()) AND a.starts_at < (date_trunc('day'::text, now()) + '1 day'::interval)`);