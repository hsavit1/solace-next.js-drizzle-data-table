import db from "@/db";
import { advocates } from "@/db/schema";
import { advocateData } from "@/db/seed/advocates";
import { ApiResponse, Advocate } from "@/types";

export async function GET(): Promise<Response> {
  try {
    // Try to fetch from database first
    let data: Advocate[] = [];
    
    try {
      data = await db.select().from(advocates);
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Fallback to static data if database query fails
      // data = advocateData as unknown as Advocate[];

      return Response.json(
        { error: `Failed to fetch advocates: ${dbError}` } satisfies ApiResponse<Advocate[]>,
        { status: 500 }
      );
  
    }

    return Response.json({ data } satisfies ApiResponse<Advocate[]>);
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return Response.json(
      { error: "Failed to fetch advocates" } satisfies ApiResponse<Advocate[]>,
      { status: 500 }
    );
  }
}
