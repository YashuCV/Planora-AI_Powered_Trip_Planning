#!/bin/bash

# Script to push Travel Guide AI to GitHub
# Make sure you've created a private repository on GitHub first!

echo "🚀 Pushing Travel Guide AI to GitHub..."
echo ""

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
    echo "✅ Remote 'origin' already configured"
    git remote -v
else
    echo "📋 Please provide your GitHub repository URL:"
    echo "   Example: https://github.com/yourusername/travel-guide-ai.git"
    echo ""
    read -p "Enter repository URL: " REPO_URL
    
    if [ -z "$REPO_URL" ]; then
        echo "❌ No URL provided. Exiting."
        exit 1
    fi
    
    git remote add origin "$REPO_URL"
    echo "✅ Remote added: $REPO_URL"
fi

echo ""
echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Your repository is now available on GitHub (private)"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "   1. Repository exists on GitHub"
    echo "   2. Repository is set to Private"
    echo "   3. You have push access"
    echo "   4. Your GitHub credentials are configured"
fi

