#!/bin/bash

echo "🔮 Setting up SoulSeer Application..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed. Please install Python 3.9+ and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Backend setup
echo "📦 Setting up Python backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cp env.example .env
    echo "📝 Created .env file. Please update it with your actual values."
fi

# Initialize database
echo "🗄️ Initializing database..."
python init_db.py

cd ..

# Frontend setup
echo "📦 Setting up SvelteKit frontend..."
cd frontend
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "VITE_API_URL=http://localhost:8000" > .env
    echo "VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key" >> .env
    echo "VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key" >> .env
    echo "📝 Created .env file. Please update it with your actual values."
fi

cd ..

echo "✨ Setup complete! To start the application:"
echo ""
echo "1. Update environment variables in:"
echo "   - backend/.env"
echo "   - frontend/.env"
echo ""
echo "2. Start the backend:"
echo "   cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo ""
echo "3. Start the frontend (in a new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Or use Docker:"
echo "   docker-compose up"
echo ""
echo "🌙 Welcome to the mystical realm of SoulSeer!"
