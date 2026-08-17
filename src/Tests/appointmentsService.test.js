import { describe, it, expect, beforeEach } from "vitest";
import {
   getAppointments,
   addAppointment,
   updateAppointmentStatus,
   deleteAppointment,
} from "../Appointments/appointmentsService";

const USER_ID = "user_123";

// Clear storage before each test so tests don't leak state into each other
beforeEach(() => {
   localStorage.clear();
});

describe("appointmentsService", () => {
   it("returns seeded appointments sorted soonest first", async () => {
      const appointments = await getAppointments(USER_ID);
      expect(appointments.length).toBeGreaterThan(0);

      const dates = appointments.map((a) => new Date(a.dateTime).getTime());
      const sorted = [...dates].sort((a, b) => a - b);
      expect(dates).toEqual(sorted);
   });

   it("adds a new appointment and persists it", async () => {
      const before = await getAppointments(USER_ID);

      await addAppointment(USER_ID, {
         clinicNameManual: "Test Clinic",
         dateTime: "2026-09-01T09:00:00",
         reason: "Checkup",
      });

      const after = await getAppointments(USER_ID);
      expect(after.length).toBe(before.length + 1);
      expect(after.some((a) => a.clinicNameManual === "Test Clinic")).toBe(
         true,
      );
   });

   it("new appointments default to 'upcoming' status", async () => {
      const created = await addAppointment(USER_ID, {
         clinicNameManual: "Test Clinic",
         dateTime: "2026-09-01T09:00:00",
         reason: "Checkup",
      });
      expect(created.status).toBe("upcoming");
   });

   it("updates an appointment's status", async () => {
      const [first] = await getAppointments(USER_ID);
      const updated = await updateAppointmentStatus(first.id, "completed");
      expect(updated.status).toBe("completed");
   });

   it("deletes an appointment", async () => {
      const before = await getAppointments(USER_ID);
      await deleteAppointment(before[0].id);
      const after = await getAppointments(USER_ID);
      expect(after.length).toBe(before.length - 1);
   });
});
