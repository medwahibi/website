#!/bin/bash

# Quick Deploy Script for Med Wahibi Portfolio
# This script helps you quickly push to GitHub after creating your repository

echo "🚀 Med Wahibi Portfolio - Quick Deploy Script"
echo "=============================================="
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository. Run 'git init' first."
    exit 1
fi

# Check if remote already exists
if git remote | grep -q origin; then
    echo "✅ Remote 'origin' already configured:"
    git remote get-url origin
    echo ""
    read -p "Do you want to push now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📤 Pushing to remote..."
        git push -u origin main
        echo "✅ Push complete!"
    fi
else
    echo "No remote repository configured yet."
    echo ""
    echo "Please enter your GitHub repository URL"
    echo "Example: https://github.com/username/repo.git"
    read -p "Repository URL: " REPO_URL
    
    if [ -z "$REPO_URL" ]; then
        echo "❌ No URL provided. Exiting."
        exit 1
    fi
    
    echo ""
    echo "➕ Adding remote origin: $REPO_URL"
    git remote add origin "$REPO_URL"
    
    echo "📤 Pushing to remote..."
    git push -u origin main
    
    echo ""
    echo "✅ Deployment complete!"
    echo "🌐 Your site is now on GitHub!"
fi

echo ""
echo "Next steps:"
echo "1. Enable GitHub Pages in your repository settings"
echo "2. Your site will be live at: https://[username].github.io/[repo-name]/"
echo ""
