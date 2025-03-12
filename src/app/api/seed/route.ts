import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { ApiResponse, Advocate } from "@/types";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

export async function POST() {
  try {
    if (!process.env.DATABASE_URL) {
      return Response.json(
        { error: "DATABASE_URL is not set" } satisfies ApiResponse<Advocate[]>,
        { status: 500 }
      );
    }

    // Parse the DATABASE_URL to get components
    const url = new URL(process.env.DATABASE_URL);
    const dbName = url.pathname.substring(1); // Remove the leading '/'
    
    console.log(`Attempting to connect to PostgreSQL and create database '${dbName}' if it doesn't exist...`);
    
    // First, connect to the default 'postgres' database to check if our target database exists
    const postgresUrl = `${url.protocol}//${url.username}:${url.password}@${url.host}/postgres`;
    
    try {
      // Connect to the postgres database for admin operations
      const adminClient = postgres(postgresUrl, {
        max: 1,
        idle_timeout: 10,
        connect_timeout: 10,
      });
      
      try {
        // Check if the database exists using Drizzle's sql template literal
        const dbExists = await adminClient`
          SELECT 1 FROM pg_database WHERE datname = ${dbName}
        `;
        
        if (dbExists.length === 0) {
          console.log(`Database '${dbName}' does not exist. Creating it...`);
          // Create the database - using raw SQL since Drizzle doesn't handle database creation
          await adminClient`CREATE DATABASE ${adminClient(dbName)}`;
          console.log(`Database '${dbName}' created successfully.`);
        } else {
          console.log(`Database '${dbName}' already exists.`);
        }
      } finally {
        // Close the admin connection
        await adminClient.end();
      }
      
      // Create a new connection to the target database
      console.log(`Connecting to database '${dbName}' to seed data...`);
      const queryClient = postgres(process.env.DATABASE_URL, {
        max: 1,
        idle_timeout: 10,
        connect_timeout: 10,
      });
      
      // Create a Drizzle instance
      const dbClient = drizzle(queryClient);
      
      try {
        // Create the schema using Drizzle's schema definition
        console.log("Ensuring schema exists...");
        
        // Create the table using the schema definition
        await dbClient.execute(sql`
          CREATE TABLE IF NOT EXISTS "advocates" (
            "id" SERIAL PRIMARY KEY,
            "first_name" TEXT NOT NULL,
            "last_name" TEXT NOT NULL,
            "city" TEXT NOT NULL,
            "degree" TEXT NOT NULL,
            "payload" JSONB DEFAULT '[]'::jsonb NOT NULL,
            "years_of_experience" INTEGER NOT NULL,
            "phone_number" BIGINT NOT NULL,
            "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        // Clear existing data to avoid duplicates
        console.log("Clearing existing data...");
        await dbClient.delete(advocates);
        
        // Insert the data using Drizzle's insert API
        console.log("Inserting data...");
        const records = await dbClient.insert(advocates).values(advocateData).returning();
        console.log("Data inserted successfully:", records.length, "records");
        
        return Response.json({ data: records } satisfies ApiResponse<Advocate[]>);
      } finally {
        // Close the connection
        await queryClient.end();
      }
    } catch (error) {
      console.error("Error with database operations:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error seeding database:", error);
    
    // Extract and return the full error message
    const errorMessage = error instanceof Error 
      ? `${error.name}: ${error.message}${error.stack ? `\n${error.stack}` : ''}`
      : String(error);
    
    return Response.json(
      { error: `Failed to seed database: ${errorMessage}` } satisfies ApiResponse<Advocate[]>,
      { status: 500 }
    );
  }
}