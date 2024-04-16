#!/bin/bash
# Don't forget to make the script executable with chmod +x ./app/_scripts/supabase-db-reset.sh
# this script is used to reset the local supabase database and apply the migration files and the seed file.


# Load environment variables from .env.local
./app/_scripts/load-env.sh

# Reset the database
echo "🔄 Resetting the database..."
pnpm supabase db reset
echo "✅ Database reset."
echo
echo

# Generate types
echo "🔄 Generating types..."
# The output directory for types is relative to package.json from which the script is run (not from here)
pnpm supabase gen types typescript --local > ./supabase/types/database.types.ts
echo "✅ Types generated in supabase/types/database.types.ts."
echo
echo