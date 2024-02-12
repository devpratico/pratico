#!/bin/bash
# Don't forget to make the script executable with chmod +x ./scripts/supabase-db-reset.sh
# this script is used to test the migration files and the seed files upon the local database.


# Reset the database
echo "🔄 Resetting the database..."
pnpm supabase db reset
echo "✅ Database reset."
echo
echo

# Generate types
echo "🔄 Generating types..."
# The directory is relative to package.json from which the script is run
pnpm supabase gen types typescript --local > ./supabase/types/database.types.ts
echo "✅ Types generated in supabase/types/database.types.ts."
echo
echo