#!/bin/bash
# Don't forget to make the script executable with chmod +x ./scripts/dev.sh

# Start Supabase in the background
./app/_scripts/start-docker.sh && supabase start

echo


# Dynamically find the machine's IP address
#IP_ADDRESS=$(ipconfig getifaddr en0)

# Concurrently (at the same time):
# * Start your Next.js dev server
# * Listen to Stripe events
run_services() {
    concurrently \
        --prefix "{name}" \
        -n "Stripe," \
        "./app/_scripts/forward-stripe-events.sh" \
        "next dev"
}

# Function to run on script exit
# `supabase stop --no-backup` stops Supabase without creating a backup
cleanup() {
    echo
    echo "Stopping Supabase..."
    pnpm supabase stop
    ./app/_scripts/stop-docker.sh
}

# Trap script exit signal
trap cleanup EXIT

run_services