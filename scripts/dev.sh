#!/bin/bash
# Don't forget to make the script executable with chmod +x ./scripts/dev.sh

# Start Supabase in the background
./scripts/start-docker.sh && supabase start

echo

# Start your Next.js dev server
next dev -H 0.0.0.0

# Function to run on script exit
cleanup() {
    echo
    echo "Stopping Supabase..."
    supabase stop
    ./scripts/stop-docker.sh
}

# Trap script exit signals (INT is Ctrl+C)
trap cleanup EXIT INT

# Wait for the Next.js process to exit
wait