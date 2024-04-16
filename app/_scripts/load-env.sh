#!/bin/bash
# Don't forget to make the script executable with chmod +x ./app/_scripts/load-env.sh


# Load environment variables from .env.local
# This script is needed by the supabase CLI. As we don't install it globally on our machine,
# we need to load the environment variables from the .env.local file.

set -a  # Automatically export all variables
source .env.local
set +a  # Stop automatically exporting