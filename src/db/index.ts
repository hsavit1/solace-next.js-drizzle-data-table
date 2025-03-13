import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const setup = () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return {
      select: () => ({
        from: () => [],
      }),
    };
  }

  try {
    // Create a simple connection with the DATABASE_URL
    console.log("Setting up database connection with:", 
      process.env.DATABASE_URL.replace(/(postgresql:\/\/[^:]+:)([^@]+)(@.+)/, "$1****$3")
    );
    
    // Configure postgres with explicit options
    const queryClient = postgres(process.env.DATABASE_URL, {
      max: 10, // Max number of connections
      idle_timeout: 20, // Max seconds a client can be idle before being closed
      connect_timeout: 10, // Max seconds to wait for a connection
      prepare: false, // Don't use prepared statements
      ssl: 'prefer', // Try SSL but don't require it
      connection: {
        application_name: 'solace-app',
        // Try to force the database name
        database: 'solaceassignment'
      }
    });
    
    // Create the drizzle client
    const db = drizzle(queryClient);
    return db;
  } catch (error) {
    console.error("Error setting up database connection:", error);
    // Return a mock object if connection fails
    return {
      select: () => ({
        from: () => [],
      }),
    };
  }
};

export default setup();
