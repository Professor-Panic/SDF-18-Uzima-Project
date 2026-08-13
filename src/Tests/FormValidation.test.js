import { describe, it, expect } from "vitest";
import {
   isSameDay,
   validateRequiredText,
   validateQuantity,
} from "./FormValidation.test";

describe("isSameDay", () => {
   it("returns true for two dates on the same calendar day", () => {
      const a = new Date(2026, 7, 13, 9, 0);
      const b = new Date(2026, 7, 13, 22, 30);
      expect(isSameDay(a, b)).toBe(true);
   });

   it("returns false for dates on different days", () => {
      const a = new Date(2026, 7, 13);
      const b = new Date(2026, 7, 14);
      expect(isSameDay(a, b)).toBe(false);
   });
});

describe("validateRequiredText", () => {
   it("rejects an empty string", () => {
      expect(validateRequiredText("", "Clinic name")).toBe(
         "Clinic name can't be empty.",
      );
   });

   it("rejects a whitespace-only string", () => {
      expect(validateRequiredText("   ", "Clinic name")).toBe(
         "Clinic name can't be empty.",
      );
   });

   it("accepts real text", () => {
      expect(
         validateRequiredText("MP Shah Hospital", "Clinic name"),
      ).toBeNull();
   });
});

describe("validateQuantity", () => {
   it("rejects negative numbers", () => {
      expect(validateQuantity("-5", "Quantity remaining")).toBe(
         "Quantity remaining can't be negative.",
      );
   });

   it("rejects non-integer values", () => {
      expect(validateQuantity("3.7", "Quantity remaining")).toBe(
         "Quantity remaining must be a whole number.",
      );
   });

   it("accepts a valid whole number", () => {
      expect(validateQuantity("30", "Quantity remaining")).toBeNull();
   });

   it("treats an empty value as valid (optional field)", () => {
      expect(validateQuantity("", "Quantity remaining")).toBeNull();
   });
});
