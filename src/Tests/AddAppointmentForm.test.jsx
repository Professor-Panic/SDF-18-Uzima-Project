import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AddAppointmentForm from "../Appointments/AddAppointmentForm";

describe("AddAppointmentForm", () => {
   it("shows a validation error and does not call onAdd when clinic name is blank", async () => {
      const onAdd = vi.fn();
      const { container } = render(<AddAppointmentForm onAdd={onAdd} />);

      // Dispatching submit directly on the <form> bypasses jsdom's native HTML5 validation (which would otherwise intercept the empty `required` field before our own handleSubmit ever runs) —
      // This is the same distinction a real browser makes between a native form submission and a directly-dispatched submit event.
      const form = container.querySelector("form");
      fireEvent.submit(form);

      expect(
         await screen.findByText(/clinic name can't be empty/i),
      ).toBeInTheDocument();
      expect(onAdd).not.toHaveBeenCalled();
   });
});
