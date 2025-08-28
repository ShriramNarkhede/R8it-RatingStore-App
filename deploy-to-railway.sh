#!/bin/bash

echo "🚀 Deploying Store Rating App to Railway..."
echo "=============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not found!"
    echo "Please initialize git and push your code to GitHub first."
    exit 1
fi

# Check if changes are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes!"
    echo "Please commit and push your changes before deploying."
    echo ""
    git status --short
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ Git repository is ready"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo "🔐 Logging into Railway..."
railway login

echo "🚀 Creating new Railway project..."
railway init

echo "📝 Setting up environment variables..."
echo "Please set the following environment variables in Railway dashboard:"
echo "  - JWT_SECRET: your_jwt_secret_key"
echo "  - NODE_ENV: production"
echo "  - PORT: 5000"
echo ""

echo "🌐 Deploying backend..."
railway up

echo "✅ Backend deployed successfully!"
echo ""

echo "📊 Your Railway project is now live!"
echo "🔗 Check your Railway dashboard for the deployment URL"
echo ""

echo "📋 Next steps:"
echo "1. Add PostgreSQL database in Railway dashboard"
echo "2. Deploy frontend service"
echo "3. Update frontend API URL to point to your backend"
echo "4. Test your application"
echo ""

echo "🎉 Deployment complete! Check RAILWAY_DEPLOYMENT.md for detailed instructions."
