#!/bin/bash
# Don't forget to make the script executable with chmod +x ./app/_scripts/forward-stripe-events.sh

# This script forwards test mode Stripe events to the local server. 
# See https://docs.stripe.com/webhooks

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "⚠️ Stripe CLI is not installed. You won't receive Stripe events."
    echo "  Visit https://stripe.com/docs/stripe-cli to install it."
    exit 1
fi

# Forward Stripe events to the local server
echo "Forwarding Stripe events to localhost:3000/api/stripe"
pnpm stripe listen --forward-to http://localhost:3000/api/stripe --forward-connect-to http://localhost:3000/api/stripe
