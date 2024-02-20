#!/bin/bash
# Don't forget to make the script executable with chmod +x ./scripts/dev.sh

# Start Supabase in the background
./scripts/start-docker.sh && supabase start

echo

# Concurrently (at the same time):
# * Start your Next.js dev server
# * Listen to Stripe events
run_services() {
    concurrently \
        --prefix "{name}" \
        -n "$,▲" \
        "./scripts/forward-stripe-events.sh" \
        "next dev -H 0.0.0.0"
}

# Function to run on script exit
cleanup() {
    echo
    echo "Stopping Supabase..."
    supabase stop
    ./scripts/stop-docker.sh
}

# Trap script exit signal
trap cleanup EXIT

run_services