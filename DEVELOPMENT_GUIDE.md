# SoulSeer Development Guide

## 🚀 Quick Start (Fixed Version)

The Clerk backend API issue has been resolved! Here's how to get started:

### 1. Run Setup Script

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
./setup.sh
```

### 2. What Was Fixed

- ✅ Removed problematic `clerk-backend-api` package
- ✅ Added `httpx` for HTTP requests to Clerk API
- ✅ Made Clerk authentication optional for development
- ✅ Added database initialization script
- ✅ Provided sensible defaults for all configuration

### 3. Development Mode

The app now works in **development mode** without requiring:
- Clerk API keys (optional)
- Stripe API keys (optional)
- External database (uses SQLite by default)

### 4. Start the Application

**Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac

uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔧 Configuration

### Environment Variables

The app now has sensible defaults, but you can customize:

**backend/.env:**
```env
# Database (optional - defaults to SQLite)
DATABASE_URL=postgresql://user:password@localhost/soulseer

# JWT Secret (change in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional: Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Optional: Stripe Payments
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

**frontend/.env:**
```env
VITE_API_URL=http://localhost:8000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 🎯 Features Available

### ✅ Working Features
- User authentication (JWT-based)
- User registration and login
- Dashboard for clients
- Reader browsing and filtering
- Live streams interface
- Shop/marketplace
- Community forum
- Contact and help pages
- Responsive design
- Mystical dark theme

### 🔄 Optional Features (Require API Keys)
- Clerk authentication (if you add Clerk keys)
- Stripe payments (if you add Stripe keys)
- Real-time WebRTC (requires TURN server setup)

## 🐛 Troubleshooting

### Common Issues

1. **Python version**: Ensure you have Python 3.9+
2. **Node.js version**: Ensure you have Node.js 18+
3. **Database connection**: Check your DATABASE_URL in backend/.env
4. **Port conflicts**: Make sure ports 5173 and 8000 are available

### Reset Everything

```bash
# Windows
rmdir /s backend\venv
del backend\.env
del frontend\.env
setup.bat

# Linux/Mac
rm -rf backend/venv
rm backend/.env
rm frontend/.env
./setup.sh
```

## 🌙 Next Steps

1. **Test the application** - Everything should work out of the box
2. **Add your API keys** - For production features
3. **Customize the design** - Update colors, fonts, etc.
4. **Deploy** - Use Docker or your preferred platform

The application is now **fully functional** for development and testing! 🎉
