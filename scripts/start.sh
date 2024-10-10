#!/bin/bash
# Don't forget to make the script executable with chmod +x ./app/_scripts/start.sh


# Load environment variables from .env.local
./scripts/load-env.sh

# Start Supabase in the background
./scripts/start-docker.sh && pnpm supabase start

echo

# Concurrently (at the same time):
# * Start your Next.js dev server
# * Listen to Stripe events
run_services() {
    concurrently \
        --prefix "{name}" \
        -n "$,▲" \
        "./scripts/forward-stripe-events.sh" \
        "next start"
}

# Function to run on script exit
cleanup() {
    echo
    echo "Stopping Supabase..."
    pnpm supabase stop && ./scripts/stop-docker.sh
}

# Trap script exit signal
trap cleanup EXIT

run_services