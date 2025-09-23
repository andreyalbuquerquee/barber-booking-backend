import { relations } from "drizzle-orm/relations";
import { users, professionals, workingHours, blockedIntervals, appointments, services } from "./schema";

export const professionalsRelations = relations(professionals, ({one, many}) => ({
	user: one(users, {
		fields: [professionals.userId],
		references: [users.id]
	}),
	workingHours: many(workingHours),
	blockedIntervals: many(blockedIntervals),
	appointments: many(appointments),
}));

export const usersRelations = relations(users, ({many}) => ({
	professionals: many(professionals),
	blockedIntervals: many(blockedIntervals),
	appointments_createdBy: many(appointments, {
		relationName: "appointments_createdBy_users_id"
	}),
	appointments_updatedBy: many(appointments, {
		relationName: "appointments_updatedBy_users_id"
	}),
}));

export const workingHoursRelations = relations(workingHours, ({one}) => ({
	professional: one(professionals, {
		fields: [workingHours.professionalId],
		references: [professionals.id]
	}),
}));

export const blockedIntervalsRelations = relations(blockedIntervals, ({one}) => ({
	professional: one(professionals, {
		fields: [blockedIntervals.professionalId],
		references: [professionals.id]
	}),
	user: one(users, {
		fields: [blockedIntervals.createdBy],
		references: [users.id]
	}),
}));

export const appointmentsRelations = relations(appointments, ({one}) => ({
	professional: one(professionals, {
		fields: [appointments.professionalId],
		references: [professionals.id]
	}),
	service: one(services, {
		fields: [appointments.serviceId],
		references: [services.id]
	}),
	user_createdBy: one(users, {
		fields: [appointments.createdBy],
		references: [users.id],
		relationName: "appointments_createdBy_users_id"
	}),
	user_updatedBy: one(users, {
		fields: [appointments.updatedBy],
		references: [users.id],
		relationName: "appointments_updatedBy_users_id"
	}),
}));

export const servicesRelations = relations(services, ({many}) => ({
	appointments: many(appointments),
}));