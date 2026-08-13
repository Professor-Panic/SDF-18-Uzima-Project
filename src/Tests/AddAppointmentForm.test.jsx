import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AddAppointmentForm from "./AddAppointmentForm";

describe("AddAppointmentForm", () => {
   it("shows a validation error and does not call onAdd when clinic name is blank", async () => {
      const onAdd = vi.fn();
      render(<AddAppointmentForm onAdd={onAdd} />);

      // fill in a fake date via the datepicker input, but leave clinic name empty
      const submitButton = screen.getByRole("button", {
         name: /add appointment/i,
      });
      fireEvent.click(submitButton);

      expect(
         await screen.findByText(/clinic name can't be empty/i),
      ).toBeInTheDocument();
      expect(onAdd).not.toHaveBeenCalled();
   });
});
