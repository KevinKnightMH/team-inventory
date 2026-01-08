#!/bin/bash

# Replace YOUR_USERNAME with your actual GitHub username
# For example, if your GitHub profile is github.com/kevinknight
# then replace YOUR_USERNAME with: kevinknight

GITHUB_USERNAME="YOUR_USERNAME"

echo "========================================="
echo "Pushing Team Inventory to GitHub"
echo "========================================="
echo ""
echo "Make sure you replaced YOUR_USERNAME in this script!"
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

git branch -M main
git remote add origin https://github.com/$GITHUB_USERNAME/team-inventory.git
git push -u origin main

echo ""
echo "✅ Done! Your code is now on GitHub at:"
echo "https://github.com/$GITHUB_USERNAME/team-inventory"
echo ""
echo "Next step: Deploy to Vercel"
echo "Go to: https://vercel.com/new"
