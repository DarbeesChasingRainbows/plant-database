// tests/validation/growing_form_test.ts
import { assertEquals } from "$std/testing/asserts.ts";
import { GrowingFormSchema } from "../../utils/validation.ts";

Deno.test("Valid growing form data", async () => {
  const validData = {
    plot_id: "plot-123",
    planting_date: "2024-03-15T12:00:00Z",
    planting_method: "Direct Seeding",
    spacing_cm: 30,
    depth_cm: 5,
    quantity_planted: 100,
    area_sqm: 10,
    notes: "Test planting"
  };

  const result = GrowingFormSchema.safeParse(validData);
  assertEquals(result.success, true);
});

Deno.test("Invalid growing form data", async (t) => {
  await t.step("Missing required fields", () => {
    const invalidData = {
      planting_date: "2024-03-15T12:00:00Z",
      planting_method: "D"
    };
    
    const result = GrowingFormSchema.safeParse(invalidData);
    assertEquals(result.success, false);
    assertEquals(result.error?.issues.length, 6);
  });

  await t.step("Invalid numeric values", () => {
    const invalidData = {
      plot_id: "plot-123",
      planting_date: "2024-03-15T12:00:00Z",
      planting_method: "Transplant",
      spacing_cm: -5,
      depth_cm: 0,
      quantity_planted: -10,
      area_sqm: 0
    };
    
    const result = GrowingFormSchema.safeParse(invalidData);
    assertEquals(result.success, false);
    assertEquals(result.error?.issues.length, 4);
  });
});