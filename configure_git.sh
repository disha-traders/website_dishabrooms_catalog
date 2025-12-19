#!/bin/bash

# Display current configuration
echo "--- Current Git Configuration ---"
git config --global --list | grep user
echo "---------------------------------"
echo ""

echo "This script will configure your Git identity for commits."
echo "You can use your personal email or your GitHub noreply email."
echo "(e.g., ID+username@users.noreply.github.com)"
echo ""

# Prompt for Name
read -p "Enter your Name (e.g., Jane Doe): " name

# Prompt for Email
read -p "Enter your Email: " email

# Apply configuration if values are provided
if [[ -n "$name" && -n "$email" ]]; then
    git config --global user.name "$name"
    git config --global user.email "$email"
    
    echo ""
    echo "✅ Git configuration updated successfully!"
    echo "--- New Git Configuration ---"
    git config --global --list | grep user
    echo "-----------------------------"
else
    echo ""
    echo "❌ Error: Name and Email are required. Configuration unchanged."
fi
