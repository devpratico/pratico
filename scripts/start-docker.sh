#!/bin/bash
# Don't forget to make the script executable with chmod +x ./scripts/start-docker.sh

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
  echo "🐋Starting Docker..."
  open -a Docker
  # Wait for Docker to start
  while ! docker info >/dev/null 2>&1; do
    echo "  Waiting for Docker to launch..."
    sleep 5
  done
fi

echo -e "  Docker is running.\n\n"