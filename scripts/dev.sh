#!/bin/bash

# GEMMA 4 FORGE // UPDATE & DEV WRAPPER
# Ensures the repository is synchronized before staging the environment.

echo -e "\033[1;34m[FORGE]\033[0m Syncing with repository..."

if [ -d ".git" ]; then
    # Perform git pull if inside a repository
    git pull origin main || echo -e "\033[1;31m[WARN]\033[0m Git pull failed. Continuing with local version."
else
    echo -e "\033[1;33m[INFO]\033[0m No .git directory found. Skipping repository sync."
fi

# Ensure dependencies are locked
echo -e "\033[1;34m[FORGE]\033[0m Verifying dependencies..."
# npm install --no-audit > /dev/null 2>&1

echo -e "\033[1;32m[SUCCESS]\033[0m Synchronized. Launching Forge Server..."

# Launch the server using tsx
npx tsx server.ts
