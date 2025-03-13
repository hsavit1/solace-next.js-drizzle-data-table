## Solace Candidate Assignment

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Install dependencies

```bash
npm i
```

Run the development server:

```bash
npm run dev
```

## Database set up

The app is configured to return a default list of advocates. This will allow you to get the app up and running without needing to configure a database. If you'd like to configure a database, you're encouraged to do so. You can uncomment the url in `.env` and the line in `src/app/api/advocates/route.ts` to test retrieving advocates from the database.

1. Start the PostgreSQL database using Docker Compose. This will automatically create the `solaceassignment` database as defined in the docker-compose.yml file.

```bash
docker compose up -d
```

2. The `solaceassignment` database is automatically created by Docker Compose when the container starts up. No manual database creation is needed.

   If you want to verify the database was created properly, you can connect to it using:
   ```bash
   # Connect to PostgreSQL container
   docker exec -it solace-candidate-assignment-db-1 psql -U postgres
   
   # List all databases (you should see 'solaceassignment' in the list)
   \l
   
   # Connect to the solaceassignment database
   \c solaceassignment
   
   # Exit PostgreSQL CLI
   \q
   ```

3. Push migration to the database

```bash
npx drizzle-kit push
```

4. Seed the database

```bash
curl -X POST http://localhost:3000/api/seed
```
