@echo off
echo 🔮 Setting up SoulSeer Application...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is required but not installed. Please install Python 3.9+ and try again.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is required but not installed. Please install Node.js 18+ and try again.
    exit /b 1
)

REM Backend setup
echo 📦 Setting up Python backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    copy env.example .env
    echo 📝 Created .env file. Please update it with your actual values.
)

cd ..

REM Frontend setup
echo 📦 Setting up SvelteKit frontend...
cd frontend
npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo VITE_API_URL=http://localhost:8000 > .env
    echo VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key >> .env
    echo VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key >> .env
    echo 📝 Created .env file. Please update it with your actual values.
)

cd ..

echo ✨ Setup complete! To start the application:
echo.
echo 1. Update environment variables in:
echo    - backend\.env
echo    - frontend\.env
echo.
echo 2. Start the backend:
echo    cd backend ^&^& venv\Scripts\activate ^&^& uvicorn app.main:app --reload
echo.
echo 3. Start the frontend (in a new terminal):
echo    cd frontend ^&^& npm run dev
echo.
echo 4. Or use Docker:
echo    docker-compose up
echo.
echo 🌙 Welcome to the mystical realm of SoulSeer!
pause
