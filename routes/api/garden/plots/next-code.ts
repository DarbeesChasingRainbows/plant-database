import { Handlers } from "$fresh/server.ts";
import { db } from "../../../../utils/db.ts";
import { plots } from "../../../../utils/schema.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    try {
      // Get all existing plot codes to determine the next one
      const existingPlots = await db
        .select({ plotCode: plots.plotCode })
        .from(plots)
        .orderBy(plots.plotCode);
      
      // Extract numerical values from existing plot codes (e.g., PLOT-1, PLOT-2, etc.)
      const codePattern = /PLOT-(\d+)/;
      let highestNumber = 0;
      
      for (const plot of existingPlots) {
        const match = plot.plotCode.match(codePattern);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (num > highestNumber) {
            highestNumber = num;
          }
        }
      }
      
      // Generate the next plot code by incrementing the highest number
      const nextPlotCode = `PLOT-${highestNumber + 1}`;
      
      return new Response(JSON.stringify({ nextPlotCode }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : String(error) 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
