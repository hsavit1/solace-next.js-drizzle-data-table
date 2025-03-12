import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { advocates } from "@/db/schema";

// Define types based on the database schema
export type Advocate = InferSelectModel<typeof advocates>;
export type NewAdvocate = InferInsertModel<typeof advocates>;

// Define a type for the API response
export interface ApiResponse<T> {
  data?: T;
  error?: string;
} 