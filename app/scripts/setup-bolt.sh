#!/bin/bash

# Script to set up bolt.new dependencies

# Navigate to the project directory
cd "$(dirname "$0")/.."

# Create the bolt directory if it doesn't exist
mkdir -p src/lib/bolt

# Check if bolt.new is already cloned
if [ ! -d "src/lib/bolt/bolt.new" ]; then
  echo "Cloning bolt.new repository..."
  git clone https://github.com/stackblitz/bolt.new src/lib/bolt/bolt.new
else
  echo "bolt.new repository already exists, updating..."
  cd src/lib/bolt/bolt.new
  git pull
  cd ../../../..
fi

# Install bolt.new dependencies
echo "Installing bolt.new dependencies..."
cd src/lib/bolt/bolt.new
npm install

# Return to the project directory
cd ../../../..

echo "bolt.new setup complete!"