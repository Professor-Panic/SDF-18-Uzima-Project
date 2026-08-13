// Builds a Google Calendar "add event" URL from an appointment.
// No API key, no auth — just a URL with query params Google reads.
export function buildGoogleCalendarUrl({ clinicNameManual, dateTime, reason }) {
   const start = new Date(dateTime);
   const end = new Date(start.getTime() + 30 * 60 * 1000); //// defaults to a 30-min slot

   // Google wants UTC, no dashes/colons: YYYYMMDDTHHmmssZ
   const toGoogleFormat = (d) =>
      d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
     action: "TEMPLATE",
     text: `${clinicNameManual}${reason ? "-" + reason : ""}`,
     date: `${toGoogleFormat(start)}/${toGoogleFormat(end)}`, 
     details: reason || "",
     location: clinicNameManual,
  });
   return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
