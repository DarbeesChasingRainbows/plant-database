import { z } from 'npm:zod';

export const GrowingFormSchema = z.object({
  plot_id: z.string().min(1,'Plot ID required'),
  planting_date: z.string().datetime(),
  planting_method: z.string().min(2,'Method too short'),
  spacing_cm: z.number().min(5,'Minimum spacing 5cm'),
  depth_cm: z.number().min(1),  
  quantity_planted: z.number().positive(),
  area_sqm: z.number().positive(),
  notes: z.string().optional(),
  season: z.string().optional(),
  year: z.string().optional(),
  layout: z.string().optional(),
  status: z.string().optional(),
  planting_area: z.string().regex(
    /^(POLYGON|MULTIPOLYGON|POINT|LINESTRING)\(.*\)$/i,
    "Invalid polygon WKT format"
  ),
  row_lines: z.string().regex(
    /^(LINESTRING|MULTILINESTRING)\(.*\)$/i, 
    "Invalid linestring WKT format"
  ),
});

export type GrowingForm = z.infer<typeof GrowingFormSchema>;
